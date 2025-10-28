import { supabase } from '../lib/supabase';
import type { Matchings, MatchingsInsert, MatchingsUpdate } from '../types/bobType';

export type MatchingWithRestaurant = Matchings & {
  restaurants: {
    id: number;
    name: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    category_id: number | null;
    storeintro: string | null;
    interests: {
      name: string;
    } | null;
  } | null;
};

// 모든 매칭 불러오기
export const getMatchings = async (): Promise<Matchings[]> => {
  const { data, error } = await supabase
    .from('matchings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    // console.log('getMatchings 에러 : ', error.message);
    throw new Error(error.message);
  }
  return data ?? [];
};

export const getMatchingsWithRestaurant = async (): Promise<MatchingWithRestaurant[]> => {
  const { data, error } = await supabase
    .from('matchings')
    .select(
      `
      *,
      restaurants (
        id,
        name,
        address,
        latitude,
        longitude,
        category_id,
        storeintro,
        interests (
          name
        )
      )
    `,
    )
    .order('created_at', { ascending: false });

  if (error) {
    // console.log('getMatchingsWithRestaurant 에러 : ', error.message);
    throw new Error(error.message);
  }
  return data ?? [];
};

// 매칭 아이디로 매칭 정보 불러오기
export const getMatchingById = async (matchingId: number): Promise<Matchings> => {
  const { data, error } = await supabase
    .from('matchings')
    .select('*')
    .eq('id', matchingId)
    .single();
  if (error) {
    // console.log('getMatchingById 에러 : ', error.message);
    throw new Error(error.message);
  }
  return data ?? null;
};

// 매칭 생성
export const createMatching = async (newMatching: MatchingsInsert): Promise<number> => {
  const { data, error } = await supabase
    .from('matchings')
    .insert({ ...newMatching })
    .select('id')
    .single();

  if (error) {
    // console.log('createMatching 에러 : ', error.message);
    throw new Error(error.message);
  }

  // Host를 자동으로 참가자에 추가
  if (data?.id) {
    await addMatchingParticipant(data.id, newMatching.host_profile_id, 'host');
  }

  return data?.id;
};

// 매칭 업데이트
export const updateMatching = async (
  matchingId: number,
  updatedMatching: MatchingsUpdate,
): Promise<void> => {
  // console.log('🔄 updateMatching 시작:', { matchingId, updatedMatching });

  const { data, error } = await supabase
    .from('matchings')
    .update(updatedMatching)
    .eq('id', matchingId)
    .select(); // select()를 추가해서 실제 업데이트된 데이터 확인

  // console.log('업데이트 결과:', { data, error });

  if (error) {
    // console.error('❌ updateMatching 에러:', error);
    throw new Error(error.message);
  }

  // RLS로 인해 에러는 없지만 실제로 업데이트가 안 된 경우 체크
  if (!data || data.length === 0) {
    // console.error('⚠️ RLS 정책으로 인해 업데이트가 차단되었습니다!');
    throw new Error('매칭 업데이트 권한이 없습니다. (RLS 정책 확인 필요)');
  }

  // console.log('✅ updateMatching 완료:', data);
};

// 매칭 삭제 (soft delete)
export const deleteMatching = async (matchingId: number): Promise<void> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error('로그인 상태가 아닙니다.');

  // 매칭 참가자 정보 불러오기
  const { data: matchingUser, error: matchingUserError } = await supabase
    .from('matching_participants')
    .select('profile_id')
    .eq('matching_id', matchingId);

  if (matchingUserError || !matchingUser?.length) {
    // console.error('매칭 참가자 정보 불러올 수 없음');
    return;
  }

  const { data: matching, error: matchingError } = await supabase
    .from('matchings')
    .select('id, status')
    .eq('id', matchingId)
    .single();

  if (matchingError) {
    // console.error('매칭 삭제 에러:', matchingError.message);
    throw new Error(matchingError.message);
  }

  if (matching.status === 'cancel') {
    // console.warn('이미 취소된 매칭입니다.');
    return;
  }

  const { error: updateError } = await supabase
    .from('matchings')
    .update({ status: 'cancel' })
    .eq('id', matchingId);

  if (updateError) {
    // console.error('매칭 상태 업데이트 실패:', updateError.message);
    throw new Error(updateError.message);
  }

  const notification = matchingUser
    .filter(u => u.profile_id !== user.id)
    .map(u => ({
      profile_id: user.id,
      receiver_id: u.profile_id,
      title: '매칭연결이 취소되었습니다.',
      content: '',
      target: 'all',
      type: '매칭취소',
    }));

  if (notification.length > 0) {
    const { error: notificationError } = await supabase.from('notifications').insert(notification);
    if (notificationError) {
      // console.log(notificationError.message);
      throw new Error(notificationError.message);
    }
  }

  // console.log(`매칭 ${matchingId} → cancel 처리 완료`);
};

