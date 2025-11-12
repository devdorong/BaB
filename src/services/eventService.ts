import { supabase } from '@/lib/supabase';
import type { EventState } from '@/pages/member/EventPage';
import type { EventsUpdate } from '@/types/bobType';

export const updatedEventStatus = async ({
  id,
  newStatus,
}: {
  id: number;
  newStatus: EventState;
}) => {
  const { error } = await supabase.from('events').update({ status: newStatus }).eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export const existingUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('event_participants')
    .select('*')
    .eq('profile_id', userId);

  if (error) throw error;

  return data;
};
