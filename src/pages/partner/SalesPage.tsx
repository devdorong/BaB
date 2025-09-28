import {
  RiBankCardLine,
  RiBarChartFill,
  RiCalendarLine,
  RiHourglassFill,
  RiLoopLeftLine,
  RiMoneyDollarCircleFill,
  RiShoppingCartFill,
} from 'react-icons/ri';
import TagBadge from '../../ui/TagBadge';
import { GreenTag } from '../../ui/tag';
import PartnerBoardHeader from '../../components/PartnerBoardHeader';
import { ButtonFillLG } from '../../ui/button';

function SalesPage() {
  return (
    <>
      <PartnerBoardHeader
        title="매출 & 정산"
        subtitle="매출 현황과 정산 내역을 확인하세요."
        button={<><ButtonFillLG>버튼</ButtonFillLG></>}
      />
      <div className="w-full flex flex-col gap-10 text-babgray-500">
        <div className="px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border flex justify-between items-center">
          {/* 클릭시 당일/이번주/이번달 매출,주문수,평균 주문 금액 변경(정산대기는 당일만적용) */}
          <div className="bg-babgray-100 rounded-lg flex gap-2.5 p-1">
            <div className="px-3 py-2 rounded-lg cursor-pointer">오늘</div>
            <div className="px-3 py-2 rounded-lg cursor-pointer">이번 주</div>
            <div className="px-3 py-2 bg-white shadow rounded-lg text-bab cursor-pointer">
              이번 달
            </div>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            {/* 캘린더 선택시 해당 날짜의 총매출,주문수,평균 주문금액,정산대기,최근거래내역 출력 */}
            <RiCalendarLine />
            <p className="text-color-grayscale-g500 text-xs">2025년 09월 02일 기준</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border flex justify-between items-center">
            <div>
              <p>총 매출</p>
              {/* 오늘, 이번주, 이번달 마다 바뀜 */}
              <p className="text-black text-2xl font-semibold">78,560,000 원</p>
            </div>
            <div className="p-3.5 bg-bab rounded-lg">
              <RiMoneyDollarCircleFill className="text-white w-6 h-6" />
            </div>
          </div>

          <div className="px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border flex justify-between items-center">
            <div>
              <p>주문 수</p>
              {/* 오늘, 이번주, 이번달 마다 바뀜 */}
              <p className="text-black text-2xl font-semibold">1186 건</p>
            </div>
            <div className="p-3.5 bg-blue-500 rounded-lg">
              <RiShoppingCartFill className="text-white w-6 h-6" />
            </div>
          </div>

          <div className="px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border flex justify-between items-center">
            <div>
              <p>평균 주문 금액</p>
              {/* 오늘, 이번주, 이번달 마다 바뀜 */}
              <p className="text-black text-2xl font-semibold">66,250 원</p>
            </div>
            <div className="p-3.5 bg-green-500 rounded-lg">
              <RiBarChartFill className="text-white w-6 h-6" />
            </div>
          </div>

          <div className="px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border flex justify-between items-center">
            <div>
              <p>정산 대기</p>
              {/* 오늘 미결제 금액만 표시 */}
              <p className="text-black text-2xl font-semibold">125,000 원</p>
            </div>
            <div className="p-3.5 bg-yellow-500 rounded-lg">
              <RiHourglassFill className="text-white w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="pl-7 pr-5 py-7 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-black text-xl font-bold">최근 거래 내역</p>
              <p>실시간으로 레스토랑 주문을 관리하세요</p>
            </div>
            {/* 클릭시 최근 거래 내역 영역만 새로고침 */}
            <button className="flex bg-bab px-3 py-1.5 rounded-md text-white items-center gap-2">
              <RiLoopLeftLine className="w-4 h-4" />
              <p>새로고침</p>
            </button>
          </div>

          <div className="grid grid-cols-6 border-b border-babgray py-4 text-babgray-700">
            <p>거래 ID</p>
            <p>주문 번호</p>
            <p>금액</p>
            <p>결제수단</p>
            <p>시간</p>
            <p>상태</p>
          </div>

          <div className="grid grid-cols-6 items-center border-b border-b-babgray py-4 text-babgray-800">
            {/* 거래 ID */}
            <div>TXN-001</div>
            {/* 주문 번호  */}
            <div className="text-bab">ORD-045</div>
            {/* 주문 상품 금액 합계 */}
            <div className="font-bold">48,000 원</div>
            {/* 결제 수단 */}
            <div className="flex items-center gap-2">
              <RiBankCardLine className="w-4 h-4" />
              <p>카드</p>
            </div>
            {/* 결제된 시간 */}
            <div className="text-sm">15:30</div>
            {/* 결제 상태 */}
            <div>
              <TagBadge bgColor="bg-babbutton-blue_back" textColor="text-babbutton-blue">
                완료
              </TagBadge>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SalesPage;
