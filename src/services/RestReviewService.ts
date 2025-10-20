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
    const { data: profile } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', profileId)
      .single();

    const nickname = profile?.nickname ?? '익명';

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('profile_id')
      .eq('id', restaurantId)
      .single();

    if (!restaurant?.profile_id) {
      throw new Error('레스토랑 소유자를 찾을 수 없습니다');
    }

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

    // 리뷰 알림 추가
    await supabase.from('notifications').insert([
      {
        profile_id: profileId,
        receiver_id: restaurant.profile_id,
        title: '새로운 리뷰가 등록되었습니다.',
        content: `${nickname}님이 새로운 리뷰를 남겼습니다.`,
        target: 'partner',
        type: '리뷰',
        restaurant_id: restaurantId,
      },
    ]);
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
    console.log('리뷰작성시 오류', err);
    return false;
  }
};
