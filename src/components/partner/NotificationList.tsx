import React from 'react';
import { badgeColors, notifications } from '../../pages/partner/NotificationPage';

const NotificationList = () => {
  return (
    <div className="space-y-3">
      {notifications.map(item => (
        <div
          key={item.id}
          className="flex items-start gap-3 border border-[#FF5722]/40 rounded-lg p-4"
        >
          {/* 아이콘 (예시: 이모지) */}
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[#FF5722]/10 text-[#FF5722]">
            🛒
          </div>

          {/* 본문 */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">{item.title}</p>
              <span className="w-1 h-1 rounded-full bg-red-500"></span>
            </div>
            <p className="text-sm text-gray-600">{item.message}</p>
            <p className="text-xs text-gray-400 mt-1">{item.time}</p>
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
