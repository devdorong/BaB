import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { GetPoint, totalChangePoint } from '../../../services/PointService';
import type { Profile } from '../../../types/bobType';
import { usePoint } from '../../../contexts/PointContext';
import { RiCoinLine, RiGiftLine } from 'react-icons/ri';
import RewardChange from '../../../components/point/RewardChange';
import PointRule from '../../../components/point/PointRule';
import CouponPage from '../../../components/point/CouponSave';

type TabType = 'reward' | 'coupon' | 'rule';

function PointPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { loading, point, refreshPoint, addPoint, subPoint, total } = usePoint();

  const [selectedTab, setSelectedTab] = useState<TabType>('reward');
  const [totalPoint, setTotalPoint] = useState(0);

  // 포인트 정보 불러오기
  useEffect(() => {
    if (!user) return;
    refreshPoint();
  }, [user]);

  // // 포인트 총 사용
  // useEffect(() => {
  //   const totalUserPoint = async () => {
  //     const total = await totalChangePoint();
  //     setTotalPoint(total);
  //   };
  //   totalUserPoint();
  // }, [point]);

  if (loading) return <p>포인트 불러오는 중..</p>;

  return (
    <div id="root" className="flex flex-col min-h-screen">
      <div className="flex-1 bg-bg-bg ">
        {/* 프로필 헤더 링크 */}
        <div className="flex flex-col w-[1280px] m-auto">
          <div className="flex py-[15px]">
            <div className="text-babgray-600 text-[17px]">프로필</div>
            <div className="text-babgray-600 px-[5px] text-[17px]">{'>'}</div>
            <div className="text-bab-500 text-[17px]">포인트</div>
          </div>
          <div className="mt-[20px] mb-[60px]">
            <div className="flex gap-[40px] items-start">
              {/* 왼쪽 프로필 카드 */}
              <div className="flex flex-col gap-[20px] items-center justify-center">
                <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                  {/* 프로필 및 설명 */}
                  <div className="gap-[15px] flex flex-col justify-center items-center">
                    <div className="flex p-[25px] items-center bg-bab-500 rounded-full">
                      <RiCoinLine className="text-white w-[30px] h-[30px] aspect-square" />
                    </div>
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
                      <div className="text-[22px] font-bold text-babbutton-green">+ 0</div>
                      <div className="text-[14px] text-babgray-600">총 적립</div>
                    </div>
                    <div>
                      <div className="text-[22px] font-bold text-babbutton-red">
                        - {total.toLocaleString()}
                      </div>
                      <div className="text-[14px] text-babgray-600">총 사용</div>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
              {/* 오른쪽 프로필카드 */}
              <div className="flex flex-col gap-[25px] flex-1">
                {/* 리워드교환 / 쿠폰함 / 적립방법 */}
                <div className="flex self-start p-[3px] items-center justify-center gap-[3px] bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between items-center gap-[3px]">
                    <button
                      onClick={() => setSelectedTab('reward')}
                      className={`flex px-[8px] py-[15px] gap-[7px] justify-center items-center margin rounded-[8px] bg-bab-500 ${selectedTab === 'reward' ? 'bg-bab-500 text-white' : 'bg-white text-babgray-600'} `}
                    >
                      <div className="flex w-[120px] items-center gap-[7px] justify-center text-[14px]">
                        <RiGiftLine className="w-[15px] h-[15px]" />
                        리워드 교환
                      </div>
                    </button>
                    <button
                      onClick={() => setSelectedTab('coupon')}
                      className={`flex px-[8px] py-[15px] gap-[7px] justify-center items-center margin rounded-[8px] bg-bab-500 ${selectedTab === 'coupon' ? 'bg-bab-500 text-white' : 'bg-white text-babgray-600'} `}
                    >
                      <div className="flex w-[120px] items-center gap-[7px] justify-center text-[14px]">
                        <RiGiftLine className="w-[15px] h-[15px]" />
                        쿠폰함
                      </div>
                    </button>
                    <button
                      onClick={() => setSelectedTab('rule')}
                      className={`flex px-[8px] py-[15px] gap-[7px] justify-center items-center margin rounded-[8px] bg-bab-500 ${selectedTab === 'rule' ? 'bg-bab-500 text-white' : 'bg-white text-babgray-600'} `}
                    >
                      <div className="flex w-[120px] items-center gap-[7px] justify-center text-[14px]">
                        <RiGiftLine className="w-[15px] h-[15px]" />
                        적립
                      </div>
                    </button>
                  </div>
                </div>
                {/* 카드 영역 */}
                <div className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
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
