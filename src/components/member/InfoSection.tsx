import { RiMapPinLine, RiPhoneLine, RiTimeLine } from 'react-icons/ri';
import { useKakaoLoader } from '../../hooks/useKakaoLoader';
import KkoMapDetail from '../../ui/jy/Kakaomapdummy';

function InfoSection() {
  const isMapLoaded = useKakaoLoader();

  return (
    <section className="mt-10">
      <div
        className="bg-white rounded-2xl border border-black/5
                      shadow-[0_4px_4px_rgba(0,0,0,0.02)] p-[30px]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <div className="flex flex-col gap-[15px]">
            <h3 className="text-[18px] font-semibold text-babgray-900 mb-3">기본 정보</h3>
            <ul className="space-y-3 text-babgray-800">
              <li className="flex items-start gap-2">
                <RiPhoneLine className="mt-0.5 text-[18px] text-babgray-500" />
                <span className="text-[16px]">02-1234-5678</span>
              </li>
              <li className="flex items-start gap-2">
                <RiTimeLine className="mt-0.5 text-[18px] text-babgray-500" />
                <span className="text-[16px]">매일 11:00 - 22:00</span>
              </li>
              <li className="flex items-start gap-2">
                <RiMapPinLine className="mt-0.5 text-[18px] text-babgray-500" />
                <span className="text-[16px]">강남구 청담동</span>
              </li>
            </ul>
          </div>

          {/* 지도 */}
          <div>
            <h3 className="text-[18px] font-semibold text-babgray-900 mb-3">지도</h3>
            {isMapLoaded ? (
              <KkoMapDetail />
            ) : (
              <div className="py-10 text-center text-babgray-600 max-w-[1280px] mx-auto">
                지도를 불러오는 중입니다...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
