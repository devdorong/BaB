import type { Menus } from '../../types/bobType';
import MenuCard from '../../ui/jy/Menucard';

// 카테고리(= tag) 정의
export const CATEGORYS = ['메인메뉴', '사이드', '음료 및 주류'] as const;
export type Category = (typeof CATEGORYS)[number];

// 카테고리 탭에서 쓸 옵션(전체 포함)
export const CATEGORY_TABS = ['전체', ...CATEGORYS] as const;
export type CategoryTab = (typeof CATEGORY_TABS)[number];

interface MenusListProps {
  filtered: Menus[];
  onToggle: (id: number, newToggle: boolean) => void;
  onEdit: (menu: Menus) => void;
  onDelete: (menu: Menus) => void;
}

function MenusList({ filtered, onToggle, onEdit, onDelete }: MenusListProps) {
  // 피자가게 목업 데이터

  // 로딩 상태일때 스켈레톤
  // if (loading) {
  //   return (
  //     <div className="grid grid-cols-4 gap-[26px]">
  //       {[...Array(12)].map((_, i) => (
  //         <div
  //           key={i}
  //           className="animate-pulse rounded-lg border border-babgray-150 bg-gray-100 h-[280px]"
  //         >
  //           <div className="h-32 bg-gray-200 rounded-t-lg"></div>
  //           <div className="p-4 space-y-3">
  //             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  //             <div className="h-3 bg-gray-200 rounded w-full"></div>
  //             <div className="h-3 bg-gray-200 rounded w-5/6"></div>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // }

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        메뉴를 추가해주세요!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-[26px]">
      {filtered &&
        filtered.map(item => (
          <MenuCard
            key={item.id}
            {...item}
            onToggle={newToggle => onToggle(item.id, newToggle)}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
          />
        ))}
    </div>
  );
}

export default MenusList;
