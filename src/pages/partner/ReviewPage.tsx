import {
  RiArrowDownSLine,
  RiChat3Fill,
  RiEditLine,
  RiHeartLine,
  RiQuestionAnswerLine,
  RiShareForwardLine,
  RiStarFill,
  RiStarLine,
  RiTimeLine,
  RiUserLine,
} from 'react-icons/ri';
import PartnerBoardHeader from '../../components/PartnerBoardHeader';
import { useRestaurant } from '../../contexts/PartnerRestaurantContext';
import {
  fetchRestaurantReviews,
  fetchReviewComments,
  type ReviewWithPhotos,
} from '../../lib/restaurants';
import { useEffect, useState } from 'react';
import WriteReviewComment from '../../components/partner/WriteReviewComment';

function ReviewPage() {
  const { restaurant } = useRestaurant();
  const [reviews, setReviews] = useState<ReviewWithPhotos[]>([]);
  const [localReviews, setLocalReviews] = useState<ReviewWithPhotos[]>([]);
  const [noneComments, setNoneComments] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | '전체'>('전체');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!restaurant?.id) return;

    if (reviews && reviews.length > 0) {
      setLocalReviews(reviews);
      return;
    }

    const loadReviews = async () => {
      const data = await fetchRestaurantReviews(restaurant.id);
      setLocalReviews(data);
    };
    loadReviews();
  }, [restaurant?.id]);

  useEffect(() => {
    const loadAllComments = async () => {
      if (!localReviews.length) return;

      // 모든 리뷰의 댓글 불러오기
      const allComments = await Promise.all(
        localReviews.map(r => fetchReviewComments(r.review_id)),
      );

      // 댓글이 달린 리뷰 수 계산
      const reviewsWithReplyCount = allComments.filter(arr => arr.length > 0).length;
      const reviewsWithoutReplyCount = localReviews.length - reviewsWithReplyCount;

      setNoneComments(reviewsWithoutReplyCount);
    };

    loadAllComments();
  }, [localReviews]);

  const filteredReviews =
    selectedRating === '전체'
      ? localReviews
      : localReviews.filter(r => Number(r.rating_food ?? 0) === Number(selectedRating));

  const sortedReviews = [...filteredReviews]
    .filter(r => r.rating_food !== null)
    .sort((a, b) => Number(b.rating_food ?? 0) - Number(a.rating_food ?? 0));

  return (
    <>
      <PartnerBoardHeader title="고객 리뷰" subtitle="고객 리뷰를 확인하고 답변을 관리하세요." />
      <div className="flex flex-col gap-6">
        {/* 상단 */}
        <div className="flex gap-6">
          <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border  flex justify-between items-center">
            <div className="flex flex-col gap-2 justify-start">
              <p className="text-babgray-600">평균 별점</p>
              <p className="text-2xl font-semibold">{restaurant?.send_avg_rating}점</p>
              <div className="flex items-center gap-0.5 pt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <RiStarFill
                    key={i}
                    className={`text-[16px] ${
                      i < (restaurant?.send_avg_rating ?? 0)
                        ? 'text-yellow-400' // 채워진 별 (노란색)
                        : 'text-gray-300' // 채워지지않은 별 (회색)
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="w-12 h-12 p-3.5 bg-babbutton-yellow rounded-lg flex items-center justify-center">
              <RiStarFill size={20} color="#fff" />
            </div>
          </div>
          <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border  flex justify-between ">
            <div className="flex flex-col gap-2">
              <p className="text-babgray-600">총 리뷰 수</p>
              {/* 리뷰테이블 만들고난뒤, 연결하기 */}
              <p className="text-2xl font-semibold">{localReviews.length}개</p>
            </div>
            <div className="flex items-center">
              <div className="items-center w-12 h-12 p-3.5 bg-babbutton-blue rounded-lg flex justify-center">
                <RiChat3Fill color="#fff" size={20} />
              </div>
            </div>
          </div>
          <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border  flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="text-babgray-600">답변 대기</p>
              {/* 새로운 리뷰 출력 (고객리뷰 탭의 하루? 최근일주일? 동안의 등록글 카운팅 출력) */}
              <p className="text-2xl font-semibold">{noneComments}개</p>
              <p className="flex items-center justify-center text-bab gap-1">
                <RiTimeLine size={16} />
                답변 필요
              </p>
            </div>
            <div className="w-12 h-12 p-3.5 bg-bab rounded-lg flex items-center justify-center">
              <RiQuestionAnswerLine color="#fff" size={20} />
            </div>
          </div>
        </div>
        {/* 중단 */}
        <div className="self-stretch p-6 bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] border border-babgray-150 inline-flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch inline-flex  items-center justify-between ">
            <div className="w-28 inline-flex flex-col justify-start items-start gap-[3px]">
              <div className="self-stretch justify-start text-black text-base font-medium ">
                평점
              </div>
              <div className="flex mt-2 justify-between items-center">
                {/* 드롭다운 영역 */}
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setIsOpen(prev => !prev)}
                    className="flex items-center justify-between w-32 px-3 py-2 border border-babgray-200 rounded-lg text-babgray-800 text-sm font-medium bg-white hover:bg-babgray-50"
                  >
                    {selectedRating === '전체' ? '전체 평점' : `${selectedRating}점`}
                    <RiArrowDownSLine
                      className={`ml-2 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* 드롭다운 리스트 */}
                  {isOpen && (
                    <div className="absolute z-10 mt-1 w-32 bg-white border border-babgray-150 rounded-lg shadow-lg">
                      {['전체', 5, 4, 3, 2, 1].map(rating => (
                        <button
                          key={rating}
                          onClick={() => {
                            setSelectedRating(rating as number | '전체');
                            setIsOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-bab-50"
                        >
                          {rating === '전체' ? '전체 평점' : `${rating}점`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className=" text-babgray-600 text-base font-medium ">
              총 {localReviews.length}개의 리뷰
            </div>
          </div>
        </div>

        {/* 하단 */}
        <div className="w-full flex flex-col gap-6">
          {sortedReviews.map(review => (
            <>
              <div key={review.review_id} className="w-full flex flex-col gap-6">
                <div className="self-stretch w-full px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] border border-babgray-150 inline-flex flex-col justify-start items-start gap-2.5">
                  <div className="w-full flex flex-col justify-start items-start gap-4">
                    <div className="self-stretch flex flex-col justify-start items-start gap-5">
                      <div className="w-full flex flex-col justify-start items-start gap-5">
                        <div className="inline-flex justify-start items-center gap-3">
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
                          <div className="flex flex-col justify-start items-start">
                            <div className="text-[14px] justify-start text-babgray-600">
                              {review.profiles?.nickname}
                            </div>
                            <div className="inline-flex justify-start items-center gap-1.5">
                              <div className="flex items-center gap-0.5 pt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <RiStarFill
                                    key={i}
                                    className={`text-[16px] ${
                                      i < (review.rating_food ?? 0)
                                        ? 'text-yellow-400' // 채워진 별 (노란색)
                                        : 'text-gray-300' // 채워지지않은 별 (회색)
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="justify-start">
                                <span className="text-babgray-600 text-[14px] font-normal ">
                                  · {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="self-stretch justify-start text-babgray-700 text-base font-normal ">
                          {review.comment}
                        </div>
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
                      </div>
                      <WriteReviewComment reviewId={review.review_id} />
                      {/* <div className="self-stretch px-5 py-4 bg-bab-100 border-l-4 border-bab-500 flex flex-col justify-start items-start gap-2.5">
                      <div className="self-stretch inline-flex justify-start items-center gap-2 text-bab">
                        <div className="w-full inline-flex flex-col justify-center items-center gap-1.5">
                          <div className="self-stretch justify-start text-bab-700 text-base font-normal ">
                            사장님 답글
                          </div>
                          <div className="self-stretch justify-start text-babgray-700 text-base font-normal ">
                            소중한 리뷰 감사합니다! 다음에도 더욱 맛있는 요리로 보답하겠습니다.
                          </div>
                        </div>
                      </div>
                    </div> */}
                    </div>
                    {/* <div className="self-stretch pl-2 pt-4 border-t border-babgray-100 inline-flex justify-between items-center">
                    <div className="w-4 h-4 relative overflow-hidden text-babgray-300">
                      <RiHeartLine />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3.5 py-2 bg-babgray-100 rounded-lg flex justify-center items-center gap-2.5">
                        <div className="w-3 h-3 relative origin-top-left  overflow-hidden">
                          <RiEditLine className="flex" />
                        </div>
                        <div className="justify-start text-babgray-700 text-xs font-medium ">
                          답글 수정
                        </div>
                      </div>
                      <div className="px-3.5 py-2 bg-babgray-100 rounded-lg flex justify-center items-center gap-2.5">
                        <div className="w-3 h-3 relative origin-top-left  overflow-hidden">
                          <RiShareForwardLine className="flex transform scale-x-[-1]" />
                        </div>
                        <div className="justify-start text-babgray-700 text-xs font-medium ">
                          리뷰 삭제 요청하기
                        </div>
                      </div>
                    </div>
                  </div> */}
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default ReviewPage;
