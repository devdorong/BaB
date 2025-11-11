import { BlackTag, GrayTag } from '@/ui/tag';
import { Select } from 'antd';
import { useState } from 'react';

interface SortMatchingCategoryProps {
  sortOption: '최신순' | '거리순';
  setSortOption: (type: '최신순' | '거리순') => void;
}

export function SortMatchingCategory({ sortOption, setSortOption }: SortMatchingCategoryProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (option: typeof sortOption) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  return (
    <>
      {/* 정렬 옵션 */}
      <div className="hidden lg:flex flex-wrap justify-start sm:justify-start gap-2">
        <button onClick={() => handleSortChange('최신순')} className="cursor-pointer">
          {sortOption === '최신순' ? <BlackTag>최신순</BlackTag> : <GrayTag>최신순</GrayTag>}
        </button>

        <button onClick={() => handleSortChange('거리순')} className="cursor-pointer">
          {sortOption === '거리순' ? <BlackTag>거리순</BlackTag> : <GrayTag>거리순</GrayTag>}
        </button>
      </div>

      <div className="lg:hidden flex">
        <Select
          value={sortOption}
          suffixIcon={null}
          onChange={e => setSortOption(e)}
          className="bab-select text-center justify-center items-center w-[121px] h-[50px]"
          // ✅ dropdown을 부모 엘리먼트 안에 렌더링 (필수)
          getPopupContainer={trigger => trigger.parentElement!}
          // ✅ popup 스타일 (모바일 스크롤 안정화)
          styles={{
            popup: {
              root: {
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'auto', // ← pan-y 대신 auto
                pointerEvents: 'auto', // ← 스크롤 반응 향상
              },
            },
          }}
          // ✅ Tailwind 클래스 적용 (선택)
          classNames={{
            popup: {
              root: 'bab-select-dropdown',
            },
          }}
          listHeight={256}
          virtual={false}
          options={[
            { label: '최신순', value: '최신순' },
            { label: '거리순', value: '거리순' },
          ]}
        />
      </div>
    </>
  );
}

export default SortMatchingCategory;
