import { supabase } from '../lib/supabase';
import type { Point_Changes, Profile_Points } from '../types/bobType';

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

// 포인트 조회 또는 생성 (UPSERT 방식) - 중복 생성 방지
export const GetOrCreatePoint = async (): Promise<Profile_Points | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인 필요');
    }

    // 먼저 기존 포인트 조회 시도
    const { data: existingPoint, error: selectError } = await supabase
      .from('profile_points')
      .select('*')
      .eq('profile_id', user.id)
      .maybeSingle();

    if (selectError) {
      // console.error('기존 포인트 조회 에러:', selectError);
      throw selectError;
    }

    // 이미 포인트가 존재하면 반환
    if (existingPoint) {
      // console.log('기존 포인트 반환:', existingPoint.point);
      return existingPoint;
    }

    // 포인트가 없으면 생성 (UNIQUE 제약조건으로 중복 방지)
    console.log('포인트가 없어서 새로 생성합니다.');
    const { data: newPoint, error: insertError } = await supabase
      .from('profile_points')
      .insert({ profile_id: user.id })
      .select('*')
      .single();

    if (insertError) {
      // UNIQUE 제약조건 위반 시 (동시 생성으로 인한 경합)
      if (insertError.code === '23505') {
        console.log('동시 생성 감지, 기존 데이터 재조회');
        // 다시 조회해서 반환
        const { data: retryData, error: retryError } = await supabase
          .from('profile_points')
          .select('*')
          .eq('profile_id', user.id)
          .single();

        if (retryError) throw retryError;
        return retryData;
      }
      throw insertError;
    }

    console.log('새 포인트 생성 완료:', newPoint.point);
    return newPoint;
  } catch (error) {
    console.error('GetOrCreatePoint 에러:', error);
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
      .maybeSingle();

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

// 매일 접속 시 마다 포인트 적립
export const givePoint = async (): Promise<boolean> => {
  try {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인 필요');
    }

    // 오늘 출석 했는지 확인
    const { data, error } = await supabase
      .from('point_changes')
      .select('id')
      .eq('profile_id', user.id)
      .eq('change_type', 'daily_login')
      .gte('created_at', start) // start보다 크거나 같은 값
      .lte('created_at', end) // end보다 작거나 같은 값
      .maybeSingle();

    if (error) throw new Error(`출석 실패 : ${error.message}`);

    if (data) {
      return false; // 이미 출석체크를 했으므로 포인트 지급하지 않음
    }

    const amount = 10;

    // 1. 포인트 지급
    const { error: addPointError } = await supabase
      .from('point_changes')
      .insert([{ profile_id: user.id, change_type: 'daily_login', amount }]);

    if (addPointError) throw addPointError;

    // 2. profile_points 존재 확인 및 생성 (필요시)
    const profilePoint = await GetOrCreatePoint();
    if (!profilePoint) {
      throw new Error('profile_points 생성/조회 실패');
    }

    // 3. 포인트 업데이트 (에러 처리 추가)
    const { data: updatedPoint, error: updateError } = await supabase
      .from('profile_points')
      .update({ point: profilePoint.point + amount })
      .eq('profile_id', user.id)
      .select('*')
      .single();

    if (updateError) {
      console.error('포인트 업데이트 실패:', updateError);
      throw updateError;
    }

    return true;
  } catch (err) {
    return false;
  }
};
