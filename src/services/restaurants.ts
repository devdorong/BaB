import { supabase } from '../lib/supabase';
import type { Database, Interests, Restaurants } from '../types/bobType';

// 레스토랑 불러오기
export const getMyRestaurant = async (): Promise<Restaurants | null> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('로그인 상태가 아닙니다.');

    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('profile_id', user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data ?? null;
  } catch (err) {
    console.error('getMyRestaurant 오류:', err);
    return null;
  }
};

export const getRestaurantById = async (
  restaurantId: number,
): Promise<(Restaurants & { interests?: Interests | null }) | null> => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', restaurantId)
    .single();
  if (error) {
    console.log(error);
  }
  if (data.category_id) {
    const { data: interest } = await supabase
      .from('interests')
      .select('id, name, category')
      .eq('id', data.category_id)
      .single();

    return { ...data, interests: interest };
  }
  return data;
};

export const getRestaurantReviewStats = async (restaurantId: number) => {
  try {
    // 방법 1: SQL 쿼리로 평균과 개수를 한 번에 조회
    const { data, error } = await supabase
      .from('reviews')
      .select('rating_food')
      .eq('restaurant_id', restaurantId)
      .not('rating_food', 'is', null);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        restaurantId,
        averageRating: null,
        reviewCount: 0,
        message: '리뷰가 없습니다.',
      };
    }

    // 평균 계산
    const averageRating = data.reduce((sum, review) => sum + review.rating_food, 0) / data.length;

    return {
      restaurantId,
      averageRating: Math.round(averageRating * 10) / 10, // 소수점 1자리
      reviewCount: data.length,
    };
  } catch (error) {
    console.error('Error fetching review stats:', error);
    throw error;
  }
};
