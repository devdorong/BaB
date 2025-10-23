import styled from 'styled-components';
import {
  RiArrowRightLine,
  RiHeart3Fill,
  RiHeart3Line,
  RiMapPinLine,
  RiMessage2Line,
  RiMessage3Line,
  RiMessageLine,
  RiShareLine,
  RiStarFill,
} from 'react-icons/ri';
import TagBadge from '../TagBadge';
import { InterestBadge } from '../tag';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const CardLayout = styled.div`
  display: inline-flex;
  padding-right: 24px;
  align-items: center;
  gap: 23px;
  width: 100%;
  border-radius: 16px;
  background: #fff;
  /* 박스 그림자 */
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.02);
`;

const CardImage = styled.img`
  width: 240px;
  height: 226px;
  flex-shrink: 0;
`;

const Title = styled.div`
  color: #000;
  font-size: 23px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  white-space: nowrap;
`;

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

export const ReviewCard = ({
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
        // 이미 찜한 식당인지
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
    // 이동 막기
    e.stopPropagation();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

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
    <div onClick={onClick}>
      <CardLayout className="rounded-2xl overflow-hidden border border-black/5 cursor-pointer">
        {/* 이미지 */}
        <CardImage src={img} alt={name} className="overflow-hidden" />

        {/* 오른쪽 컨텐츠 */}
        <div className="w-full h-full">
          {/* 상단: 태그 + 제목 */}
          <div className="flex flex-col items-start gap-2">
            <TagBadge bgColor={tagBg || 'bg-babgray-100'} textColor={tagText || 'text-babgray-700'}>
              {category || "기타"}
            </TagBadge>
            <Title>{name}</Title>
          </div>

          {/* 별점 + 위치 */}
          <div className="flex gap-[20px] pt-[7px]">
            <div className="flex items-center gap-[5px]">
              <RiStarFill className="text-[#FACC15]" />
              <span className="w-[35px] text-[14px] text-gray-700">{rating}점</span>
            </div>
            <div className="flex items-center gap-2 text-babgray-700 text-sm">
              <RiMapPinLine className="text-[#FF5722]" />
              <span>{distance}</span>
            </div>
          </div>

          {/* 리뷰 요약 */}
          <p className="tracking-[-0.32px] text-[15px] pt-2 line-clamp-2 min-h-[53px] text-babgray-700">
            {storeintro}
          </p>

          {/* 하단 액션 */}
          <div className="flex justify-between items-center pt-3 text-babgray-700">
            <div className="flex items-center gap-6">
              <div
                onClick={handleToggleFavorite}
                className="min-w-[37px] flex items-center pt-0.5  gap-2 text-sm"
              >
                {isFavorite ? (
                  <RiHeart3Fill className="text-[#FF5722]" />
                ) : (
                  <RiHeart3Fill className="text-babgray-600" />
                )}
                <span>찜 {favoriteCount}개</span>
              </div>
              <div className="min-x-[37px] flex items-center pt-0.5 gap-2 text-sm">
                <RiMessageLine />
                {review}
              </div>
            </div>
          </div>
        </div>
      </CardLayout>
    </div>
  );
};
