import PartnerBoardHeader from '../../components/PartnerBoardHeader';
import OrderCard from '../../ui/dorong/OrderCard';

type OrderStatus = '대기중' | '조리중' | '준비중' | '완료';

interface Order {
  id: string;
  type: '매장 식사' | '포장' | '배달';
  time: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
}

// 목업 데이터
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    type: '매장 식사',
    time: '14:30',
    customerName: '김사라',
    customerPhone: '010-1234-5678',

    status: '조리중',
  },
  {
    id: 'ORD-002',
    type: '포장',
    time: '14:45',
    customerName: '이민호',
    customerPhone: '010-9876-5432',
    status: '대기중',
  },
  {
    id: 'ORD-003',
    type: '배달',
    time: '15:00',
    customerName: '박지현',
    customerPhone: '010-5555-2222',
    status: '조리중',
  },
  {
    id: 'ORD-004',
    type: '매장 식사',
    time: '15:05',
    customerName: '정우성',
    customerPhone: '010-3333-4444',

    status: '준비중',
  },
  {
    id: 'ORD-005',
    type: '매장 식사',
    time: '15:10',
    customerName: '최유리',
    customerPhone: '010-2222-1111',

    status: '완료',
  },
  {
    id: 'ORD-006',
    type: '배달',
    time: '15:15',
    customerName: '김지훈',
    customerPhone: '010-9999-8888',
    status: '조리중',
  },
  {
    id: 'ORD-007',
    type: '포장',
    time: '15:20',
    customerName: '이수정',
    customerPhone: '010-1111-2222',
    status: '대기중',
  },
  {
    id: 'ORD-008',
    type: '매장 식사',
    time: '15:25',
    customerName: '한지민',
    customerPhone: '010-4444-5555',

    status: '조리중',
  },
  {
    id: 'ORD-009',
    type: '매장 식사',
    time: '15:30',
    customerName: '오세훈',
    customerPhone: '010-7777-6666',

    status: '준비중',
  },
  {
    id: 'ORD-010',
    type: '배달',
    time: '15:35',
    customerName: '강다현',
    customerPhone: '010-1212-3434',
    status: '조리중',
  },
  {
    id: 'ORD-011',
    type: '포장',
    time: '15:40',
    customerName: '송지효',
    customerPhone: '010-8989-6767',
    status: '완료',
  },
  {
    id: 'ORD-012',
    type: '매장 식사',
    time: '15:45',
    customerName: '김우빈',
    customerPhone: '010-5656-7878',

    status: '대기중',
  },
  {
    id: 'ORD-013',
    type: '매장 식사',
    time: '15:50',
    customerName: '박보영',
    customerPhone: '010-9898-2323',

    status: '조리중',
  },
  {
    id: 'ORD-014',
    type: '배달',
    time: '15:55',
    customerName: '이동욱',
    customerPhone: '010-3434-5656',
    status: '대기중',
  },
  {
    id: 'ORD-015',
    type: '포장',
    time: '16:00',
    customerName: '김지원',
    customerPhone: '010-6767-8989',
    status: '완료',
  },
  {
    id: 'ORD-016',
    type: '매장 식사',
    time: '16:05',
    customerName: '정해인',
    customerPhone: '010-1414-1515',

    status: '준비중',
  },
  {
    id: 'ORD-017',
    type: '매장 식사',
    time: '16:10',
    customerName: '윤아',
    customerPhone: '010-2222-7878',

    status: '조리중',
  },
  {
    id: 'ORD-018',
    type: '포장',
    time: '16:15',
    customerName: '김수현',
    customerPhone: '010-3131-4141',
    status: '대기중',
  },
  {
    id: 'ORD-019',
    type: '배달',
    time: '16:20',
    customerName: '이정은',
    customerPhone: '010-5151-6161',
    status: '조리중',
  },
  {
    id: 'ORD-020',
    type: '매장 식사',
    time: '16:25',
    customerName: '박서준',
    customerPhone: '010-7171-8181',

    status: '완료',
  },
];

function OrdersPage() {
  return (
    <>
      <PartnerBoardHeader title="주문 내역" subtitle="실시간 주문을 관리하세요." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockOrders.map(item => (
          <OrderCard
            key={item.id}
            customerName={item.customerName}
            customerPhone={item.customerPhone}
            id={item.id}
            status={item.status}
            time={item.time}
            type={item.type}
          />
        ))}
      </div>
    </>
  );
}

export default OrdersPage;
