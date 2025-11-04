import type { Interests, Profile_Interests } from '../types/bobType';
import { supabase } from './supabase';

// 추천 관심사
export const fetchInterests = async (): Promise<Interests[]> => {
  const { data, error } = await supabase
    .from('interests')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data ?? [];
};

// 관심사 그룹
export const fetchInterestsGrouped = async (): Promise<Record<string, string[]>> => {
  const rows = await fetchInterests();
  return rows.reduce<Record<string, string[]>>((accumulator, current) => {
    (accumulator[current.category] ??= []).push(current.name);
    return accumulator;
  }, {});
};

// 사용자 관심사 조회
type ProfileInterestWithName = {
  interest_id: number;
  interests: {
    name: string;
  } | null;
};

export const fetchProfileInterests = async (ProfileId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('profile_interests')
    .select('interest_id, interests(name)')
    .eq('profile_id', ProfileId);

  if (error) throw error;

  const typeData = data as unknown as ProfileInterestWithName[];

  return (
    typeData
      ?.map(row => row.interests?.name)
      // 타입가드
      .filter((name): name is string => name !== null && name !== undefined)
  );
};
  // return typeData?.map(row => row.interests?.name).filter(Boolean) ?? [];
  // const interestNames = data?.map((row: any) => row.interests?.name) ?? [];
  // const validInterestNames = interestNames.filter(Boolean);
  // return validInterestNames;

// 관심사 저장
export const saveProfileInterests = async (
  userId: string,
  interestNames: string[],
): Promise<void> => {
  // if (interestNames.length === 0) {
  //   throw new Error('최소 1개이상의 관심사 필요');
  // }

  // 기존 관심사 삭제
  const { error: deleteError } = await supabase
    .from('profile_interests')
    .delete()
    .eq('profile_id', userId);

  if (deleteError) throw deleteError;

  // 관심사 이름을 interest_id로 변환함
  const { data: interestRows, error: fetchError } = await supabase
    .from('interests')
    .select('id, name')
    .in('name', interestNames);

  if (fetchError) throw fetchError;

  const newInterests = interestRows.map(item => ({
    profile_id: userId,
    interest_id: item.id,
  }));

  const { error: insertError } = await supabase.from('profile_interests').insert(newInterests);

  if (insertError) throw insertError;
};

// 현재 로그인한 사용자의 관심사 조회
export const fetchCurrentProfileInterests = async (): Promise<string[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('로그인 필요');
  return fetchProfileInterests(user.id);
};

// 현재 로그인한 사용자의 관심사 저장
export const saveCurrentProfileInterests = async (interestNames: string[]): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('로그인 필요');

  return saveProfileInterests(user.id, interestNames);
};
