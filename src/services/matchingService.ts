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

export const createMatching = async (newMatching: MatchingsInsert): Promise<void> => {
  const { error } = await supabase.from('matchings').insert({ ...newMatching });
  if (error) {
    console.log('createMatching 에러 : ', error.message);
    throw new Error(error.message);
  }
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
