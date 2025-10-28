import { BlackTag, GrayTag } from '@/ui/tag';
import { Select } from 'antd';

interface SortCategoryProps {
  sortType: 'distance' | 'rating' | 'review';
  setSortType: (type: 'distance' | 'rating' | 'review') => void;
}

function SortCategory({ sortType, setSortType }: SortCategoryProps) {
  return (
    <>
      <div className="hidden lg:flex justify-start gap-[8px]">
        <div onClick={() => setSortType('distance')} className="cursor-pointer">
          {sortType === 'distance' ? <BlackTag>거리순</BlackTag> : <GrayTag>거리순</GrayTag>}
        </div>
        <div onClick={() => setSortType('rating')} className="cursor-pointer">
          {sortType === 'rating' ? <BlackTag>별점순</BlackTag> : <GrayTag>별점순</GrayTag>}
        </div>
        <div onClick={() => setSortType('review')} className="cursor-pointer">
          {sortType === 'review' ? <BlackTag>리뷰순</BlackTag> : <GrayTag>리뷰순</GrayTag>}
        </div>
      </div>

      <div className="lg:hidden flex">
        <Select
          value={sortType}
          suffixIcon={null}
          onChange={e => setSortType(e)}
          className="bab-select text-center justify-center items-center w-[90px] h-[50px] appearance-none"
          options={[
            { label: '거리순', value: 'distance' },
            { label: '별점순', value: 'rating' },
            { label: '리뷰순', value: 'review' },
          ]}
        ></Select>
      </div>
    </>
  );
}

export default SortCategory;
