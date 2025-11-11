import { RiCheckLine, RiEye2Line, RiRestaurantLine } from 'react-icons/ri';
import TagBadge from '../TagBadge';
import { useState } from 'react';
import OrderDetailModal from '../../components/partner/OrderDetailModal';

type OrderStatus = '대기중' | '조리중' | '준비중' | '완료';

interface Order {
  id: string;
  type: '매장 식사' | '포장' | '배달';
  time: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
}
const getStatusColors = (status: '대기중' | '조리중' | '준비중' | '완료') => {
  switch (status) {
    case '대기중':
      return { bgColor: 'bg-green-100', textColor: 'text-green-600' };
    case '조리중':
      return { bgColor: 'bg-babbutton-blue_back', textColor: 'text-babbutton-blue' };
    case '준비중':
      return { bgColor: 'bg-orange-100', textColor: 'text-orange-600' };
    case '완료':
      return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' };
    default:
      return { bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
  }
};

const OrderCard = ({ id, type, time, customerName, customerPhone, status }: Order) => {
  const { bgColor, textColor } = getStatusColors(status);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="px-6 py-7 bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] border border-babgray-150  inline-flex flex-col justify-start items-start gap-5 w-full">
      {/* 상단 */}
      <div className="flex justify-between items-start w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-babbutton-brown_back">
            <RiRestaurantLine size={16} className="text-babbutton-brown" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[16px] text-babgray-900">{id}</span>
            <span className="font-medium text-[14px] text-babgray-600">
              {type}·{time}
            </span>
          </div>
        </div>
        <TagBadge bgColor={bgColor} textColor={textColor}>
          {status}
        </TagBadge>
      </div>

      {/* 중단 */}
      <div className="flex flex-col gap-3 w-full">
        <span className="text-babgray-800 text-base font-bold">고객 정보</span>
        <div className="flex flex-col gap-1">
          <span className="text-babgray-700 text-sm">{customerName}</span>
          <span className="text-babgray-700 text-sm">{customerPhone}</span>
        </div>
      </div>

      {/* 버튼 하단 */}
      <div className="flex flex-col gap-2 w-full">
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-bab text-white rounded-lg text-sm font-bold">
          <RiCheckLine className="w-4 h-4" />
          <span>상태 변경</span>
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-babgray-100 text-babgray-700 rounded-lg text-sm font-bold">
          <RiEye2Line className="w-4 h-4" />
          <span>상세 보기</span>
        </button>
        <OrderDetailModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={data => {
            // console.log('새 메뉴 추가 제출', data);
          }}
        />
      </div>
    </div>
  );
};

export default OrderCard;
