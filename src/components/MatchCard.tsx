// MatchCard.tsx
import { RiMapPinLine } from 'react-icons/ri';

type Badge = {
  label: string;
  bgClass?: string; // 예: 'bg-lime-50'
  textClass?: string; // 예: 'text-lime-800'
};

type MatchCardProps = {
  tags: Badge[];
  title: string;
  description: string;
  distanceKm: number;
  area: string;
  timeAgo: string; // 예: '30분 전'
  className?: string;
};

export default function MatchCard({
  tags,
  title,
  description,
  distanceKm,
  area,
  timeAgo,
  className = '',
}: MatchCardProps) {
  return (
    <li
      className="w-[615px] px-7 py-5 bg-white rounded-3xl shadow-[0_4px_4px_rgba(0,0,0,0.02)]
    flex flex-col gap-3 overflow-hidden cursor-pointer"
    >
      {/* 상단: 좌측 내용 + 우측 시간 */}
      <div className="w-full flex justify-between items-start gap-4">
        {/* 좌측 내용 래퍼 */}
        <div className="min-w-0 flex-1 flex flex-col gap-4">
          {/* 배지 목록 */}
          <div className="flex items-center gap-2">
            {tags.map((t, i) => (
              <span
                key={i}
                className={`h-7 px-3 inline-flex items-center justify-center rounded-2xl text-xs font-medium
                ${t.bgClass ?? 'bg-gray-100'} ${t.textClass ?? 'text-gray-700'}`}
              >
                {t.label}
              </span>
            ))}
          </div>

          {/* 제목 + 설명 */}
          <div className="flex flex-col gap-2">
            <h3
              className="text-[18px] leading-6 font-bold text-gray-900 line-clamp-1"
              title={title}
            >
              {title}
            </h3>
            <p
              className="text-[15px] leading-6 font-medium text-gray-500 line-clamp-1"
              title={description}
            >
              {description}
            </p>
          </div>

          {/* 위치 정보 */}
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <RiMapPinLine className="shrink-0 w-4 h-4 text-[#FF5722]" />
            <span>
              {distanceKm}km · {area}
            </span>
          </div>
        </div>

        {/* 우측 시간 */}
        <time className="shrink-0 text-[12px] leading-5 text-gray-500">{timeAgo}</time>
      </div>
    </li>
  );
}
