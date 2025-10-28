import dayjs from 'dayjs';
import { supabase } from './supabase';
import type { Restaurants } from '../types/bobType';

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
  restaurantId: number,
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
      content: `답글등록됨`,
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
