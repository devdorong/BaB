import MemberIntroModal from '@/components/member/MemberIntroModal';
import KkoMap from '../../components/member/KkoMap';
import MachingIndex from '../../components/member/MachingIndex';
import MainBanner from '../../components/member/MainBanner';
import MainReview from '../../components/member/MainReview';
import { useKakaoLoader } from '../../hooks/useKakaoLoader';

function MemberPage() {
  const isMapLoaded = useKakaoLoader();

  return (
    <>
      <MemberIntroModal />
      <div className="flex flex-col items-center bg-gray-50">
        {/* 배너 */}
        <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-0 max-w-[1280px]">
          <MainBanner />
        </section>

        {/* 매칭 대기중 */}
        <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-0 max-w-[1280px] mt-10 md:mt-14">
          <MachingIndex />
        </section>

        {/* 내 주변 맛집 지도 */}
        <section className="w-full bg-white">
          {isMapLoaded ? (
            <KkoMap />
          ) : (
            <div className="py-10 text-center text-babgray-600 px-4 sm:px-0">
              지도를 불러오는 중입니다...
            </div>
          )}
        </section>

        {/* 최근 올라온 리뷰 */}
        <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-0 max-w-[1280px] py-12 sm:py-16 md:py-20">
          <MainReview />
        </section>
      </div>
    </>
  );
}

export default MemberPage;
