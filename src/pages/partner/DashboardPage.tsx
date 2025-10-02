import { RiLoopLeftLine } from 'react-icons/ri';
import { MoneyDollarCircleFill, StarFill, TimeLine, UserLine } from '../../ui/Icon';
import TagBadge from '../../ui/TagBadge';
import PartnerBoardHeader from '../../components/PartnerBoardHeader';
import { ButtonFillLG } from '../../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import type { Profile } from '../../types/bobType';
import { getProfile } from '../../lib/propile';

function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const [nickname, setNickname] = useState('');

  const loadProfile = async () => {
    if (!user?.id) {
      setError('사용자정보 없음');
      setLoading(false);
      return;
    }
    try {
      // 사용자 정보 가져오기
      const tempData = await getProfile(user?.id);
      if (!tempData) {
        // null의 경우
        setError('사용자 프로필 정보 찾을 수 없음');
        return;
      }
      // 사용자 정보 유효함
      setNickname(tempData.nickname || '');
      setProfileData(tempData);
    } catch (error) {
      setError('프로필 호출 오류');
    } finally {
      setLoading(false);
    }
  };

  // id로 닉네임을 받아옴
  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  return (
    <>
      <PartnerBoardHeader
        title="대시보드"
        subtitle={`안녕하세요, ${profileData?.nickname}님! 오늘 레스토랑 현황을 확인해보세요.`}
      />
      <div className="w-full flex flex-col text-babgray-800 gap-10">
        {/* 오늘의 매출, 대기 중인 주문, 새로운 리뷰 */}
        <div className="flex gap-6">
          <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border outline-babgray flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="text-babgray-600">오늘의 매출</p>
              {/* 하루 매출 값 출력(최근 주문 영역의 금액내역 추출) */}
              <p className="text-2xl font-semibold">2,847,000 원</p>
            </div>
            <div className="w-12 h-12 p-3.5 bg-bab rounded-lg flex items-center justify-center">
              <MoneyDollarCircleFill size={20} />
            </div>
          </div>
          <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border outline-babgray flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="text-babgray-600">대기 중인 주문</p>
              {/* 대기 중인 주문 출력 (최근주문 영역의 조리중,주문접수만 체크) */}
              <p className="text-2xl font-semibold">23건</p>
            </div>
            <div className="w-12 h-12 p-3.5 bg-babbutton-blue rounded-lg flex items-center justify-center">
              <TimeLine bgColor="#3b82f6" size={20} />
            </div>
          </div>
          <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border outline-babgray flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="text-babgray-600">새로운 리뷰</p>
              {/* 새로운 리뷰 출력 (고객리뷰 탭의 하루? 최근일주일? 동안의 등록글 카운팅 출력) */}
              <p className="text-2xl font-semibold">8개</p>
            </div>
            <div className="w-12 h-12 p-3.5 bg-babbutton-green rounded-lg flex items-center justify-center">
              <StarFill bgColor="#22c55e" size={20} />
            </div>
          </div>
        </div>
        {/* 최근 주문 무한스크롤 적용 (하루단위) */}
        <div className="pl-7 pr-5 py-7 border border-babgray bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-black text-xl font-bold">최근 주문</p>
              <p className="text-babgray-600">실시간으로 레스토랑 주문을 관리하세요</p>
            </div>
            {/* 클릭시 최근주문 영역만 새로고침 */}
            <button className="flex text-lg bg-bab w-auto h-auto px-2 py-1.5 rounded-md text-white items-center gap-2">
              <RiLoopLeftLine />
              <p>새로고침</p>
            </button>
          </div>
          <div className="flex flex-col divide-y divide-babgray">
            <div className="grid grid-cols-6 py-4">
              <p>주문번호</p>
              <p>고객명</p>
              <p>주문 메뉴</p>
              <p>금액</p>
              <p>상태</p>
              <p>시간</p>
            </div>
            <div className="grid grid-cols-6 py-4 items-center">
              {/* 주문번호 */}
              <p>#ORD-001</p>
              {/* 주문한 고객의 이름,프로필사진 */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 bg-babgray rounded-full">
                  <UserLine bgColor="#e5e7eb" color="#424242" size={15} />
                </div>
                <p>김사라</p>
              </div>
              {/* 고객이 주문한 메뉴 */}
              <p>연어구이,시저샐러드</p>
              {/* 고객이 주문한 메뉴 가격의 합 */}
              <p className="font-bold">42,000원</p>
              {/* 주문내역 탭의 상태 */}
              <div>
                <TagBadge bgColor="bg-babbutton-blue_back" textColor="text-babbutton-blue">
                  조리중
                </TagBadge>
              </div>
              {/* 주문한 시간 */}
              <p>오후 2:30</p>
            </div>
            <div className="grid grid-cols-6 py-4 items-center">
              {/* 주문번호 */}
              <p>#ORD-002</p>
              {/* 주문한 고객의 이름,프로필사진 */}
              <div className="flex items-center gap-2 ">
                <div className="flex items-center justify-center w-6 h-6 bg-babgray rounded-full">
                  <UserLine bgColor="#e5e7eb" color="#42424" size={15} />
                </div>
                <p>이민호</p>
              </div>
              {/* 고객이 주문한 메뉴 */}
              <p>비프버거, 감자튀김, 콜라</p>
              {/* 고객이 주문한 메뉴 가격의 합 */}
              <p className="font-bold ">23,000원</p>
              {/* 주문내역 탭의 상태 */}
              <div>
                <TagBadge bgColor="bg-babbutton-brown_back" textColor="text-babbutton-brown">
                  완료
                </TagBadge>
              </div>
              {/* 주문한 시간 */}
              <p>오후 2:25</p>
            </div>
            <div className="grid grid-cols-6 py-4 items-center">
              {/* 주문번호 */}
              <p>#ORD-003</p>
              {/* 주문한 고객의 이름,프로필사진 */}
              <div className="flex items-center gap-2 ">
                <div className="flex items-center justify-center w-6 h-6 bg-babgray rounded-full">
                  <UserLine bgColor="#e5e7eb" color="#42424" size={15} />
                </div>
                <p>박지은</p>
              </div>
              {/* 고객이 주문한 메뉴 */}
              <p>마르게리타 피자</p>
              {/* 고객이 주문한 메뉴 가격의 합 */}
              <p className="font-bold ">26,000원</p>
              {/* 주문내역 탭의 상태 */}
              <div>
                <TagBadge bgColor="bg-babbutton-purple_back" textColor="text-babbutton-purple">
                  주문 접수
                </TagBadge>
              </div>
              {/* 주문한 시간 */}
              <p>오후 2:20</p>
            </div>
            <div className="grid grid-cols-6 py-4 items-center">
              {/* 주문번호 */}
              <p>#ORD-004</p>
              {/* 주문한 고객의 이름,프로필사진 */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 bg-babgray rounded-full">
                  <UserLine bgColor="#e5e7eb" color="#42424" size={15} />
                </div>
                <p>최동원</p>
              </div>
              {/* 고객이 주문한 메뉴 */}
              <p>치킨 알프레도, 갈릭브레드</p>
              {/* 고객이 주문한 메뉴 가격의 합 */}
              <p className="font-bold ">35,000원</p>
              {/* 주문내역 탭의 상태 */}
              <div>
                <TagBadge bgColor="bg-babbutton-green_back" textColor="text-babbutton-green">
                  배송 완료
                </TagBadge>
              </div>
              {/* 주문한 시간 */}
              <p>오후 11:25</p>
            </div>
            <div className="grid grid-cols-6 py-4 items-center">
              {/* 주문번호 */}
              <p>#ORD-005</p>
              {/* 주문한 고객의 이름,프로필사진 */}
              <div className="flex items-center gap-2 ">
                <div className="flex items-center justify-center w-6 h-6 bg-babgray rounded-full">
                  <UserLine bgColor="#e5e7eb" color="#42424" size={15} />
                </div>
                <p>정수미</p>
              </div>
              {/* 고객이 주문한 메뉴 */}
              <p>그릭샐러드, 레모네이드</p>
              {/* 고객이 주문한 메뉴 가격의 합 */}
              <p className="font-bold ">19,000원</p>
              {/* 주문내역 탭의 상태 */}
              <div>
                <TagBadge bgColor="bg-babbutton-blue_back" textColor="text-babbutton-blue">
                  조리 중
                </TagBadge>
              </div>
              {/* 주문한 시간 */}
              <p>오전 9:08</p>
            </div>
          </div>
        </div>
        {/* 주간 매출 추세, 인기 메뉴 */}
        <div className="flex gap-6">
          <div className="pl-7 pr-5 py-7 border border-babgray bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] flex flex-1 flex-col gap-5">
            <div>
              <p className="text-black text-xl font-bold">주간 매출 추세</p>
              <p className="text-babgray-600">최근 7일간의 매출 성과</p>
            </div>
            {/* 차트활용 한 주 동안의 매출 그래프 */}
            <div className="flex justify-center items-center">
              <img src="public/chart1.png" alt="통계그래프" />
            </div>
            <div className="flex items-center text-babgray-500">
              <p>총계 :</p>
              {/* 한 주 동안의 매출 내역 합계 */}
              <div className="font-bold">15,000,000원</div>
            </div>
          </div>
          <div className="pl-7 pr-5 py-7 border border-babgray bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] flex flex-1 flex-col gap-5">
            <div>
              <p className="text-black text-xl font-bold">인기 메뉴</p>
              <p className="text-babgray-600">이번주 가장 많이 주문된 요리</p>
            </div>
            {/* 한 주 동안의 주문내역의 메뉴이름 내림차순 정렬 */}
            <div className="flex-1 flex items-center justify-center">
              {' '}
              <img src="public/chart2.png" alt="통계그래프" />
            </div>
            <div className="flex items-center text-babgray-500">
              <p>총 주문 :</p>
              {/* 한 주 동안의 총 주문횟수 */}
              <div className="font-bold">167건</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
