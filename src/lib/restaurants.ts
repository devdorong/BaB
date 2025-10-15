import dayjs from 'dayjs';
import { supabase } from './supabase';

export interface RestaurantsType {
  id: number;
  name: string;
  phone: string;
  address: string;
  thumbnail_url: string;
  status: string | null;
  storeintro?: string | null;
  send_avg_rating?: number | null;
  favorite: number | null;
  latitude: string | null;
  longitude: string | null;
  category_id?: number | null;
  interests?: { name: string } | null;
  reviews: { count: number }[];
}

export interface RestaurantsDetailType {
  id: number;
  name: string;
  phone: string;
  address: string;
  thumbnail_url: string;
  status: string | null;
  storeintro?: string | null;
  opentime?: string | null;
  closetime?: string | null;
  closeday?: string[] | null;
  send_avg_rating?: number | null;
  favorite: number | null;
  latitude: string | null;
  longitude: string | null;
  category_id?: number | null;
  interests?: { id: number; name: string; category?: string } | null;
  reviews: { count: number }[];
}

export type Review = {
  review_id: number;
  restaurant_id: number;
  profile_id: string;
  comment: string | null;
  rating_food: number | null;
  created_at: string;
  updated_at: string;
};

export type ReviewPhoto = {
  photo_id: number;
  review_id: number;
  photo_url: string;
  created_at: string;
};

export type ReviewWithPhotos = Review & {
  review_photos: ReviewPhoto[];
  profiles?: {
    id: string;
    nickname: string;
    avatar_url: string | null;
  } | null;
};

export const fetchRestaurants = async (): Promise<RestaurantsType[]> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select(
      `id, name, phone, address, thumbnail_url, status, send_avg_rating, favorite, storeintro, latitude, longitude, category_id, interests(name),reviews(count)`,
    )
    .eq('status', 'approved');

  // interests를 배열이아닌 객체로 변환
  const normalized = (data ?? []).map(r => ({
    ...r,
    interests: Array.isArray(r.interests) ? r.interests[0] : r.interests,
  }));

  if (error) throw error;
  return normalized ?? [];
};

export const fetchFavoriteRestaurants = async (): Promise<RestaurantsType[]> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    // 찜목록 조회
    const { data: selectFav, error: favErr } = await supabase
      .from('restaurants_favorites')
      .select('restaurant_id')
      .eq('profile_id', user.id);

    if (favErr || !selectFav?.length) return [];

    const restaurantIds = selectFav.map(item => item.restaurant_id);

    // 찜한 식당 정보 가져오기
    const { data: restaurantData, error: restaurantError } = await supabase
      .from('restaurants')
      .select(
        `id, name, phone, address, thumbnail_url, status, send_avg_rating, favorite, storeintro, latitude, longitude, category_id, interests(name),reviews(count)`,
      )
      .in('id', restaurantIds);

    // interests를 배열이아닌 객체로 변환
    const formatted = (restaurantData ?? []).map(r => ({
      ...r,
      interests: Array.isArray(r.interests) ? r.interests[0] : r.interests,
    }));

    if (restaurantError) throw restaurantError;

    return formatted;
  } catch (error) {
    return [];
  }
};

// 디테일 페이지
export const fetchRestaurantDetailId = async (
  id: string,
): Promise<RestaurantsDetailType | null> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select(`*, interests(id,name,category),reviews(count)`)
    .eq('id', id)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  if (!data) return null;

  const formatted: RestaurantsDetailType = {
    ...data,
    opentime: data.opentime ? dayjs(data.opentime, 'HH:mm:ss').format('HH:mm') : null,
    closetime: data.closetime ? dayjs(data.closetime, 'HH:mm:ss').format('HH:mm') : null,
    closeday: data.closeday || [],
  };

  return formatted;
};

// 리뷰 불러오기
export const fetchRestaurantReviews = async (restaurantId: number): Promise<ReviewWithPhotos[]> => {
  const { data, error } = (await supabase
    .from('reviews')
    .select(
      ` review_id,
      restaurant_id,
      profile_id,
      comment,
      rating_food,
      created_at,
      updated_at,
      profiles (
        id,
        nickname,
        avatar_url
      ),
      review_photos (
        photo_id,
        photo_url,
        created_at
      )`,
    )
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })) as {
    data: ReviewWithPhotos[] | null;
    error: any;
  };

  if (error) {
    return [];
  }

  const formatted: ReviewWithPhotos[] = (data ?? []).map(review => ({
    ...review,
    profiles: review.profiles ?? null,
    review_photos: review.review_photos ?? [],
  }));

  return formatted;
};

// 찜 개수 불러오기
export const getFavoriteCount = async (restaurantId: number): Promise<number> => {
  const { count, error } = await supabase
    .from('restaurants_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurantId);

  if (error) {
    return 0;
  }
  return count ?? 0;
};

// 이미 찜한식당인지 확인
export const checkFavoriteRest = async (restaurantId: number): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('restaurants_favorites')
    .select('id')
    .eq('profile_id', user.id)
    .eq('restaurant_id', restaurantId)
    .maybeSingle();

  if (error) return false;

  return !!data;
};

// 찜 토글
export const toggleFavorite = async (restaurantId: number): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert('로그인이 필요합니다.');
    return false;
  }

  const { data: exists } = await supabase
    .from('restaurants_favorites')
    .select('id')
    .eq('profile_id', user.id)
    .eq('restaurant_id', restaurantId)
    .maybeSingle();

  if (exists) {
    const { error } = await supabase
      .from('restaurants_favorites')
      .delete()
      .eq('profile_id', user.id)
      .eq('restaurant_id', restaurantId);
    if (error) return false;
    return false;
  } else {
    // 찜 등록
    const { error } = await supabase.from('restaurants_favorites').insert([
      {
        profile_id: user.id,
        restaurant_id: restaurantId,
      },
    ]);
    if (error) return false;
    return true;
  }
};

interface insertReviewProps {
  restaurantId: number;
  profileId: string;
  content: string;
  rating_food: number;
  files: File[];
}

export const insertReview = async ({
  restaurantId,
  profileId,
  content,
  rating_food,
  files,
}: insertReviewProps): Promise<boolean> => {
  try {
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert([
        {
          restaurant_id: restaurantId,
          profile_id: profileId,
          comment: content,
          rating_food,
        },
      ])
      .select()
      .single();

    if (reviewError || !review) throw new Error('리뷰 생성 실패');

    // 이미지파일 스토리지 업로드
    if (files.length > 0) {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const url = await uploadReviewPhotos(file, review.review_id);
        if (url) uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        const photoRows = uploadedUrls.map(photoUrl => ({
          review_id: review.review_id,
          photo_url: photoUrl,
        }));

        const { error: photoError } = await supabase.from('review_photos').insert(photoRows);

        if (photoError) throw photoError;
      }
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// 리뷰 사진 업로드
export const uploadReviewPhotos = async (file: File, reviewId: number): Promise<string | null> => {
  try {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('지원하지 않는 이미지 형식');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${reviewId}-${Date.now()}.${fileExt}`;
    const filePath = `reviews/${reviewId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('review_photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw new Error(`업로드 실패: ${uploadError.message}`);

    const {
      data: { publicUrl },
    } = supabase.storage.from('review_photos').getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.log(err);
    return null;
  }
};
