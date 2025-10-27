import { RiHeart3Fill, RiMapPinLine, RiMessageLine, RiStarFill } from 'react-icons/ri';
import TagBadge from '../TagBadge';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ReviewCardProps {
  onClick?: () => void;
  restaurantId: number;
  name: string;
  category: string;
  img: string;
  review: string;
  storeintro: string;
  rating: number;
  distance: string;
  tagBg?: string;
  tagText?: string;
}

export const ReviewCardMobile = ({
  onClick,
  restaurantId,
  name,
  category,
  img,
  review,
  storeintro,
  rating,
  distance,
  tagBg,
  tagText,
}: ReviewCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorite = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { count } = await supabase
        .from('restaurants_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('restaurant_id', restaurantId);
      setFavoriteCount(count ?? 0);

      if (user) {
        const { data } = await supabase
          .from('restaurants_favorites')
          .select('id')
          .eq('profile_id', user.id)
          .eq('restaurant_id', restaurantId)
          .maybeSingle();
        setIsFavorite(!!data);
      }
      setLoading(false);
    };
    fetchFavorite();
  }, [restaurantId]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (isFavorite) {
      setIsFavorite(false);
      setFavoriteCount(prev => Math.max(prev - 1, 0));
      const { error } = await supabase
        .from('restaurants_favorites')
        .delete()
        .eq('profile_id', user.id)
        .eq('restaurant_id', restaurantId);
      if (error) {
        setIsFavorite(true);
        setFavoriteCount(prev => prev + 1);
      }
    } else {
      setIsFavorite(true);
      setFavoriteCount(prev => prev + 1);
      const { error } = await supabase.from('restaurants_favorites').insert([
        {
          profile_id: user.id,
          restaurant_id: restaurantId,
        },
      ]);
      if (error) {
        setIsFavorite(false);
        setFavoriteCount(prev => Math.max(prev - 1, 0));
      }
    }
  };

  if (loading) return null;

  return (
    <div
      onClick={onClick}
      className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5 cursor-pointer transition hover:shadow-md"
    >
      {/* 상단: 이미지 */}
      <div className="relative w-full overflow-hidden">
        <img
          src={img}
          alt={name}
          className="w-full h-[180px] sm:h-[200px] md:h-[220px] object-cover"
        />
      </div>

      {/* 본문 */}
      <div className="flex flex-col gap-3 p-4">
        {/* 태그 + 이름 */}
        <div className="flex flex-col gap-1">
          <TagBadge bgColor={tagBg || 'bg-babgray-100'} textColor={tagText || 'text-babgray-700'}>
            {category || '기타'}
          </TagBadge>
          <h3 className="text-[18px] sm:text-[20px] font-semibold line-clamp-1">{name}</h3>
        </div>

        {/* 별점 + 거리 */}
        <div className="flex flex-wrap gap-4 text-babgray-700 text-sm">
          <div className="flex items-center gap-1">
            <RiStarFill className="text-yellow-400 size-4" />
            <span>{rating}점</span>
          </div>
          <div className="flex items-center gap-1">
            <RiMapPinLine className="text-bab-500 size-4" />
            <span>{distance}</span>
          </div>
        </div>

        {/* 가게 소개 */}
        <p className="text-[14px] sm:text-[15px] text-babgray-700 line-clamp-3 min-h-[60px]">
          {storeintro}
        </p>

        {/* 하단 액션 */}
        <div className="flex justify-between items-center pt-2">
          <div
            onClick={handleToggleFavorite}
            className="flex items-center gap-1 text-sm text-babgray-700"
          >
            {isFavorite ? (
              <RiHeart3Fill className="text-bab-500" />
            ) : (
              <RiHeart3Fill className="text-babgray-500" />
            )}
            <span>찜 {favoriteCount}개</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-babgray-700">
            <RiMessageLine />
            <span>{review}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
