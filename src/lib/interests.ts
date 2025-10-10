import type { Interests } from '../types/bobType';
import { supabase } from './supabase';

export const fetchInterests = async (): Promise<Interests[]> => {
  const { data, error } = await supabase
    .from('interests')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data ?? [];
};

export const fetchInterestsGrouped = async (): Promise<Record<string, string[]>> => {
  const rows = await fetchInterests();
  return rows.reduce<Record<string, string[]>>((accumulator, current) => {
    (accumulator[current.category] ??= []).push(current.name);
    return accumulator;
  }, {});
};
