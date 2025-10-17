import { supabase } from './supabase';

export const uploadEventImage = async (file: File) => {
  if (!file) {
    return null;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `event/${fileName}`;

  const { error } = await supabase.storage.from('event_images').upload(filePath, file);

  if (error) {
    console.error('이미지 업로드 실패 : ', error.message);
    return null;
  }

  const { data } = supabase.storage.from('event_images').getPublicUrl(filePath);
  return data.publicUrl;
};
