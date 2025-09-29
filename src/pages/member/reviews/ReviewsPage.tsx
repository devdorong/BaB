import { useEffect, useState } from 'react';
import { RiArrowRightDoubleLine, RiArrowRightSLine, RiSearchLine } from 'react-icons/ri';
import { useAuth } from '../../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ButtonFillMd } from '../../../ui/button';
import { BlackTag, BrandTag, GrayTag } from '../../../ui/tag';
import { RowCard } from '../../../ui/jy/ReviewCard';
import { mockReviews } from '../../../types/review';
import { ReviewCard } from '../../../ui/dorong/ReviewMockCard';

const categories = ['전체', '한식', '중식', '일식', '양식', '분식', '아시안', '인도', '멕시칸'];

function ReviewsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 카테고리 필터 적용
  const filtered =
    selectedCategory === '전체'
      ? mockReviews
      : mockReviews.filter(r => r.category === selectedCategory);

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
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === cat
                    ? 'bg-bab-500 text-white'
                    : 'bg-babgray-100 text-babgray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex justify-start gap-[8px]">
            <BlackTag>최신순</BlackTag>
            <GrayTag>별점순</GrayTag>
            <GrayTag>리뷰순</GrayTag>
          </div>
        </div>
        <div
          onClick={() => navigate('/member/reviews/detail')}
          className="grid grid-cols-2 gap-[34px]"
        >
          {/* {[...Array(6)].map((_, index) => (
            <RowCard key={index} />
          ))} */}
          {filtered.map(r => (
            <ReviewCard
              key={r.id}
              name={r.name}
              category={r.category}
              img={r.img}
              review={r.review}
              rating={r.rating}
              distance={r.distance}
              tagBg={r.tagBg}
              tagText={r.tagText}
            />
          ))}
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default ReviewsPage;