// 참가자 추가
export const addMatchingParticipant = async (
  matchingId: number,
  profileId: string,
  role: 'host' | 'member' = 'member',
): Promise<void> => {
  // console.log('addMatchingParticipant 호출:', { matchingId, profileId, role });
  // 1. 매칭 정보와 현재 참가자 수 확인
  const { data: matching, error: matchingError } = await supabase
    .from('matchings')
    .select('desired_members, status')
    .eq('id', matchingId)
    .single();

  if (matchingError) {
    throw new Error(`매칭 조회 실패: ${matchingError.message}`);
  }

  if (matching.status !== 'waiting') {
    throw new Error('이미 진행 중이거나 종료된 매칭입니다');
  }

  const { count, error: countError } = await supabase
    .from('matching_participants')
    .select('id', { count: 'exact', head: true })
    .eq('matching_id', matchingId);

  if (countError) {
    throw new Error(`참가자 수 조회 실패: ${countError.message}`);
  }

  // count가 null이면 0으로 처리
  const currentCount = count ?? 0;

  // 2. 정원 체크
  if (currentCount >= matching.desired_members) {
    throw new Error('이미 정원이 가득 찼습니다');
  }

  // 3. 참가자 추가
  const { data, error: insertError } = await supabase
    .from('matching_participants')
    .insert({ matching_id: matchingId, profile_id: profileId, role })
    .select();

  // console.log('삽입된 데이터:', data);

  if (insertError) {
    if (insertError.code === '23505') {
      throw new Error('이미 참여한 사용자입니다');
    }
    throw new Error(`참가자 추가 실패: ${insertError.message}`);
  }

  // 4. 정원 도달 시 상태 업데이트
  if (currentCount + 1 === matching.desired_members) {
    await updateMatchingStatus(matchingId, 'full');

    // 매칭 참가자 정보 불러오기
    const { data: matchingUser, error: matchingUserError } = await supabase
      .from('matching_participants')
      .select('profile_id')
      .eq('matching_id', matchingId);

    if (matchingUserError || !matchingUser?.length) {
      // console.error('매칭 참가자 정보 불러올 수 없음');
      return;
    }

    const notification = matchingUser.map(u => ({
      profile_id: profileId,
      receiver_id: u.profile_id,
      title: '매칭연결이 완료되었습니다.',
      content: '',
      target: 'all',
      type: '매칭완료',
    }));
    const { error: notificationError } = await supabase.from('notifications').insert(notification);

    if (notificationError) {
      // console.log(notificationError.message);
      throw new Error(notificationError.message);
    }
  }
};

// 참가자 제거
export const removeMatchingParticipant = async (
  matchingId: number,
  profileId: string,
): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log('현재 로그인 사용자:', user?.id);
  // console.log('제거하려는 사용자:', profileId);
  // 1. 참가자 삭제 (일반 권한)
  const { error } = await supabase
    .from('matching_participants')
    .delete()
    .eq('matching_id', matchingId)
    .eq('profile_id', profileId);

  if (error) {
    // console.log('removeMatchingParticipant 에러 : ', error.message);
    throw new Error(error.message);
  }

  // 2. 매칭 정보 조회 (일반 권한)
  const { data: matching, error: matchingError } = await supabase
    .from('matchings')
    .select('status, desired_members')
    .eq('id', matchingId)
    .single();

  if (matchingError) {
    // console.log('매칭 정보 조회 에러:', matchingError.message);
    return;
  }

  // 3. full 상태인 경우에만 처리
  if (matching?.status === 'full') {
    // console.log('✅ 매칭이 full 상태입니다. 참가자 수 확인 중...');

    const currentCount = await getParticipantCount(matchingId);
    // console.log('현재 참가자 수:', currentCount, '정원:', matching.desired_members);

    if (currentCount < matching.desired_members) {
      // console.log('🔄 waiting으로 상태 변경 시도...');

      // ✨ 새로운 status 전용 함수 사용
      await updateMatchingStatus(matchingId, 'waiting');

      // console.log(`✅ 매칭 ${matchingId} 상태가 waiting으로 변경됨`);
    } else {
      // console.log('⚠️ 여전히 정원이 찼습니다. 상태 변경 안 함');
    }
  } else {
    // console.log('⚠️ 매칭 상태가 full이 아닙니다:', matching?.status);
  }

  // console.log('=== removeMatchingParticipant 종료 ===');
};

