import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { GetPoint, totalChangePoint } from '../../../services/PointService';
import type { Profile } from '../../../types/bobType';
import { usePoint } from '../../../contexts/PointContext';
import { RiArrowRightSLine, RiCoinLine, RiGiftLine } from 'react-icons/ri';
import RewardChange from '../../../components/point/RewardChange';
import PointRule from '../../../components/point/PointRule';
import CouponPage from '../../../components/point/CouponSave';

type TabType = 'reward' | 'coupon' | 'rule';

function PointSkeleton() {
  return (
    <div id="root" className="flex flex-col min-h-screen">
      <div className="flex-1 bg-bg-bg ">
        <div className="flex flex-col max-w-[1280px] mx-auto animate-pulse px-4 sm:px-6 lg:px-8 xl:px-0">
          <div className="flex py-[15px]">
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
            <div className="flex pt-[3px] items-center px-[5px]">
              <RiArrowRightSLine className="text-gray-300" />
            </div>
            <div className="h-5 w-10 bg-gray-200 rounded"></div>
          </div>

          <div className="mt-[25px] mb-[60px] flex gap-[40px]">
            {/* 왼쪽 카드 */}
            <div className="w-[260px] h-[323px] bg-white rounded-[16px] shadow-[0px_4px_4px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center">
              <div className="w-[80px] h-[80px] bg-gray-200 rounded-full mb-8"></div>
              <div className="h-9 w-[100px] bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-[60px] bg-gray-100 rounded"></div>
              <div className="w-full border-t border-gray-100 mt-4 mb-4"></div>
              <div className="flex w-[172px] justify-between">
                <div className="flex flex-col gap-3">
                  <div className="h-8 w-[60px] bg-gray-200 rounded"></div>
                  <div className="h-3 w-[60px] bg-gray-200 rounded"></div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="h-8 w-[60px] bg-gray-200 rounded"></div>
                  <div className="h-3 w-[60px] bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* 오른쪽 카드 */}
            <div className="flex flex-col gap-[25px] flex-1">
              <div className="h-[50px] w-[400px] bg-white rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.02)]"></div>
              <div className="h-[400px] w-full bg-white rounded-[16px] shadow-[0px_4px_4px_rgba(0,0,0,0.02)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PointPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { loading, point, refreshPoint, addPoint, subPoint, total, totaladd } = usePoint();

  const [selectedTab, setSelectedTab] = useState<TabType>('reward');
  const [totalPoint, setTotalPoint] = useState(0);

  // 포인트 정보 불러오기
  useEffect(() => {
    if (!user) return;
    refreshPoint();
  }, [user]);

  if (loading)
    return (
      <div className="flex flex-col min-h-screen bg-bg-bg">
        <PointSkeleton />
      </div>
    );

  return (
    <div id="root" className="flex flex-col min-h-screen bg-bg-bg">
      {/* 전체를 중앙 정렬 */}
      <div className="w-full flex justify-center">
        {/* 컨텐츠 폭 제한 */}
        <div className="w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 xl:px-0">
          {/* ======== 상단 프로필 헤더 ======== */}
          <div className="hidden lg:flex items-center py-[15px] text-sm sm:text-base">
            <div
              onClick={() => navigate('/member/profile')}
              className="cursor-pointer hover:text-babgray-900 text-babgray-600 text-[17px]"
            >
              프로필
            </div>
            <div className="flex pt-[3px] items-center text-babgray-600 px-[5px] text-[17px]">
              <RiArrowRightSLine />
            </div>
            <div className="text-bab-500 text-[17px]">포인트</div>
          </div>

          <div className="mt-6 mb-14">
            <div className="flex flex-col lg:flex-row lg:gap-8 gap-4 items-start">
              {/* 왼쪽 프로필 카드 */}
              <div className="flex flex-col gap-5 items-center justify-center lg:w-[300px] w-full">
                <div className="inline-flex w-full bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.02)] p-6 flex-col items-center lg:w-[260px]">
                  <div className="p-6 bg-bab-500 rounded-full flex items-center justify-center">
                    {/* 프로필 및 설명 */}
                    <RiCoinLine className="text-white w-8 h-8" />
                  </div>
                  {/* 포인트 */}
                  <div className="text-center py-[23px]">
                    <div className="text-[28px] font-bold text-gray-900">
                      {point.toLocaleString()}P
                    </div>
                    <div className="text-[14px] text-babgray-600">보유 포인트</div>
                  </div>
                  {/* 라인 */}
                  <div className="w-full border-babgray-100 border-[1px]"></div>
                  {/* 리뷰, 찜, 매칭, 평점 */}
                  <div className="flex w-[172px] pt-[23px] text-center justify-between items-center ">
                    <div>
                      <div className="text-lg sm:text-xl font-bold text-babbutton-green">
                        +{totaladd.toLocaleString()}
                      </div>
                      <div className="text-[14px] text-babgray-600">총 적립</div>
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-bold text-babbutton-red">
                        -{total.toLocaleString()}
                      </div>
                      <div className="text-[14px] text-babgray-600">총 사용</div>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
              {/* 오른쪽 프로필카드 */}
              <div className="w-full flex flex-col lg:gap-6 gap-4">
                {/* 리워드교환 / 쿠폰함 / 적립방법 */}
                <div className="flex flex-wrap lg:justify-start justify-between items-center gap-[12px] lg:gap-2 lg:p-1.5 p-1 bg-white rounded-xl shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                  {[
                    { key: 'reward', label: '리워드 교환' },
                    { key: 'coupon', label: '쿠폰함' },
                    { key: 'rule', label: '적립' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setSelectedTab(tab.key as TabType)}
                      className={`flex justify-center items-center gap-[6px] rounded-[8px] transition-colors duration-200
                                  ${selectedTab === tab.key ? 'bg-bab-500 text-white' : 'bg-white text-babgray-600'}
                                  lg:px-[24px] lg:py-[15px] lg:text-[15px] lg:w-[180px]
                                  px-[4px] py-[12px] text-[12px] w-[calc(33.333%-8px)]
                                `}
                    >
                      <RiGiftLine className="w-[14px] h-[14px] lg:w-[17px] lg:h-[17px]" />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* 카드 영역 */}
                <div className="inline-flex w-full px-[20px] lg:px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                  {selectedTab === 'reward' && <RewardChange />}
                  {selectedTab === 'coupon' && <CouponPage />}
                  {selectedTab === 'rule' && <PointRule />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PointPage;
