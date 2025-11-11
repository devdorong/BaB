import { supabase } from '@/lib/supabase';

// supabase 의 비밀번호 찾기 이메일을 전송함.
export async function requestPasswordResetEmail({ email }: { email: string }) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
  return data;
}

// 비밀번호 재설정
export async function updatePassword({ password }: { password: string }) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw error;
  return data;
}
