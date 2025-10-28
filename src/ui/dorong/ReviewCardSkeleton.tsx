import { useMediaQuery } from 'react-responsive';

// src/ui/dorong/ReviewCardSkeleton.tsx
export default function ReviewCardSkeleton() {
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  if (isDesktop) {
    return (
      <div className="animate-pulse w-full inline-flex items-center gap-6 bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5">
        {/* 이미지 */}
        <div className="w-[248px] h-[248px] bg-gray-200 rounded-xl shrink-0" />

        {/* 오른쪽 컨텐츠 */}
        <div className="flex flex-col flex-1 gap-4 p-5">
          {/* 태그 + 제목 */}
          <div className="flex flex-col gap-2">
            <div className="w-[80px] h-[28px] bg-gray-200 rounded-full" />
            <div className="w-[160px] h-[22px] bg-gray-200 rounded-md" />
          </div>

          {/* 별점 + 거리 */}
          <div className="flex gap-6 pt-2">
            <div className="w-[80px] h-[18px] bg-gray-200 rounded-md" />
            <div className="w-[100px] h-[18px] bg-gray-200 rounded-md" />
          </div>

          {/* 설명 */}
          <div className="w-full flex flex-col gap-2 pt-2">
            <div className="w-full h-[16px] bg-gray-200 rounded-md" />
            <div className="w-[80%] h-[16px] bg-gray-200 rounded-md" />
          </div>

          {/* 하단 버튼 영역 */}
          <div className="flex justify-between items-center pt-3">
            <div className="flex gap-4">
              <div className="w-[90px] h-[16px] bg-gray-200 rounded-md" />
              <div className="w-[70px] h-[16px] bg-gray-200 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  /* 모바일 (lg 미만) */
  return (
    <div className="flex flex-col relative w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5 animate-pulse">
      {/* 이미지 */}
      <div className="w-full h-[180px] sm:h-[200px] bg-gray-200" />

      {/* 본문 */}
      <div className="p-4">
        {/* 태그 + 제목 */}
        <div className="flex flex-col gap-2 items-start">
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
          <div className="h-5 w-2/3 bg-gray-200 rounded-md" />
        </div>

        {/* 별점 + 리뷰 수 */}
        <div className="flex items-center gap-3 pt-3">
          <div className="flex gap-5">
            <div className="flex items-center gap-2">
              <div className="h-4 w-10 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* 설명 */}
        <div className="flex flex-col gap-2 pt-4">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
