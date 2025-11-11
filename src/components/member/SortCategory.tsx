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
            { label: '거리순', value: 'distance' },
            { label: '별점순', value: 'rating' },
            { label: '리뷰순', value: 'review' },
          ]}
        />
      </div>
    </>
  );
}

export default SortCategory;
