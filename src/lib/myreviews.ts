import type { ReviewPhoto, ReviewWithPhotos } from './restaurants';
import { supabase } from './supabase';

export type MyReviewData = {
  review_id: number;
  restaurant_id: number;
  comment: string | null;
  rating_food: number | null;
  created_at: string;
  updated_at: string;
  category_id?: number | null;
  interests?: { name: string } | null;
  restaurants: {
    id: number;
    name: string;
    thumbnail_url: string;
    category: string;
    favorite: number | null;
    restaurants_category_id_fkey?: { name: string } | null;
    reviews: { count: number }[];
  } | null;
  review_photos: ReviewPhoto[];
};

export const fetchMyReviewData = async (): Promise<MyReviewData[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = (await supabase
    .from('reviews')
    .select(
      `
    review_id,
    restaurant_id,
    comment,
    rating_food,
    created_at,
    updated_at,
    restaurants (id, name, thumbnail_url, favorite, category_id,  restaurants_category_id_fkey:interests(name), reviews(count)),
    review_photos (photo_id, photo_url)
    `,
    )
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })) as {
    data: MyReviewData[] | null;
    error: any;
  };

  if (error) return [];

  const formatted: MyReviewData[] = (data ?? []).map(r => ({
    ...r,
    restaurants: r.restaurants
      ? {
          ...r.restaurants,
          favorite: r.restaurants.favorite ?? 0,
          reviews: Array.isArray(r.restaurants.reviews) ? r.restaurants.reviews : [],
          interests: Array.isArray(r.restaurants.restaurants_category_id_fkey)
            ? r.restaurants.restaurants_category_id_fkey[0]
            : r.restaurants.restaurants_category_id_fkey,
        }
      : null,
    review_photos: r.review_photos ?? [],
  }));

  return formatted;
};
