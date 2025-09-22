import { useEffect, useState } from 'react';
import { RiArrowRightDoubleLine, RiArrowRightSLine, RiSearchLine } from 'react-icons/ri';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ButtonFillMd } from '../../../ui/button';
import { BlackTag, BrandTag, GrayTag } from '../../../ui/tag';
import { RowCard } from '../../../ui/jy/ReviewCard';

function ReviewsPage() {
  const [search, setSearch] = useState('');
  return (
    <div className="w-full bg-bg-bg">
      <div className="w-[1280px] mx-auto flex flex-col gap-8 py-8">
        {/* 타이틀 */}
        <div className="flex flex-col gap-1">
          <p className="text-3xl font-bold">맛집리뷰</p>
          <p className="text-babgray-600">진짜 맛집을 찾아보세요</p>
        </div>
        <div className="flex p-[24px] flex-col justify-center gap-[16px] rounded-[20px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.02)]">
          {/* 검색폼,버튼 */}
          <div className="flex w-full justify-between items-center gap-[16px]">
            <div
              onClick={() => document.getElementById('searchInput')?.focus()}
              className="flex w-full items-center pl-[20px] bg-white h-[55px] py-3 px-3 border border-s-babgray rounded-3xl"
            >
              <input
                id="searchInput"
                className="focus:outline-none w-full"
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === `Enter`) {
                  }
                }}
                placeholder="맛집 이름이나 음식 종류로 검색하기"
              />
            </div>
            <div className="flex px-[30px] py-[20px] justify-center items-center bg-bab-500 rounded-[18px]">
              <RiSearchLine className=" text-white" />
            </div>
          </div>
          <div className="flex gap-[8px] justify-start ">
            <BrandTag>전체</BrandTag>
            <GrayTag>한식</GrayTag>
            <GrayTag>중식</GrayTag>
            <GrayTag>일식</GrayTag>
            <GrayTag>양식</GrayTag>
            <GrayTag>분식</GrayTag>
            <GrayTag>아시안</GrayTag>
            <GrayTag>인도</GrayTag>
            <GrayTag>멕시코</GrayTag>
          </div>
          <div className="flex justify-start gap-[8px]">
            <BlackTag>최신순</BlackTag>
            <GrayTag>별점순</GrayTag>
            <GrayTag>리뷰순</GrayTag>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[34px]">
          {[...Array(6)].map((_, index) => (
            <RowCard key={index} />
          ))}
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default ReviewsPage;
