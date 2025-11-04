import dayjs from 'dayjs';
import { supabase } from './supabase';
import type { Restaurants, RestaurantsUpdate } from '../types/bobType';
import { getMyRestaurant } from '@/services/restaurants';

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
  reviews: { count: number; rating_food: number }[];
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
        `id, name, phone, address, thumbnail_url, status, send_avg_rating, favorite, storeintro, latitude, longitude, category_id, interests(name),reviews(rating_food)`,
      )
      .in('id', restaurantIds);

    if (restaurantError) throw restaurantError;

    // 평균 별점 계산 + interests 정리
    const formatted = (restaurantData ?? []).map(r => {
      const ratings = r.reviews?.map(rv => rv.rating_food ?? 0) || [];
      const avg = ratings.length > 0 ? ratings.reduce((sum, v) => sum + v, 0) / ratings.length : 0;

      return {
        ...r,
        send_avg_rating: Math.round(avg * 10) / 10,
        review_count: ratings.length,
        interests: Array.isArray(r.interests) ? r.interests[0] : r.interests,
      };
    });

    return formatted as any;
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

export const getRestaurantById = async (
  restaurantId: number | string,
): Promise<RestaurantsDetailType | null> => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single();

    if (error) {
      console.error('레스토랑 조회 실패:', error);
      return null;
    }

    if (!data) return null;

    return {
      ...data,
      opentime: data.opentime,
      closetime: data.closetime,
      closeday: data.closeday || [],
    } as RestaurantsDetailType;
  } catch (err) {
    console.error('getRestaurantById 에러:', err);
    return null;
  }
};

// 사장님 리뷰 댓글 불러오기
export const fetchReviewComments = async (reviewId: number) => {
  const { data, error } = await supabase
    .from('review_comments')
    .select(
      `
      id,
      review_id,
      content,
      created_at,
      profiles (
        id,
        nickname,
        avatar_url
      )
    `,
    )
    .eq('review_id', reviewId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`댓글 불러오기 실패: ${error.message}`);
  return data;
};

// 사장님 리뷰 댓글 작성
export const insertReviewComment = async (reviewId: number, content: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // 리뷰에 댓글이 있는지 확인
  const { data: existing, error: checkError } = await supabase
    .from('review_comments')
    .select('id')
    .eq('review_id', reviewId)
    .eq('profile_id', user.id)
    .maybeSingle();

  if (checkError) throw new Error('댓글 중복 확인 실패');
  if (existing) throw new Error('이미 댓글 존재');
  // 새 댓글 작성
  const { data, error } = await supabase
    .from('review_comments')
    .insert({ review_id: reviewId, profile_id: user.id, content })
    .select(`id,content,created_at,profiles(id,nickname, avatar_url)`)
    .single();

  if (error) throw new Error(`댓글 작성 실패 : ${error.message}`);

  // 리뷰 작성자 가져오기
  const { data: reviewData, error: reviewError } = await supabase
    .from('reviews')
    .select('profile_id, restaurant_id')
    .eq('review_id', reviewId)
    .single();

  if (reviewError || !reviewData) {
    console.error('리뷰 작성자 정보를 불러올 수 없습니다.');
    return;
  }

  const { data: restaurantData, error: restError } = await supabase
    .from('restaurants')
    .select('name')
    .eq('id', reviewData.restaurant_id)
    .single();

  if (restError || !restaurantData) {
    return;
  }

  const reviewAuthorId = reviewData.profile_id;
  const restaurantName = restaurantData.name;

  // 댓글 알림 추가
  const { error: notificationError } = await supabase.from('notifications').insert([
    {
      profile_id: user.id,
      receiver_id: reviewAuthorId,
      title: `${restaurantName}사장님이 리뷰에 답글을 남기셨습니다.`,
      content: `${reviewData.restaurant_id}`,
      target: 'all',
      type: '댓글',
    },
  ]);

  if (notificationError) {
    console.log(notificationError.message);
  }

  return data;
};

export const deleteReviewComment = async (commentId: number) => {
  const { error } = await supabase.from('review_comments').delete().eq('id', commentId);

  if (error) throw new Error(`댓글 삭제 실패 ${error.message}`);
};

export interface RestaurantMenusProps {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  is_active: boolean;
  restaurants: {
    id: number;
    name: string;
  }[];
}

// 레스토랑 메뉴 불러오기
export const fetchRestaurantMenus = async (
  restaurantId: number,
): Promise<RestaurantMenusProps[]> => {
  const { data, error } = await supabase
    .from('menus')
    .select(`id,name,description,price,image_url,category,is_active,restaurants(id, name)`)
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true);
  // .order('id', { ascending: true });

  if (error) throw new Error(`메뉴 불러오기 실패: ${error.message}`);
  return data ?? [];
};

