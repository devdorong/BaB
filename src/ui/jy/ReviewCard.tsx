import styled from 'styled-components';
import {
  RiArrowRightLine,
  RiHeart3Line,
  RiMapPinLine,
  RiShareLine,
  RiStarFill,
} from 'react-icons/ri';
import { ItalianFood } from '../tag';

const CardLayout = styled.div`
  display: inline-flex;
  padding-right: 24px;
  align-items: center;
  gap: 23px;
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
`;

export const RowCard = () => {
  return (
    <div>
      <CardLayout className="flex items-center">
        <CardImage src="public/sample.jpg" />
        <div>
          {/* 태그 및 타이틀 */}
          <div className="flex flex-col items-start gap-1">
            <ItalianFood />
            {/* <Title>{restaurant.name}</Title> */}
            <Title>가게제목</Title>
          </div>
          {/* 별점 및 위치 거리 */}
          <div className="flex gap-[20px] pt-[7px]">
            <div className="flex items-center gap-[5px]">
              <RiStarFill className="text-[#FACC15] size-[16px]" />
              <div className="flex gap-[3px] text-babgray-700">
                <span className="text-[13px]">별점</span>
                <span className="text-[13px]">리뷰</span>
                <span className="text-[13px]">개수</span>
              </div>
            </div>
            <div className="flex items-center gap-[5px] text-babgray-700">
              <RiMapPinLine className="text-[#ff5722] size-[16px]" />
              <span className="text-[13px]">위치·거리</span>
            </div>
          </div>
          {/* 리뷰 후기 */}
          <p className="tracking-[-0.32px] text-[16px] pt-[12px] line-clamp-2  text-babgray-700">
            정말 맛있는 파스타집임! 추천함.정말 맛있는 파스타집임! 추천함.정말 맛있는 파스타집임!
            추천함.정말 맛있는 파스타집임! 추천함
          </p>
          <div className="flex justify-between items-center pt-[15px] text-babgray-700">
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center gap-[5px]">
                <RiHeart3Line className="size-[16px]" />
                <span className="text-[13px]">찜 개수</span>
              </div>
              <div className="flex items-center gap-[5px]">
                <RiShareLine className="size-[16px]" />
                <span className="text-[13px]">공유</span>
              </div>
            </div>
            <RiArrowRightLine />
          </div>
        </div>
      </CardLayout>
    </div>
  );
};
