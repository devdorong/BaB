// MatchCardSkeleton.tsx
import { RiMapPinLine } from 'react-icons/ri';

export default function MatchCardSkeleton() {
  return (
    <li
      className="w-full px-7 py-5 bg-white rounded-3xl shadow-[0_4px_4px_rgba(0,0,0,0.02)]
      flex flex-col gap-3 overflow-hidden animate-pulse"
    >
      {/* 상단: 좌측 내용 + 우측 시간 */}
      <div className="w-full flex justify-between items-start gap-4">
        {/* 좌측 내용 래퍼 */}
        <div className="min-w-0 flex-1 flex flex-col gap-4">
          {/* 배지 영역 */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-14 bg-gray-200 rounded-2xl" />
            <div className="h-7 w-12 bg-gray-200 rounded-2xl" />
          </div>

          {/* 제목 + 설명 */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-3/4 bg-gray-200 rounded-md" />
            <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
          </div>

          {/* 위치 정보 */}
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <RiMapPinLine className="shrink-0 w-4 h-4 text-gray-300" />
            <div className="h-4 w-1/3 bg-gray-200 rounded-md" />
          </div>
        </div>

        {/* 우측 시간 */}
        <div className="h-3 w-10 bg-gray-200 rounded-md" />
      </div>
    </li>
  );
}
