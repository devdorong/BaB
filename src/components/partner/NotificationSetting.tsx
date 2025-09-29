import React, { useState } from 'react';

const NotificationSetting = () => {
  const [settings, setSettings] = useState({
    order: true,
    review: false,
    system: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      {/* 알림설정 */}
      <div className="flex-col flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border outline-babgray flex items-start">
        {/* 제목 */}
        <h2 className="text-base font-bold text-gray-900 mb-6">알림 설정</h2>

        {/* 알림 항목 리스트 */}
        <div className="w-full grid grid-cols-2 gap-y-6 gap-x-10">
          {/* 새 주문 알림 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">새 주문 알림</p>
              <p className="text-sm text-gray-500">새로운 주문이 들어올 즉시 알림을 받습니다</p>
            </div>
            <button
              onClick={() => handleToggle('order')}
              className={[
                'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                settings.order ? 'bg-[#FF5722]' : 'bg-gray-300',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.order ? 'translate-x-[18px]' : 'translate-x-[2px]',
                ].join(' ')}
              />
            </button>
          </div>

          {/* 리뷰 알림 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">리뷰 알림</p>
              <p className="text-sm text-gray-500">새로운 고객 리뷰가 등록되면 알림을 받습니다</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('review')}
              className={[
                'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                settings.review ? 'bg-[#FF5722]' : 'bg-gray-300',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.review ? 'translate-x-[18px]' : 'translate-x-[2px]',
                ].join(' ')}
              />
            </button>
          </div>

          {/* 잔여 알림 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">잦은 알림</p>
              <p className="text-sm text-gray-500">매장 운영 중 발생한 알림을 수신합니다</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('system')}
              className={[
                'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                settings.system ? 'bg-[#FF5722]' : 'bg-gray-300',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.system ? 'translate-x-[18px]' : 'translate-x-[2px]',
                ].join(' ')}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSetting;
