import { supabase } from '../lib/supabase';
import type { Matchings, MatchingsInsert, MatchingsUpdate } from '../types/bobType';

export const getMatchings = async (): Promise<Matchings[]> => {
  const { data, error } = await supabase.from('matchings').select('*');
  if (error) {
    console.log('getMatchings 에러 : ', error.message);
    throw new Error(error.message);
  }
  return data ?? [];
};

export const getMatchingById = async (matchingId: number): Promise<Matchings> => {
  const { data, error } = await supabase
    .from('matchings')
    .select('*')
    .eq('id', matchingId)
    .single();
  if (error) {
    console.log('getMatchingById 에러 : ', error.message);
    throw new Error(error.message);
  }
  return data ?? null;
};

export const createMatching = async (newMatching: MatchingsInsert): Promise<number> => {
  const { data, error } = await supabase
    .from('matchings')
    .insert({ ...newMatching })
    .select('id')
    .single();

  if (error) {
    console.log('createMatching 에러 : ', error.message);
    throw new Error(error.message);
  }

  // Host를 자동으로 참가자에 추가
  if (data?.id) {
    await addMatchingParticipant(data.id, newMatching.host_profile_id);
  }

  return data?.id;
};

export const updateMatching = async (
  matchingId: number,
  updatedMenu: MatchingsUpdate,
): Promise<void> => {
  const { error } = await supabase.from('matchings').update(updatedMenu).eq('id', matchingId);
  if (error) {
    console.log('updateMatching 에러 : ', error.message);
    throw new Error(error.message);
  }
};

export const deleteMatching = async (matchingId: number): Promise<void> => {
  const { error } = await supabase.from('matchings').delete().eq('id', matchingId);
  if (error) {
    console.log('deleteMatching 에러 : ', error.message);
    throw new Error(error.message);
  }
};

// 참가자 추가
export const addMatchingParticipant = async (
  matchingId: number,
  profileId: string,
): Promise<void> => {
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
  const { error: insertError } = await supabase
    .from('matching_participants')
    .insert({ matching_id: matchingId, profile_id: profileId });

  if (insertError) {
    if (insertError.code === '23505') {
      throw new Error('이미 참여한 사용자입니다');
    }
    throw new Error(`참가자 추가 실패: ${insertError.message}`);
  }

  // 4. 정원 도달 시 상태 업데이트
  if (currentCount + 1 === matching.desired_members) {
    await updateMatching(matchingId, { status: 'completed' });
  }
};

// 참가자 제거
export const removeMatchingParticipant = async (
  matchingId: number,
  profileId: string,
): Promise<void> => {
  const { error } = await supabase
    .from('matching_participants')
    .delete()
    .eq('matching_id', matchingId)
    .eq('profile_id', profileId);

  if (error) {
    console.log('removeMatchingParticipant 에러 : ', error.message);
    throw new Error(error.message);
  }

  // 참가자 제거 후 상태를 'waiting'으로 복구
  const { data: matching } = await supabase
    .from('matchings')
    .select('status')
    .eq('id', matchingId)
    .single();

  if (matching?.status === 'completed') {
    await updateMatching(matchingId, { status: 'waiting' });
  }
};

// 매칭의 모든 참가자 조회
export const getMatchingParticipants = async (matchingId: number) => {
  const { data, error } = await supabase
    .from('matching_participants')
    .select('id, profile_id, joined_at')
    .eq('matching_id', matchingId);

  if (error) {
    console.log('getMatchingParticipants 에러 : ', error.message);
    throw new Error(error.message);
  }

  return data ?? [];
};

// 사용자가 참여한 매칭 조회
export const getUserMatchings = async (profileId: string) => {
  const { data, error } = await supabase
    .from('matching_participants')
    .select('matchings(*)')
    .eq('profile_id', profileId);

  if (error) {
    console.log('getUserMatchings 에러 : ', error.message);
    throw new Error(error.message);
  }

  return data ?? [];
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
