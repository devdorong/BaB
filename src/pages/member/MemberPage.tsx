import { useEffect, useState } from 'react';
import Banner from '../../components/member/Banner';
import MachingIndex from '../../components/member/MachingIndex';
import PostList from '../../ui/dorong/TestCode';

function MemberPage() {
  //ts
  // const [isMapLoaded, setIsMaploaded] = useState(false);
  // useEffect(() => {
  //   const kakaoMapScript = document.createElement('script');
  //   kakaoMapScript.async = true;
  //   kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.VITE_KKO_MAP_JS_API_KEY}&autoload=false&libraries=services,clusterer`;
  // }, []);

  //tsx
  return (
    <div className="min-h-[1000px]">
      {/* 배너 */}
      <div>
        <Banner />
      </div>
      {/* 매칭대기중 */}
      <div>
        <MachingIndex />
      </div>
      {/* 내주변 맛집 */}
      <div>
        <PostList />
      </div>
      {/* 최근 올라온 리뷰 */}
      <div></div>
    </div>
  );
}

export default MemberPage;
