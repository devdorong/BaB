import React from 'react';
import { RiCalendarLine, RiMoreFill, RiStarFill, RiStoreLine } from 'react-icons/ri';
import TagBadge from '../../ui/TagBadge';

const RecentMatchingRecordItem = () => {
  return (
    <section className="w-full p-[20px]  bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
      {/* 프로필 아이콘 */}
      <div className="flex gap-[20px]">
        <div className="w-12 h-12 rounded-full bg-gradient-to-l from-red-400 to-orange-600 flex items-center justify-center text-white font-bold">
          스
        </div>
        {/* 내용 */}
        <div className="flex flex-col flex-1 gap-3">
          {/* 상단 이름 + 상태 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <p className="text-gray-800 font-medium">스팸네개</p>
              <TagBadge bgColor="bg-green-100" textColor="text-green-700">
                완료
              </TagBadge>
            </div>
            <button className="text-gray-400">
              <RiMoreFill />
            </button>
          </div>

          {/* 장소 + 시간 */}
          <div className="flex flex-col justify-center text-sm text-gray-600 gap-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">
                <RiStoreLine />
              </span>
              강남 이탈리안 레스토랑 · 강남구 역삼동
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">
                <RiCalendarLine />
              </span>
              2025-09-05 16:44
            </div>
          </div>

          {/* 태그 */}
          <div className="flex gap-2">
            <TagBadge bgColor="bg-babcategory-italianbg" textColor="text-babcategory-italiantext">
              양식
            </TagBadge>
            <TagBadge bgColor="bg-babcategory-alcoholbg" textColor="text-babcategory-alcoholtext">
              술
            </TagBadge>
            <TagBadge bgColor="bg-babcategory-indoorbg" textColor="text-babcategory-indoortext">
              실내
            </TagBadge>
          </div>

          {/* 평가 */}
          <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-gray-700">내 평가</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <RiStarFill key={i} className="w-4 h-4 text-yellow-400" />
                ))}
                <span className="text-xs text-gray-600">(5.0)</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm">
              정말 좋은 시간이었어요! 맛있는 음식과 즐거운 대화까지, 분위기도 좋았습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentMatchingRecordItem;
