import React, { useEffect, useState } from 'react';
import { RiChatSmile3Line, RiHeart3Line, RiStarFill } from 'react-icons/ri';
import { fetchRestaurantReviews, type ReviewWithPhotos } from '../../lib/restaurants';
import ReviewContent from './ReviewContent';
import WriteReviewComment from '../partner/WriteReviewComment';
import { useRestaurant } from '../../contexts/PartnerRestaurantContext';
import WriteReviewDetailComment from './WriteReviewDetailComment';
import WriteReviewPageComment from './WriteReviewPageComment';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { UserQuickProfileContent } from '@/ui/dorong/UserQuickProfile';

interface ReviewItemProps {
  restaurantId: number;
  reviews?: ReviewWithPhotos[];
}

function ReviewItem({ restaurantId, reviews }: ReviewItemProps) {
  const [localReviews, setLocalReviews] = useState<ReviewWithPhotos[]>([]);

  useEffect(() => {
    if (!restaurantId) return;

    if (reviews && reviews.length > 0) {
      setLocalReviews(reviews);
      return;
    }

    const loadReviews = async () => {
      const data = await fetchRestaurantReviews(restaurantId);
      setLocalReviews(data);
    };
    loadReviews();
  }, [restaurantId, reviews]);

  if (localReviews.length === 0)
    return <div className="p-4 text-gray-400 text-center">등록된 리뷰가 없습니다.</div>;

  return (
    <>
      {localReviews.map(review => (
        <div
          key={review.review_id}
          className="bg-white rounded-2xl p-[30px] shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5"
        >
          {/* 상단 헤더 */}
          <div className="flex items-start justify-between">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                  {/* 기존 프로필 이미지 및 닉네임 코드 */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                      {review.profiles?.avatar_url && (
                        <img
                          src={
                            review.profiles?.avatar_url !== 'guest_image'
                              ? review.profiles?.avatar_url
                              : 'https://www.gravatar.com/avatar/?d=mp&s=200'
                          }
                          alt="프로필 이미지"
                          className="w-full h-full object-cover object-center"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold">{review.profiles?.nickname}</div>
                      <div className="text-[12px] text-babgray-600">
                        {review.created_at && new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right"
                align="start" sideOffset={10}
                collisionPadding={10}
                avoidCollisions
                className="p-4 rounded-xl shadow-xl data-[side=bottom]:animate-slide-up-fade">
                <UserQuickProfileContent profileId={review.profile_id} />
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-1 pt-2 px-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <RiStarFill
                  key={i}
                  className={`text-[16px] ${i < (review.rating_food ?? 0)
                    ? 'text-yellow-400' // 채워진 별 (노란색)
                    : 'text-gray-300' // 채워지지않은 별 (회색)
                    }`}
                />
              ))}
            </div>
          </div>

          {/* 내용 */}

          <ReviewContent comment={review.comment ?? ''} />

          {/* 이미지 섹션 */}
          {review.review_photos?.length > 0 && (
            <div className="flex flex-wrap gap-5">
              {review.review_photos.map(photo => (
                <div
                  key={photo.photo_id}
                  className="w-[200px] h-[200px] rounded-lg overflow-hidden border border-black/5 shadow-[0_4px_4px_rgba(0,0,0,0.02)]"
                >
                  <img
                    src={photo.photo_url}
                    alt="리뷰 사진"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          <WriteReviewPageComment reviewId={review.review_id} />
        </div>
      ))}
    </>
  );
}

export default ReviewItem;
