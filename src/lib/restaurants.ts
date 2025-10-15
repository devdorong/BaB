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
  send_avg_rating?: number | null;
  favorite: number | null;
  latitude: string | null;
  longitude: string | null;
  category_id?: number | null;
  interests?: { id: number; name: string; category?: string } | null;
  reviews: { count: number }[];
}

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

// detail page
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
  return data;
};
