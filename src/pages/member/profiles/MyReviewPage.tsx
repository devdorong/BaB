import { useEffect, useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { deleteReviewById, fetchMyReviewData, type MyReviewData } from '../../../lib/myreviews';
import { supabase } from '../../../lib/supabase';
import MyreviewCard from '../../../ui/jy/MyReviewCard';
import { categoryColors, defaultCategoryColor } from '../../../ui/jy/categoryColors';

function MyReviewPage() {
  const navigate = useNavigate();
  const [review, setReview] = useState<MyReviewData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = review.slice(startIdx, endIdx);
  const totalPages = Math.ceil(review.length / itemsPerPage);

  // 로그인한 유저정보 가져오기
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadReview = async () => {
      setLoading(true);
      try {
        const data = await fetchMyReviewData();
        // console.log(data);
        setReview(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadReview();
  }, []);

  useEffect(() => {
    const loginUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    loginUser();
  }, []);

  // 리뷰 삭제
  const handleDelete = async (reviewId: number) => {
    // const confirmDelete = window.confirm('리뷰 삭제?');
    // if (!confirmDelete) return;

    try {
      await deleteReviewById(reviewId);
      setReview(prev => prev.filter(rv => rv.review_id !== reviewId));
      toast.success('리뷰가 삭제되었습니다.', { position: 'top-center' });
    } catch (error) {}
  };

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
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="root" className="flex flex-col min-h-screen bg-bg-bg">
      {/* 메인 컨테이너 */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
          {/* 프로필 헤더 링크 */}
          <div className="hidden lg:flex sm:text-base items-center py-[15px]">
            <div
              onClick={() => navigate('/member/profile')}
              className="text-babgray-600 text-[17px] cursor-pointer hover:text-babgray-900"
            >
              프로필
            </div>
            <div className="flex pt-[3px] items-center text-babgray-600 px-[5px] text-[17px]">
              <RiArrowRightSLine />
            </div>
            <div className="text-bab-500 text-[17px]">내가 쓴 리뷰</div>
          </div>

          {/* 타이틀 */}
          <div className="max-w-[1280px] mx-auto flex flex-col gap-[12px] py-[12px] lg:gap-8 lg:py-8">
            <div className="flex flex-col gap-[8px] lg:pb-[30px]">
              <p className="text-[24px] lg:text-3xl font-bold">내가 쓴 리뷰</p>
              <p className="text-babgray-600 text-[16px]">내가 쓴 리뷰를 확인해보세요.</p>
            </div>

            {review.length === 0 && (
              <div className="flex justify-center items-center h-64 text-babgray-500 text-lg">
                등록한 리뷰가 없습니다.
              </div>
            )}

            {review.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentItems.map(r => {
                    const reviewCount = r.restaurants?.reviews?.[0]?.count ?? 0;
                    const category = r.restaurants?.restaurants_category_id_fkey?.name ?? '';
                    const color = categoryColors[category] || defaultCategoryColor;
                    const isMyReview = r.profiles!.id === userId;

                    return (
                      <MyreviewCard
                        onClick={() => navigate(`/member/reviews/${r.restaurant_id}`)}
                        imageUrl={r.restaurants?.thumbnail_url || ''}
                        name={r.restaurants?.name || ''}
                        rating={r.rating_food}
                        reviewCount={`리뷰 ${reviewCount}개`}
                        comment={r.comment}
                        category={category}
                        tagBg={color.bg}
                        tagText={color.text}
                        review_photos={r.review_photos}
                        isMyReview={isMyReview}
                        onDelete={() => handleDelete(r.review_id)}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    className="p-2  bg-bg-bg rounded disabled:opacity-50 hover:bg-bab hover:text-white"
                  >
                    <RiArrowLeftSLine size={16} />
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`p-2 py-0 rounded hover:bg-bab hover:text-white ${
                        currentPage === idx + 1 ? 'text-bab' : 'bg-bg-bg'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    className="p-2 bg-bg-bg rounded disabled:opacity-50 hover:bg-bab hover:text-white"
                  >
                    <RiArrowRightSLine size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyReviewPage;
