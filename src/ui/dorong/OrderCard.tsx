import { RiCheckLine, RiEye2Line, RiRestaurantLine } from 'react-icons/ri';
import TagBadge from '../TagBadge';

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
  return (
    <div className="rounded-[8px]">
      {/* 상단 */}
      <div className="flex justify-between p-[26px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-babbutton-brown_back">
            <RiRestaurantLine size={16} color="#7C2D12" />
          </div>
          <div>
            <span className="font-bold text-[16px] text-babgray-900">{id}</span>
            <span className="font-medium text-[16px] text-babgray-600">
              {type}·{time}
            </span>
          </div>
        </div>
        <TagBadge bgColor={bgColor} textColor={textColor}>
          {status}
        </TagBadge>
      </div>
      {/* 중단 */}
      <div>
        <div>
          <span>고객 정보</span>
          <div>
            <span>{customerName}</span>
            <span>{customerPhone}</span>
          </div>
        </div>
      </div>
      {/* 버튼하단 */}
      <div>
        <button>
          <RiCheckLine />
          <span>상태 변경</span>
        </button>
        <button>
          <RiEye2Line />
          <span>상태 보기</span>
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
