import { supabase } from '../lib/supabase';

// 찜 토글
export const toggleFavorite = async (restaurantId: number): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert('로그인이 필요합니다.');
    return false;
  }

  const { data: exists } = await supabase
    .from('restaurants_favorites')
    .select('id')
    .eq('profile_id', user.id)
    .eq('restaurant_id', restaurantId)
    .maybeSingle();

  if (exists) {
    const { error } = await supabase
      .from('restaurants_favorites')
      .delete()
      .eq('profile_id', user.id)
      .eq('restaurant_id', restaurantId);
    if (error) return false;
    return false;
  } else {
    // 찜 등록
    const { error } = await supabase.from('restaurants_favorites').insert([
      {
        profile_id: user.id,
        restaurant_id: restaurantId,
      },
    ]);
    if (error) return false;
    return true;
  }
};

interface insertReviewProps {
  restaurantId: number;
  profileId: string;
  content: string;
  rating_food: number;
  files: File[];
}

// 리뷰 생성
export const insertReview = async ({
  restaurantId,
  profileId,
  content,
  rating_food,
  files,
}: insertReviewProps): Promise<boolean> => {
  try {
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert([
        {
          restaurant_id: restaurantId,
          profile_id: profileId,
          comment: content,
          rating_food,
        },
      ])
      .select('review_id')
      .single();

    if (reviewError || !review) throw new Error('리뷰 생성 실패');

    // 이미지파일 스토리지 업로드
    if (files.length > 0) {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${review.review_id}-${Date.now()}.${fileExt}`;
        const filePath = `reviews/${review.review_id}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('review_photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('review_photos').getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        const photoRows = uploadedUrls.map(photoUrl => ({
          review_id: review.review_id,
          photo_url: photoUrl,
        }));

        const { error: photoError } = await supabase.from('review_photos').insert(photoRows);

        if (photoError) throw photoError;
      }
    }

    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating_food')
      .eq('restaurant_id', restaurantId);

    const avg =
      reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (Number(r.rating_food) || 0), 0) / reviews.length
        : 0;

    const { error: updateError } = await supabase
      .from('restaurants')
      .update({ send_avg_rating: Math.round(avg * 10) / 10 })
      .eq('id', restaurantId);

    if (updateError) throw updateError;

    return true;
  } catch (err) {
    return false;
  }
};

// // 리뷰 사진 업로드
// export const uploadReviewPhotos = async (file: File, reviewId: number): Promise<string | null> => {
//   try {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
//     if (!allowedTypes.includes(file.type)) {
//       throw new Error('지원하지 않는 이미지 형식');
//     }

//     const fileExt = file.name.split('.').pop();
//     const fileName = `${reviewId}-${Date.now()}.${fileExt}`;
//     const filePath = `reviews/${reviewId}/${fileName}`;

//     const { error: uploadError } = await supabase.storage
//       .from('review_photos')
//       .upload(filePath, file, {
//         cacheControl: '3600',
//         upsert: false,
//       });

//     if (uploadError) throw new Error(`업로드 실패: ${uploadError.message}`);

//     const {
//       data: { publicUrl },
//     } = supabase.storage.from('review_photos').getPublicUrl(filePath);

//     return publicUrl;
//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// };
