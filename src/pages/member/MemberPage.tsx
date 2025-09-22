import KkoMap from '../../components/member/KkoMap';
import MachingIndex from '../../components/member/MachingIndex';
import MainBanner from '../../components/member/MainBanner';
import { useKakaoLoader } from '../../hooks/useKakaoLoader';

function MemberPage() {
  //ts
  const isMapLoaded = useKakaoLoader();
  //tsx
  return (
    <div className="min-h-[2000px] max-w-[1280px] mx-auto">
      {/* 배너 */}
      <div>
        <MainBanner />
      </div>
      {/* 매칭대기중 */}
      <div>
        <MachingIndex />
      </div>
      {/* 내주변 맛집 */}
      <div>
        {isMapLoaded ? (
          <KkoMap />
        ) : (
          <div className="py-10 text-center text-babgray-600">지도를 불러오는 중입니다...</div>
        )}
      </div>
      {/* 최근 올라온 리뷰 */}
      <div></div>
    </div>
  );
}

export default MemberPage;
