import {
  RiArrowRightLine,
  RiHeart3Line,
  RiMapPinLine,
  RiMessageLine,
  RiShareLine,
  RiStarFill,
} from 'react-icons/ri';
import { ItalianFood } from '../tag';
import TagBadge from '../TagBadge';
import type { ReviewPhoto } from '../../lib/restaurants';

type Props = {
  imageUrl: string;
  name: string;
  rating: number | null;
  reviewCount: string | null;
  category: string;
  tagBg?: string;
  tagText?: string;
  comment: string | null;
  review_photos: ReviewPhoto[];
  onClick?: () => void;
  isMyReview: boolean;
  onDelete?: () => void;
};

export default function MyreviewCard({
  imageUrl,
  name,
  rating,
  reviewCount,
  comment,
  category,
  tagBg,
  tagText,
  review_photos,
  onClick,
  isMyReview,
  onDelete,
}: Props) {
  const photoSrc =
    review_photos && review_photos.length > 0 ? review_photos[0].photo_url : imageUrl;

  return (
    <div
      onClick={onClick}
      className="relative w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5 cursor-pointer"
    >
      {/* 이미지 영역 */}
      <div className="relative w-full overflow-hidden rounded-t-2xl">
        {/* 삭제 버튼 (이미지 위, 카드 기준 고정) */}
        {isMyReview && (
          <button
            onClick={e => {
              e.stopPropagation(); // 카드 클릭 방지
              onDelete?.();
            }}
            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-xl hover:bg-red-600 transition z-10"
          >
            삭제
          </button>
        )}

        {/* 이미지 */}
        <div className="relative">
          <img src={photoSrc} alt={name} className="w-full h-[180px] sm:h-[200px] object-cover" />
        </div>
      </div>

      {/* 본문 */}
      <div className="p-4">
        <div className="flex flex-col gap-1">
          <span className="flex">
            <TagBadge bgColor={tagBg || 'bg-babgray-100'} textColor={tagText || 'text-babgray-700'}>
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
              <span className="text-[13px] text-babgray-600">{reviewCount}</span>
            </div>
          </div>
        </div>

        {/* 리뷰 미리보기 */}
        <p className="tracking-[-0.32px] text-[14px] sm:text-[15px] pt-3 text-babgray-700 line-clamp-4 min-h-24">
          {comment}
        </p>
      </div>
    </div>
  );
}
