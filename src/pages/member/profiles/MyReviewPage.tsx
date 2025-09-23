import React from 'react';
import { BrandTag, GrayTag } from '../../../ui/tag';
import RestaurantCard from '../../../ui/jy/RestaurantCard';

const dummy = Array.from({ length: 10 }).map((_, i) => ({
  imageUrl: '/sample.jpg',
  name: `미슐랭 파스타 하우스`,
  rating: 4.8,
  reviewCount: 127,
  location: '강남구 청담동',
  distanceKm: 1.2,
  reviewSnippet:
    '정말 맛있는 파스타집이에요! 특히 트러플 크림 파스타가 최고였습니다. 분위기도 로맨틱…',
  likeCount: 24 + i,
}));

function MyReviewPage() {
  return (
    <div id="root" className="flex flex-col min-h-screen">
      <div className="w-[1280px] mx-auto">
        {/* 프로필 헤더 링크 */}
        <div className="flex py-[15px]">
          <div className="text-babgray-600 text-[17px]">프로필</div>
          <div className="text-babgray-600 px-[5px] text-[17px]">{'>'}</div>
          <div className="text-bab-500 text-[17px]">내가 쓴 리뷰</div>
        </div>
        <div className="w-[1280px] mx-auto flex flex-col gap-8 py-8">
          {/* 타이틀 */}
          <div className="flex flex-col gap-1 pb-[30px]">
            <p className="text-3xl font-bold">내가 쓴 리뷰</p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {dummy.map((d, idx) => (
              <RestaurantCard key={idx} {...d} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyReviewPage;
