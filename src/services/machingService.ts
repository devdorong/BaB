import { supabase } from '../lib/supabase';
import type { Matchings } from '../types/bobType';

export const getMatchings = async (): Promise<Matchings[]> => {
  const { data, error } = await supabase
    .from('matchings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error(`매칭 데이터를 불러오는데, 실패하였습니다 . ${error.message}`);
  }
  return data || [];
};

export const createMatching = async (newMaching: Matchings): Promise<any> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }
    const {} = await supabase.from('matchings').select();
  } catch (error) {
    console.log(error);
  }
};