// 매칭의 모든 참가자 조회
export const getMatchingParticipants = async (matchingId: number) => {
  const { data, error } = await supabase
    .from('matching_participants')
    .select('id, profile_id, joined_at,role')
    .eq('matching_id', matchingId);

  if (error) {
    console.log('getMatchingParticipants 에러 : ', error.message);
    throw new Error(error.message);
  }

  return data ?? [];
};

// 사용자가 참여한 매칭 조회
// export const getUserMatchings = async (profileId: string) => {
//   const { data, error } = await supabase
//     .from('matching_participants')
//     .select('matchings(*)')
//     .eq('profile_id', profileId);

//   if (error) {
//     console.log('getUserMatchings 에러 : ', error.message);
//     throw new Error(error.message);
//   }

//   return data ?? [];
// };
export const getUserMatchings = async (profileId: string): Promise<Matchings[]> => {
  const { data: participants, error: partError } = await supabase
    .from('matching_participants')
    .select('matching_id')
    .eq('profile_id', profileId);

  if (partError) {
    // console.error('참여 매칭 조회 실패:', partError.message);
    throw new Error(partError.message);
  }

  // 매칭 ID 배열 만들기
  const matchingIds = participants?.map(p => p.matching_id) ?? [];

  if (matchingIds.length === 0) {
    return [];
  }

  const { data: matchings, error: matchError } = await supabase
    .from('matchings')
    .select('*')
    .in('id', matchingIds);

  if (matchError) {
    // console.error('매칭 데이터 조회 실패:', matchError.message);
    throw new Error(matchError.message);
  }

  return matchings ?? [];
};

// 참가자 수 조회
export const getParticipantCount = async (matchingId: number): Promise<number> => {
  const { count, error } = await supabase
    .from('matching_participants')
    .select('id', { count: 'exact', head: true })
    .eq('matching_id', matchingId);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
};

type SimilarMatchingWithRestaurant = Matchings & {
  restaurants: {
    id: number;
    name: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    category_id: number | null;
    interests: { name: string } | null;
  };
};

