import ReviewCardSkeleton from '@/ui/dorong/ReviewCardSkeleton';

export default function ReviewsPageSkeleton() {
  return (
    <div id="root" className="flex flex-col min-h-screen bg-bg-bg animate-pulse">
      <div className="w-full flex justify-center">
        <div className="w-[1280px] mx-auto flex flex-col px-4 sm:px-6 lg:px-8 xl:px-0 gap-8 py-8">
          {/* 타이틀 영역 */}
          <div className="flex flex-col gap-2">
            <div className="h-8 w-40 bg-gray-200 rounded-md" />
            <div className="h-4 w-60 bg-gray-200 rounded-md" />
          </div>

          {/* 검색 및 필터 영역 */}
          <div className="flex w-full p-6 flex-col justify-center gap-5 sm:gap-6 rounded-[20px] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
            {/* 검색폼 */}
            <div className="flex w-full items-center gap-[16px]">
              <div className="flex w-full items-center bg-gray-100 h-[55px] py-3 px-3 rounded-3xl">
                <div className="h-4 w-3/4 bg-gray-200 rounded-md mx-auto" />
              </div>
              <div className="w-[55px] h-[55px] rounded-[18px] bg-gray-200" />
            </div>

            {/* 카테고리 및 정렬 */}
            <div className="flex flex-col gap-4">
              {/* 데스크탑 카테고리 */}
              <div className="hidden lg:flex flex-wrap gap-2 justify-start">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-8 w-16 bg-gray-200 rounded-full" />
                ))}
              </div>

              {/* 모바일·태블릿 드롭다운 + 정렬 */}
              <div className="flex gap-4 justify-start items-start">
                <div className="lg:hidden h-10 w-32 bg-gray-200 rounded-full" />
                <div className="flex justify-start gap-[8px]">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-8 w-16 bg-gray-200 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 카드 리스트 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[14px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-8 h-8 bg-gray-200 rounded-md" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gray-200 rounded-md" />
            ))}
            <div className="w-8 h-8 bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
