import KkoMap from '../../components/member/KkoMap';
import MachingIndex from '../../components/member/MachingIndex';
import MainBanner from '../../components/member/MainBanner';
import MainReview from '../../components/member/MainReview';
import { useKakaoLoader } from '../../hooks/useKakaoLoader';

function MemberPage() {
  //ts
  const isMapLoaded = useKakaoLoader();
  //tsx
  return (
    <div className="min-h-[2000px] ">
      {/* 배너 */}
      <div className="max-w-[1280px] mx-auto">
        <MainBanner />
      </div>
      {/* 매칭대기중 */}
      <div className="max-w-[1280px] mx-auto">
        <MachingIndex />
      </div>
      {/* 내주변 맛집 */}
      <div className=" bg-white">
        {isMapLoaded ? (
          <KkoMap />
        ) : (
          <div className="py-10 text-center text-babgray-600 max-w-[1280px] mx-auto">
            지도를 불러오는 중입니다...
          </div>
        )}
      </div>
      {/* 최근 올라온 리뷰 */}
      <div className="max-w-[1280px] mx-auto py-[60px]">
        <MainReview />
      </div>
    </div>
  );
}

export default MemberPage;
