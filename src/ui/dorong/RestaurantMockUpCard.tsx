import {
  RiArrowRightLine,
  RiHeart3Line,
  RiMapPinLine,
  RiShareLine,
  RiStarFill,
} from 'react-icons/ri';
import TagBadge from '../TagBadge';

type Props = {
  imageUrl: string; // /public/sample.jpg
  name: string; // 가게명
  rating: number; // 4.8
  reviewCount: number; // 127
  location: string; // "강남구 청담동"
  distanceKm: number; // 1.2
  reviewSnippet: string; // 리뷰 미리보기
  likeCount: number; // 찜 개수
  category: string; // 한식, 중식, 양식...
  tagBg: string;
  tagText: string;
  onClick?: () => void;
};

export default function RestaurantMockUpCard({
  imageUrl,
  name,
  rating,
  reviewCount,
  location,
  distanceKm,
  reviewSnippet,
  likeCount,
  category,
  tagBg,
  tagText,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="w-[312px] bg-white rounded-2xl overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5 cursor-pointer"
    >
      {/* 이미지 */}
      <div className="relative">
        <img src={imageUrl} alt={name} className="w-full h-[176px] object-cover" />
      </div>

      {/* 본문 */}
      <div className="p-4">
        {/* 태그 & 타이틀 */}
        <div className="flex flex-col gap-1">
          <span className="flex">
            <TagBadge bgColor={tagBg} textColor={tagText}>
              {category}
            </TagBadge>
          </span>
          <h3 className="text-[20px] md:text-[22px] font-semibold tracking-tight text-black line-clamp-1">
            {name}
          </h3>
        </div>

        {/* 별점 & 위치/거리 */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1 text-babgray-700">
            <RiStarFill className="size-4 text-yellow-400" />
            <span className="text-[13px]">{rating.toFixed(1)}</span>
            <span className="text-[13px] text-babgray-600">리뷰 {reviewCount}개</span>
          </div>
          <div className="flex items-center gap-1 text-babgray-700">
            <RiMapPinLine className="size-4 text-[#FF5722]" />
            <span className="text-[13px]">
              {location} · {distanceKm}m
            </span>
          </div>
        </div>

        {/* 리뷰 미리보기 */}
        <p className="tracking-[-0.32px] text-[15px] pt-3 text-babgray-700 line-clamp-2">
          {reviewSnippet}
        </p>

        {/* 하단 액션 */}
        <div className="flex justify-between items-center pt-4 text-babgray-700">
          <div className="flex items-center gap-3 ">
            <div className="flex items-center gap-1">
              <RiHeart3Line className="size-4" />
              <span className="text-[13px]">{likeCount}</span>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 text-[13px] hover:underline"
              onClick={e => e.stopPropagation()}
            >
              <RiShareLine className="size-4" />
              공유
            </button>
          </div>
          <RiArrowRightLine className="size-5 text-babgray-600" />
        </div>
      </div>
    </div>
  );
}
