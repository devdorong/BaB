import styled from 'styled-components';
import { RiHeart3Fill, RiMapPinLine, RiMessageLine, RiStarFill } from 'react-icons/ri';
import TagBadge from '../TagBadge';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useMediaQuery } from 'react-responsive'; // ✅ 추가

const CardLayout = styled.div`
  display: inline-flex;
  padding-right: 24px;
  align-items: center;
  gap: 23px;
  width: 100%;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.02);
`;

const CardImage = styled.img`
  width: 240px;
  height: 226px;
  flex-shrink: 0;
  object-fit: cover;
`;

const Title = styled.div`
  color: #000;
  font-size: 23px;
  font-weight: 400;
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
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // 모바일 상태일때는 6개
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(6);
      } else {
        setItemsPerPage(12);
      }
    };

    updateItemsPerPage(); // 초기 실행
    window.addEventListener('resize', updateItemsPerPage); // 크기 변경 감지

    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

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

  /* 데스크탑 (lg 이상) */
  if (isDesktop) {
    return (
      <div onClick={onClick}>
        <CardLayout className="rounded-2xl w-full overflow-hidden border border-black/5 cursor-pointer">
          {/* 이미지 */}
          <CardImage src={img} alt={name} />

          {/* 오른쪽 컨텐츠 */}
          <div className="w-full h-full">
            <div className="flex flex-col items-start gap-2">
              <TagBadge
                bgColor={tagBg || 'bg-babgray-100'}
                textColor={tagText || 'text-babgray-700'}
              >
                {category || '기타'}
              </TagBadge>
              <Title>{name}</Title>
            </div>

            <div className="flex gap-[20px] pt-[7px]">
              <div className="flex items-center gap-[5px]">
                <RiStarFill className="text-[#FACC15]" />
                <span className="text-[14px] text-gray-700">{rating}점</span>
              </div>
              <div className="flex items-center gap-2 text-babgray-700 text-sm">
                <RiMapPinLine className="text-[#FF5722]" />
                <span>{distance}</span>
              </div>
            </div>

            <p className="tracking-[-0.32px] text-[15px] pt-2 line-clamp-2 min-h-[53px] text-babgray-700">
              {storeintro}
            </p>

            <div className="flex justify-between items-center pt-3 text-babgray-700">
              <div className="flex items-center gap-6">
                <div
                  onClick={handleToggleFavorite}
                  className="min-w-[37px] flex items-center gap-2 text-sm"
                >
                  {isFavorite ? (
                    <RiHeart3Fill className="text-[#FF5722]" />
                  ) : (
                    <RiHeart3Fill className="text-babgray-600" />
                  )}
                  <span>찜 {favoriteCount}개</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RiMessageLine />
                  {review}
                </div>
              </div>
            </div>
          </div>
        </CardLayout>
      </div>
    );
  }

  /* 모바일 (lg 미만) */
  return (
    <div
      onClick={onClick}
      className="flex flex-col relative w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5 cursor-pointer"
    >
      {/* 이미지 */}
      <div className="relative w-full overflow-hidden rounded-t-2xl">
        <img src={img} alt={name} className="w-full h-[180px] sm:h-[200px] object-cover" />
      </div>

      {/* 본문 */}
      <div className="p-4">
        <div className="flex flex-col gap-1 items-start">
          <TagBadge bgColor={tagBg || 'bg-babgray-100'} textColor={tagText || 'text-babgray-700'}>
            {category || '기타'}
          </TagBadge>
          <h3 className="text-[18px] sm:text-[20px] font-semibold tracking-tight text-black line-clamp-1">
            {name}
          </h3>
        </div>

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

        <p className="tracking-[-0.32px] text-[14px] sm:text-[15px] pt-3 text-babgray-700 line-clamp-4 min-h-24">
          {storeintro}
        </p>
      </div>
    </div>
  );
};
