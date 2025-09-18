import { supabase } from '../lib/supabase';
import type { Profile_Points } from '../types/bobType';
// 포인트 조회
export const GetPoint = async (): Promise<Profile_Points | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인 필요');
    }

    const { data, error } = await supabase
      .from('profile_points')
      .select('*')
      .eq('profile_id', user.id)
      .maybeSingle();
    if (error) {
      throw new Error(`InitialPoints 오류 : ${error.message}`);
    }

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// 포인트 생성
export const createPoint = async (): Promise<Profile_Points | null> => {
  try {
    // 현재 로그인 한 사용자 정보 가져오기
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인 필요');
    }
    const { data, error } = await supabase
      .from('profile_points')
      .insert({ profile_id: user.id })
      .select('*')
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
  // row가 없으면 새로 insert(default 2000 적용됨)
  //   if (!data) {
  //     const { data: inserted, error: insertError } = await supabase
  //       .from('profile_points')
  //       .insert({ profile_id: user.id });
  //   }
};
