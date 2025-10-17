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

export interface RestaurantTypeRatingAvg {
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
  review_count: number;
  interests?: { name: string };
  reviews: { rating_food: number }[];
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

export const fetchRestaurants = async (): Promise<RestaurantTypeRatingAvg[]> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select(
      `
      id,
      name,
      phone,
      address,
      thumbnail_url,
      send_avg_rating,
      status,
      favorite,
      storeintro,
      latitude,
      longitude,
      category_id,
      interests(name),
      reviews(rating_food)
    `,
    )
    .eq('status', 'approved');

  if (error) throw error;

  const formatted = (data ?? []).map(r => {
    // 리뷰들의 평균 별점 직접 계산
    const ratings =
      r.reviews?.map((review: { rating_food: number | null }) => review.rating_food ?? 0) || [];
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
        : 0;

    return {
      ...r,
      send_avg_rating: Math.round(avgRating * 10) / 10, // 실시간 계산된 평균
      review_count: ratings.length,
      interests: Array.isArray(r.interests) ? r.interests[0] : r.interests,
    };
  });

  return formatted;
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

// 사용자 전체 찜 개수
export const getMyFavoritesCount = async (userId: string): Promise<number> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.warn('로그인된 사용자가 없습니다.');
    return 0;
  }

  const { count, error } = await supabase
    .from('restaurants_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', userId);
  // console.log(count);
  if (error) {
    console.error('찜 개수 조회 오류:', error.message);
    return 0;
  }

  return count ?? 0;
};

// 사용자 별점 평균
export const getAvgMyRatingScore = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data, error } = await supabase.from('reviews').select('*').eq('profile_id', user.id);

  if (error) throw error;
  // console.log(data);
  return data;
};
