import { supabase } from '../lib/supabase';
import type { Point_Changes, Profile_Coupons, Profile_Points } from '../types/bobType';

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
      .single();
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
      .insert({ profile_id: user.id, point: 2000 })
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
};

// 포인트 교환
export const changePoint = async (couponId: number, requiredPoint: number) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인 필요');
    }

    const { data, error } = await supabase
      .from('profile_points')
      .select('point')
      .eq('profile_id', user.id)
      .single();

    console.log(user.id);
    if (error) throw error;
    if (!data || data.point < requiredPoint) {
      throw new Error('포인트 부족');
    }

    // 포인트 차감
    const subPoint = data.point - requiredPoint;
    const { data: updatedData, error: subPointError } = await supabase
      .from('profile_points')
      .update({ point: subPoint })
      .eq('profile_id', user.id)
      .select('*')
      .single();

    if (subPointError) throw subPointError;

    // 쿠폰 발급
    const { error: couponError } = await supabase
      .from('profile_coupons')
      .insert([{ profile_id: user.id, coupon_id: couponId }]);
    if (couponError) throw couponError;

    // 포인트 사용 로그 기록
    const { error: logError } = await supabase.from('point_changes').insert([
      {
        profile_id: user.id,
        amount: requiredPoint,
        change_type: 'coupon_redeem',
      },
    ]);
    if (logError) throw logError;

    return { success: true, subPoint };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
};

// 총 사용 포인트
export const totalChangePoint = async (): Promise<number> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인 필요');
    }

    const { data, error } = await supabase
      .from('point_changes')
      .select('*')
      .eq('profile_id', user.id)
      .eq('change_type', 'coupon_redeem');
    if (error) throw error;

    // 합계 계산
    return data?.reduce((sum, row: Point_Changes) => sum + row.amount, 0) ?? 0;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
