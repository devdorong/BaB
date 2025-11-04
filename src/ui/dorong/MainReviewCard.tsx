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
};

export default function MainReviewCard({
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
}: Props) {
  return (
    <div
      onClick={onClick}
      className="group w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5 cursor-pointer"
    >
      {/* 이미지 영역 */}
      <div className="relative overflow-hidden">
        <img
          src={review_photos?.[0]?.photo_url || imageUrl}
          alt={name}
          className="w-full h-[180px] sm:h-[200px] object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* 본문 */}
      <div className="p-4 h-[230px]">
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
