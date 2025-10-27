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
import ReviewCardSkeleton from './ReviewCardSkeleton';

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
      setLoading(true);
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

  if (loading) {
    return <ReviewCardSkeleton />;
  }

  return (
    <div className="hidden lg:block" onClick={onClick}>
      <CardLayout className="rounded-2xl w-full overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5 cursor-pointer">
        {/* 이미지 */}
        <CardImage src={img} alt={name} className="overflow-hidden" />

        {/* 오른쪽 컨텐츠 */}
        <div className="w-full h-full">
          {/* 상단: 태그 + 제목 */}
          <div className="flex flex-col items-start gap-2">
            <TagBadge bgColor={tagBg || 'bg-babgray-100'} textColor={tagText || 'text-babgray-700'}>
              {category || '기타'}
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
        <div
          onClick={onClick}
          className="flex lg:hidden relative w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5 cursor-pointer"
        >
          {/* 이미지 영역 */}
          <div className="relative w-full overflow-hidden rounded-t-2xl">
            {/* 이미지 */}
            <div className="relative">
              <img src={img} alt={name} className="w-full h-[180px] sm:h-[200px] object-cover" />
            </div>
          </div>

          {/* 본문 */}
          <div className="p-4">
            <div className="flex flex-col gap-1">
              <span className="flex">
                <TagBadge
                  bgColor={tagBg || 'bg-babgray-100'}
                  textColor={tagText || 'text-babgray-700'}
                >
                  {category || '기타'}
                </TagBadge>
              </span>
              <h3 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold tracking-tight text-black line-clamp-1">
                {name}
              </h3>
            </div>

            {/* 별점 & 댓글 */}
            <div className="flex items-center gap-2 pt-2">
              <div className="flex gap-4 sm:gap-5">
                <div className="flex items-center gap-1 text-babgray-700">
                  <RiStarFill className="size-4 text-yellow-400" />
                  <span className="text-[13px]">{rating}점</span>
                </div>
                <div className="flex items-center gap-1">
                  <RiMessageLine className="size-4 text-babgray-700" />
                  <span className="text-[13px] text-babgray-600">{review}</span>
                </div>
              </div>
            </div>

            {/* 리뷰 미리보기 */}
            <p className="tracking-[-0.32px] text-[14px] sm:text-[15px] pt-3 text-babgray-700 line-clamp-4 min-h-24">
              {storeintro}
            </p>
          </div>
        </div>
      </CardLayout>
    </div>
  );
};
