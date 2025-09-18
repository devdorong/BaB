import { supabase } from '../lib/supabase';
import type { Matchings } from '../types/bobType';

const createMaching = async (newMaching: Matchings): Promise<any> => {
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
