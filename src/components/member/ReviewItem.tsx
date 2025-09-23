import React from 'react';
import { RiChatSmile3Line, RiHeart3Line, RiStarFill } from 'react-icons/ri';

function ReviewItem() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5">
      {/* 상단 헤더 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden">
            <img src="/avatar.png" alt="작성자" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-[14px] font-semibold">소문쟁이</div>
            <div className="text-[12px] text-babgray-600">방문 3회 · 2일 전</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* 별점 5 */}
          {Array.from({ length: 5 }).map((_, i) => (
            <RiStarFill key={i} className="text-yellow-400 text-[16px]" />
          ))}
        </div>
      </div>

      {/* 내용 */}
      <p className="mt-3 text-[14px] text-babgray-800">
        밥도 맛있고 불고기도 듬뿍, 국물맛 진짜 감칠맛있어요!
      </p>

      {/* 이미지 + 액션 */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-[64px] h-[64px] rounded-lg overflow-hidden border border-black/5 shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
            <img src="/dish.jpg" alt="메뉴" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex items-center gap-4 text-babgray-700">
          <button className="inline-flex items-center gap-1 text-[13px]">
            <RiChatSmile3Line className="text-[16px]" />
            댓글 2
          </button>
          <button className="inline-flex items-center gap-1 text-[13px]">
            <RiHeart3Line className="text-[16px]" />
            좋아요 23
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewItem;
