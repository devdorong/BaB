import { useNavigate } from 'react-router-dom';
import { RowCard } from '../../../ui/jy/ReviewCard';
import { BrandTag, GrayTag } from '../../../ui/tag';

function FavoritePage() {
  const navigate = useNavigate();
  return (
    <div id="root" className="flex flex-col min-h-screen">
      <div className="w-[1280px] mx-auto">
        {/* 프로필 헤더 링크 */}
        <div className="flex py-[15px]">
          <div
            onClick={() => navigate('/member/profile')}
            className=" cursor-pointer hover:text-babgray-900 text-babgray-600 text-[17px]"
          >
            프로필
          </div>
          <div className="text-babgray-600 px-[5px] text-[17px]">{'>'}</div>
          <div className="text-bab-500 text-[17px]">즐겨찾는 식당</div>
        </div>
        <div className="w-[1280px] mx-auto flex flex-col gap-8 py-8">
          {/* 타이틀 */}
          <div className="flex flex-col gap-1">
            <p className="text-3xl font-bold">즐겨찾는 식당</p>
          </div>
          {/* 검색폼,버튼 */}
          <div className="flex gap-[8px] justify-start pb-[30px]">
            <BrandTag>전체</BrandTag>
            <GrayTag>한식</GrayTag>
            <GrayTag>중식</GrayTag>
            <GrayTag>일식</GrayTag>
            <GrayTag>양식</GrayTag>
            <GrayTag>분식</GrayTag>
            <GrayTag>아시안</GrayTag>
            <GrayTag>인도</GrayTag>
            <GrayTag>멕시칸</GrayTag>
          </div>

          <div className="grid grid-cols-2 gap-[34px]">
            {[...Array(6)].map((_, index) => (
              <RowCard key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FavoritePage;
