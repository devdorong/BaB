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
          className="bab-select text-center justify-center items-center w-[90px] h-[50px] appearance-none"
          classNames={{
            popup: {
              root: 'bab-select-dropdown',
            },
          }}
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