// 비슷한 매칭 찾기
export const getSimilarMatchings = async (
  currentMatchingId: number,
  restaurantId: number,
  limit: number = 3,
): Promise<Matchings[]> => {
  try {
    // 1. 현재 레스토랑의 카테고리 ID 조회
    const { data: currentRestaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('category_id')
      .eq('id', restaurantId)
      .single();

    if (restaurantError || !currentRestaurant?.category_id) {
      console.log('레스토랑 카테고리 조회 실패:', restaurantError?.message);
      return [];
    }

    // 2. 같은 카테고리를 가진 레스토랑들의 ID 조회
    const { data: similarRestaurants, error: similarRestError } = await supabase
      .from('restaurants')
      .select('id')
      .eq('category_id', currentRestaurant.category_id)
      .neq('id', restaurantId); // 현재 레스토랑 제외

    if (similarRestError) {
      // console.log('비슷한 레스토랑 조회 실패:', similarRestError.message);
      return [];
    }

    const restaurantIds = similarRestaurants?.map(r => r.id) || [];

    if (restaurantIds.length === 0) {
      return [];
    }

    // 3. 해당 레스토랑들의 매칭 조회 (현재 매칭 제외, 최신순, 대기중인것만)
    const { data: matchings, error: matchingsError } = await supabase
      .from('matchings')
      .select('*')
      .in('restaurant_id', restaurantIds)
      .neq('id', currentMatchingId)
      .eq('status', 'waiting')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (matchingsError) {
      console.log('비슷한 매칭 조회 실패:', matchingsError.message);
      return [];
    }

    return matchings || [];
  } catch (error) {
    console.error('getSimilarMatchings 에러:', error);
    return [];
  }
};

// 비슷한 매칭을 레스토랑 정보와 함께 조회
export const getSimilarMatchingsWithRestaurant = async (
  currentMatchingId: number,
  restaurantId: number,
  limit: number = 3,
): Promise<SimilarMatchingWithRestaurant[]> => {
  try {
    // 1. 현재 레스토랑의 카테고리 ID 조회
    const { data: currentRestaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('category_id, interests(name)')
      .eq('id', restaurantId)
      .single();

    if (restaurantError || !currentRestaurant?.category_id) {
      return [];
    }

    // 2. 같은 카테고리의 다른 매칭들을 레스토랑 정보와 함께 조회
    const { data: matchings, error: matchingsError } = await supabase
      .from('matchings')
      .select(
        `
        *,
        restaurants!inner(
          id,
          name,
          address,
          latitude,
          longitude,
          category_id,
          interests(name)
        )
      `,
      )
      .neq('id', currentMatchingId)
      .eq('status', 'waiting')
      .eq('restaurants.category_id', currentRestaurant.category_id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (matchingsError) {
      console.log('비슷한 매칭 조회 실패:', matchingsError.message);
      return [];
    }

    return (matchings as SimilarMatchingWithRestaurant[]) || [];
  } catch (error) {
    console.error('getSimilarMatchingsWithRestaurant 에러:', error);
    return [];
  }
};

export const quickJoinMatching = async (userId: string) => {
  const { data: matchings, error } = await supabase
    .from('matchings')
    .select('id, desired_members,status, created_at')
    .eq('status', 'waiting')
    .order('created_at', { ascending: true }); // 오래된 순 우선

  if (error) throw error;
  if (!matchings || matchings.length === 0) {
    return { success: false, message: '참여 가능한 매칭이 없습니다.' };
  }

  const withCounts = await Promise.all(
    matchings.map(async m => {
      const count = await getParticipantCount(m.id);
      return { ...m, participantCount: count, remaining: m.desired_members - count };
    }),
  );

  const sorted = withCounts
    .filter(m => m.remaining > 0)
    .sort((a, b) => {
      if (a.remaining === b.remaining) {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return a.remaining - b.remaining;
    });

  const target = sorted[0];
  if (!target) {
    return { success: false, message: '참여 가능한 매칭이 없습니다.' };
  }

  const { data: existing, error: existError } = await supabase
    .from('matching_participants')
    .select('id')
    .eq('matching_id', target.id)
    .eq('profile_id', userId)
    .maybeSingle();

  if (existError) throw existError;
  if (existing) {
    return { success: false, message: '이미 해당 매칭에 참가 중입니다.' };
  }

  const { error: insertError } = await supabase
    .from('matching_participants')
    .insert({ matching_id: target.id, profile_id: userId });

  if (insertError) throw insertError;

  const newCount = await getParticipantCount(target.id);
  if (newCount >= target.desired_members && target.status === 'waiting') {
    await updateMatchingStatus(target.id, 'full');
  }

  return { success: true, joinedMatchingId: target.id, message: '매칭에 자동 참여되었습니다.' };
};

export const updateMatchingStatus = async (
  matchingId: number,
  newStatus: 'waiting' | 'full' | 'completed' | 'cancel',
): Promise<void> => {
  // console.log('🔄 updateMatchingStatus 시작:', { matchingId, newStatus });

  const { data, error } = await supabase
    .from('matchings')
    .update({ status: newStatus })
    .eq('id', matchingId)
    .select('id, status'); // status만 확인

  console.log('상태 업데이트 결과:', { data, error });

  if (error) {
    // console.error('❌ updateMatchingStatus 에러:', error.message);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    // console.error('⚠️ RLS 정책으로 인해 업데이트가 차단되었습니다!');
    throw new Error('매칭 상태 업데이트 권한이 없습니다.');
  }

  // console.log('✅ updateMatchingStatus 완료:', data);
};
