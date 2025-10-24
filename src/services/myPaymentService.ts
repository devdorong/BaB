import { supabase } from '@/lib/supabase';
import type { Payment_methodsInsert, Payment_methodsUpdate } from '@/types/bobType';

export const insertPaymentMethod = async (data: Payment_methodsInsert) => {
  const { data: result, error } = await supabase
    .from('payment_methods')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return result;
};

// READ (내 결제수단 목록)
export const fetchPaymentMethods = async (profileId: string) => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('profile_id', profileId)
    .order('is_default', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// UPDATE
export const updatePaymentMethod = async (id: number, updateData: Payment_methodsUpdate) => {
  const { data, error } = await supabase
    .from('payment_methods')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// DELETE
export const deletePaymentMethod = async (id: number) => {
  const { error } = await supabase.from('payment_methods').delete().eq('id', id);
  if (error) throw new Error(error.message);
};
