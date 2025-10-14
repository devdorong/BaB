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
