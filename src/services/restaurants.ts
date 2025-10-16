import { supabase } from '../lib/supabase';
import type { Database } from '../types/bobType';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

// 레스토랑 불러오기
export const getMyRestaurant = async (): Promise<Restaurant | null> => {
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
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ?? null;
  } catch (err) {
    console.error('getMyRestaurant 오류:', err);
    return null;
  }
};
