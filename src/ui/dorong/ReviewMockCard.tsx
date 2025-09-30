import styled from 'styled-components';
import {
  RiArrowRightLine,
  RiHeart3Line,
  RiMapPinLine,
  RiShareLine,
  RiStarFill,
} from 'react-icons/ri';
import TagBadge from '../TagBadge';

const CardLayout = styled.div`
  display: inline-flex;
  padding-right: 24px;
  align-items: center;
  gap: 23px;
  width: 100%;
  border-radius: 16px;
  background: #fff;
  /* 박스 그림자 */
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.02);
`;

const CardImage = styled.img`
  width: 240px;
  height: 226px;
  flex-shrink: 0;
`;

const Title = styled.div`
  color: #000;
  font-size: 23px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  white-space: nowrap;
`;

interface ReviewCardProps {
  onClick?: () => void;
  name: string;
  category: string;
  img: string;
  review: string;
  rating: number;
  distance: string;
  tagBg?: string;
  tagText?: string;
}

export const ReviewCard = ({
  onClick,
  name,
  category,
  img,
  review,
  rating,
  distance,
  tagBg,
  tagText,
}: ReviewCardProps) => {
  return (
    <div onClick={onClick}>
      <CardLayout className="rounded-2xl overflow-hidden border border-black/5 cursor-pointer">
        {/* 이미지 */}
        <CardImage src={img} alt={name} className="overflow-hidden" />

        {/* 오른쪽 컨텐츠 */}
        <div className="w-full h-full">
          {/* 상단: 태그 + 제목 */}
          <div className="flex flex-col items-start gap-1">
            <TagBadge bgColor={tagBg || 'bg-babgray-100'} textColor={tagText || 'text-babgray-700'}>
              {category}
            </TagBadge>
            <Title>{name}</Title>
          </div>

          {/* 별점 + 위치 */}
          <div className="flex gap-[20px] pt-[7px]">
            <div className="flex items-center gap-[5px]">
              <RiStarFill className="text-[#FACC15]" />
              <span className='w-[37px] text-gray-700'>{rating}점</span>
            </div>
            <div className="flex items-center gap-2 text-babgray-700 text-sm">
              <RiMapPinLine className="text-[#FF5722]" />
              <span>{distance}</span>
            </div>
          </div>

          {/* 리뷰 요약 */}
          <p className="tracking-[-0.32px] text-[15px] pt-2 line-clamp-2 min-h-[53px] text-babgray-700">
            {review}
          </p>

          {/* 하단 액션 */}
          <div className="flex justify-between items-center pt-3 text-babgray-700">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <RiHeart3Line />
                <span>찜</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RiShareLine />
                <span>공유</span>
              </div>
            </div>
            <RiArrowRightLine className="text-lg" />
          </div>
        </div>
      </CardLayout>
    </div>
  );
};