// 가게 이미지 업로드
export const uploadRestaurant = async (
  file: File,
  RestaurantId: string,
): Promise<string | null> => {
  try {
    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`지원하지 않는 파일 형식입니다. 허용 형식: ${allowedTypes.join(', ')}`);
    }
    // 기존에 만약 아바타 이미지가 있으면 무조건 삭제부터 합니다.
    const result = await cleanupUserRestaurants(RestaurantId);
    if (!result) {
      console.log('파일 못 지웠어요.');
    }

    // 파일명이 중복되지 않도록 이름을 생성함.
    const fileExt = file.name.split('.').pop();
    const fileName = `${RestaurantId}-${Date.now()}.${fileExt}`;
    const filePath = `restaurants/${fileName}`;

    // 파일 업로드 : upload(파일명, 실제파일, 옵션)
    const { error } = await supabase.storage.from('store_photos').upload(filePath, file, {
      cacheControl: '3600', // 3600 초는 1시간 동안 파일 캐시 적용
      upsert: false, // 동일한 파일명은 덮어씌운다.
    });
    if (error) {
      throw new Error(`업로드 실패 : ${error.message}`);
    }
    //  https 문자열로 주소를 알아내서 활용
    const {
      data: { publicUrl },
    } = supabase.storage.from('store_photos').getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    throw new Error(`가게 이미지 업로드 오류가 발생했습니다. : ${err}`);
  }
};

// 가게 이미지는 한장을 유지해야 하므로 모두 제거하는 기능 필요
export const cleanupUserRestaurants = async (RestaurantId: string): Promise<boolean> => {
  try {
    const { data, error: listError } = await supabase.storage
      .from('store_photos')
      .list('restaurants', { limit: 1000 });
    if (listError) {
      console.log(`목록 요청 에러 : ${listError.message}`);
      return false;
    }
    // userId 에 해당하는 것만 필터링 해서 삭제해야 함.
    if (data && data.length > 0) {
      const userFile = data.filter(item => item.name.startsWith(`${RestaurantId}-`));
      if (userFile && userFile.length > 0) {
        const filePaths = userFile.map(item => `restaurants/${item.name}`);
        const { error: removeError } = await supabase.storage
          .from('store_photos')
          .remove(filePaths);
        if (removeError) {
          console.log(`파일 삭제 에러 : ${removeError.message}`);
          return false;
        }
        return true;
      }
    }
    return true;
  } catch (error) {
    console.log(`아바타 이미지 전체 삭제 오류 : ${error}`);
    return false;
  }
};

// 레스토랑 이미지 제거
export const removeRestaurant = async (RestaurantId: string | number): Promise<boolean> => {
  try {
    // 현재 로그인 한 사용자의 avartar_url 을 읽어와야 합니다.
    // 여기서 파일명을 추출함.
    const idstr = String(RestaurantId);
    const restaurant = await getRestaurantById(idstr);
    // 사용자의 avatar_url 이 없다면
    if (!restaurant?.thumbnail_url) {
      return true; // 작업완료
    }
    // 1. 만약 avartar_url 이 존재하면 이름 파악, 파일 삭제
    let deleteSuccess = false;
    try {
      // url 에 파일명을 찾아야 함. (url 로 변환하면 path 와 파일구분이 수월함)
      const url = new URL(restaurant.thumbnail_url);
      const pathParts = url.pathname.split('/');
      const publicIndex = pathParts.indexOf('public');
      if (publicIndex !== -1 && publicIndex + 1 < pathParts.length) {
        const bucketName = pathParts[publicIndex + 1];
        const filePath = pathParts.slice(publicIndex + 2).join('/');
        // 실제로 찾아낸 bucketName 과 filePath 로 삭제
        const { data, error } = await supabase.storage.from(bucketName).remove([filePath]);
        if (error) {
          throw new Error('파일을 찾았지만, 삭제에는 실패했어요.');
        }
        // 파일 삭제 성공
        deleteSuccess = true;
      }
    } catch (err) {}
    // 2. 만약 avatar_url 을 제대로 파싱 못했다면?
    if (!deleteSuccess) {
      try {
        // 전체 목록을 일단 읽어옴.
        const { data: files, error: listError } = await supabase.storage
          .from('store_photos')
          .list('restaurants', { limit: 1000 });

        if (!listError && files && files.length > 0) {
          const userFiles = files.filter(item => TimeRanges.name.startsWith(`${RestaurantId}-`));
          if (userFiles.length > 0) {
            const filePath = userFiles.map(item => `restaurants/${item.name}`);
            const { error } = await supabase.storage.from('store_photos').remove(filePath);
            if (!error) {
              deleteSuccess = true;
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
};

export const updateRestaurant = async (
  editRestaurant: RestaurantsUpdate,
  restaurantId: string,
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('restaurants')
      .update({ ...editRestaurant })
      .eq('id', restaurantId);

    if (error) {
      console.log(error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
