import { supabase } from '@/lib/supabase';
import type { Reports } from '@/types/bobType';

export type ReprotsWithNickname = Reports & {
  reporter_nickname?: string;
  accused_nickname?: string;
};

export const GetAllReports = async (): Promise<ReprotsWithNickname[]> => {
  const { data: reports, error } = await supabase.from('reports').select('*');
  if (error) throw new Error(error.message);
  if (!reports.length) return [];

  // 이 코드는 도저히 이해못하겠음.. gpt 굴려봤음
  const ids = [...new Set(reports.flatMap(r => [r.reporter_id, r.accused_profile_id]))];

  const { data: profiles } = await supabase.from('profiles').select('id, nickname').in('id', ids);

  const nicknameMap = Object.fromEntries(profiles?.map(p => [p.id, p.nickname]) ?? []);

  return reports.map(r => ({
    ...r,
    reporter_nickname: nicknameMap[r.reporter_id] ?? '알 수 없음',
    accused_nickname: nicknameMap[r.accused_profile_id] ?? '알 수 없음',
  }));
};
