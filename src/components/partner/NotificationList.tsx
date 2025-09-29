import React, { useState } from 'react';
import {
  badgeColors,
  borderColors,
  IconColors,
  notifications,
  type TabId,
} from '../../pages/partner/NotificationPage';
import { Settings5Fill, ShoppingCartFill, StarFill } from '../../ui/Icon';

interface selectedTypeCategoriesProps {
  selectedTypeCategories: TabId;
}

const NotificationList = ({ selectedTypeCategories }: selectedTypeCategoriesProps) => {
  // 카테고리 필터 적용
  const filtered =
    selectedTypeCategories === '전체'
      ? notifications
      : notifications.filter(item => item.type === selectedTypeCategories);

  return (
    <div className="space-y-3">
      {filtered.map(item => (
        <div
          key={item.id}
          className={`flex bg-white items-start gap-3 border ${borderColors[item.type].split(' ')[2]} ${borderColors[item.type].split(' ')[1]} rounded-lg p-4 border-l-4`}
        >
          {/* 아이콘 (예시: 이모지) */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-md  ${IconColors[item.type]}`}
          >
            {item.type === '주문' ? (
              <ShoppingCartFill size={20} />
            ) : item.type === '리뷰' ? (
              <StarFill bgColor="none" size={20} />
            ) : (
              <Settings5Fill bgColor="#3b82f6" size={20} />
            )}
          </div>

          {/* 본문 */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-[15px] text-gray-900">{item.title}</p>
              <span className={`w-1.5 h-1.5 rounded-full ${IconColors[item.type]}`}></span>
            </div>
            <div className="flex flex-col gap-[15px]">
              <p className="text-[12px] text-gray-600">{item.message}</p>
              <p className="text-[11px] text-gray-400 mt-1">{item.time}</p>
            </div>
          </div>

          {/* 상태 뱃지 */}
          <div className="shrink-0">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeColors[item.type]}`}
            >
              {item.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
