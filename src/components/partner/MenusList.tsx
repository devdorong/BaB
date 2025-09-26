import React from 'react';
import MenuCard from '../../ui/jy/Menucard';

// 카테고리(= tag) 정의
export const CATEGORYS = ['피자', '사이드', '음료'] as const;
export type Category = (typeof CATEGORYS)[number];

// 카테고리 탭에서 쓸 옵션(전체 포함)
export const CATEGORY_TABS = ['전체', ...CATEGORYS] as const;
export type CategoryTab = (typeof CATEGORY_TABS)[number];

// MenuCard용 아이템 타입
export type MenuItem = {
  id: number;
  title: string;
  description?: string;
  price: number;
  tag: Category;
  imageUrl?: string | null;
  enabled: boolean;
};

export const dororongpizza: MenuItem[] = [
  {
    id: 1,
    title: '마르게리타',
    description: '산 마르자노 토마토와 모차렐라, 바질의 클래식 조합',
    price: 12900,
    tag: '피자',
    imageUrl:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    enabled: true,
  },
  {
    id: 2,
    title: '페퍼로니',
    description: '진한 토마토 소스와 페퍼로니를 듬뿍',
    price: 14900,
    tag: '피자',
    imageUrl:
      'https://images.unsplash.com/photo-1628672092908-c92a710bb3d6?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    enabled: true,
  },
  {
    id: 3,
    title: '트러플 머쉬룸',
    description: '트러플 오일과 버섯으로 풍미를 살린 스페셜',
    price: 19900,
    tag: '피자',
    imageUrl:
      'https://images.unsplash.com/photo-1621702377218-80264cd9fd38?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    enabled: true,
  },
  {
    id: 4,
    title: '치킨 윙(6조각)',
    description: '오븐에 구워 촉촉한 윙',
    price: 8900,
    tag: '사이드',
    imageUrl:
      'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    enabled: true,
  },
  {
    id: 5,
    title: '웨지 감자',
    description: '겉바속촉 웨지감자',
    price: 5900,
    tag: '사이드',
    imageUrl:
      'https://images.unsplash.com/photo-1623238913973-21e45cced554?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    enabled: true,
  },
  {
    id: 6,
    title: '치즈 스틱(4개)',
    description: '고소하고 쭉 늘어나는 치즈',
    price: 5900,
    tag: '사이드',
    imageUrl:
      'https://images.unsplash.com/photo-1734774924912-dcbb467f8599?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    enabled: false,
  },
  {
    id: 7,
    title: '콜라 500ml',
    description: '탄산음료',
    price: 2000,
    tag: '음료',
    imageUrl:
      'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    enabled: true,
  },
  {
    id: 8,
    title: '사이다 500ml',
    description: '탄산음료',
    price: 2000,
    tag: '음료',
    imageUrl:
      'https://images.unsplash.com/photo-1680404005217-a441afdefe83?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    enabled: true,
  },
];

function MenusList({
  filtered,
  onToggle,
}: {
  filtered: MenuItem[];
  onToggle: (id: number, newToggle: boolean) => void;
}) {
  // 피자가게 목업 데이터

  return (
    <div className="grid grid-cols-3 gap-[26px]">
      {filtered.map(item => (
        <MenuCard key={item.id} {...item} onToggle={newToggle => onToggle(item.id, newToggle)} />
      ))}
    </div>
  );
}

export default MenusList;
