import {
  RiCalculatorLine,
  RiCalendar2Line,
  RiCalendarLine,
  RiMapPinLine,
  RiPhoneLine,
  RiTimeLine,
} from 'react-icons/ri';
import { useKakaoLoader } from '../../hooks/useKakaoLoader';
import KkoMapDetail from '../../ui/jy/Kakaomapdummy';

interface InfoSectionProps {
  restPhone?: string;
  restAddress?: string;
  opentime?: string | null;
  closetime?: string | null;
  closeday?: string[] | null;
  lat?: string | null;
  lng?: string | null;
}

function InfoSection({
  restPhone,
  restAddress,
  opentime,
  closetime,
  closeday,
  lat,
  lng,
}: InfoSectionProps) {
  const isMapLoaded = useKakaoLoader();

  return (
    <section className="mt-5 lg:mt-10">
      <div
        className="bg-white rounded-2xl border border-black/5
                      shadow-[0_4px_4px_rgba(0,0,0,0.02)] p-[30px]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <div className="flex flex-col gap-[15px]">
            <h3 className="text-[18px] font-semibold text-babgray-900 mb-3">기본 정보</h3>
            <ul className="flex flex-col space-y-3 justify-center text-babgray-800">
              <li className="flex items-start gap-2">
                <RiPhoneLine className="mt-[5px] text-[18px] text-babgray-500" />
                <span className="text-[16px]">{restPhone}</span>
              </li>
              <li className="flex items-start gap-2">
                <RiTimeLine className="mt-[3px] text-[18px] text-babgray-500" />
                <span className="text-[16px]">
                  매일 {opentime} - {closetime}
                </span>
                <span>
                  {Array.isArray(closeday) &&
                    closeday.length > 0 &&
                    `(${closeday.map(day => `${day}요일`).join(', ')} 휴무)`}
                </span>
              </li>

              <li className="flex items-start gap-2">
                <RiMapPinLine className="mt-[3px] text-[18px] text-babgray-500" />
                <span className="text-[16px]">주소 {restAddress}</span>
              </li>
            </ul>
          </div>

          {/* 지도 */}
          <div>
            <h3 className="pt-5 lg:pt-0 text-[18px] font-semibold text-babgray-900 mb-3">지도</h3>
            {isMapLoaded ? (
              <KkoMapDetail  lat={lat} lng={lng} />
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
