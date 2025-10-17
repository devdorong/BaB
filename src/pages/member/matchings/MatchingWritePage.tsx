import { RiAlarmWarningLine, RiCalendarLine, RiMapPinLine, RiCloseLine } from 'react-icons/ri';
import { ButtonFillMd, ButtonLineMd } from '../../../ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ConfigProvider, DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import locale from 'antd/locale/ko_KR';
import MapSearchModal from '../../../components/member/MapSearchModal';
import { useKakaoLoader } from '../../../hooks/useKakaoLoader';
dayjs.locale('ko');

const days = ['2', '3', '4', '5 이상'];

interface SelectedPlace {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const MatchingWritePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectDay, setSelectDay] = useState<string>('');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null);

  const toggleDay = (day: string) => {
    setSelectDay(day);
  };

  const handlePlaceSelect = (place: SelectedPlace) => {
    setSelectedPlace(place);
    setIsMapModalOpen(false);
  };
  useKakaoLoader();

  return (
    <ConfigProvider locale={locale}>
      <div className="w-[750px] h-auto py-8 flex flex-col gap-10 mx-auto">
        <div className="flex flex-col gap-2.5">
          <p className="text-babgray-900 text-3xl font-bold">매칭 등록</p>
          <p className="text-babgray-600">함께 식사할 친구를 찾아보세요.</p>
        </div>

        <div className="flex flex-col text-babgray-800 p-8 bg-white rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex gap-1">
              <span>매칭 제목</span>
              <p className="text-bab">*</p>
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                maxLength={50}
                placeholder="매칭 게시글 제목을 입력해주세요"
                onChange={e => setTitle(e.target.value)}
                className="px-4 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray focus:outline-bab"
              />
              <p className="flex justify-end text-babgray-500 text-xs">{title.length}/50</p>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <p>상세 설명</p>
            <textarea
              maxLength={500}
              placeholder="함께 식사하고 싶은 이유나 추가 정보를 입력해주세요"
              onChange={e => setContent(e.target.value)}
              className="h-24 px-4 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray resize-none focus:outline-bab"
            />
            <p className="flex justify-end text-babgray-500 text-xs">{content.length}/500</p>
          </div>

          <div className="flex justify-between items-center gap-3.5">
            <div className="w-1/3 flex flex-col gap-3.5">
              <div className="flex gap-1">
                <span>날짜</span>
                <p className="text-bab">*</p>
              </div>
              <div className="w flex items-center justify-between rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray">
                <DatePicker placeholder="연도-월-일" className="custom-day-picker w-full" />
              </div>
            </div>

            <div className="flex flex-col gap-3.5 w-1/3">
              <div className=" flex gap-1">
                <span>시간</span>
                <p className="text-bab">*</p>
              </div>
              <div className=" flex items-center justify-between rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray">
                <TimePicker
                  format="HH:mm"
                  placeholder="00:00"
                  className="custom-bab-time-picker w-full"
                  classNames={{
                    popup: { root: 'custom-bab-time-picker-panel' } as any,
                  }}
                />
              </div>
            </div>

            <div className="w-1/3 flex flex-col items-start gap-4">
              <div className=" flex gap-1">
                <span>희망 인원수 (본인 포함)</span>
                <p className="text-bab">*</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-center gap-3">
                  {days.map(day => {
                    const isSelected = selectDay.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`min-w-10 h-10 px-2 rounded-xl flex justify-center items-center text-base font-medium transition 
                  ${
                    isSelected
                      ? 'bg-bab text-white border border-bab'
                      : 'border border-babgray-300 text-babgray-800 hover:bg-babgray-100'
                  }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 맛집 선택 */}
          <div className="flex flex-col items-start gap-3.5">
            <div className="flex gap-1">
              <span>맛집 선택</span>
              <span className="text-bab">*</span>
            </div>

            {selectedPlace ? (
              <div className="w-full p-4 rounded-3xl border-2 border-bab bg-bab-50 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-babgray-900">{selectedPlace.name}</p>
                  <p className="text-xs text-babgray-600">{selectedPlace.address}</p>
                </div>
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="text-bab hover:text-bab-600 transition"
                >
                  변경
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsMapModalOpen(true)}
                className="w-full h-48 px-4 py-5 rounded-3xl outline-dashed outline-2 outline-offset-[-1px] outline-babgray flex flex-col justify-center items-center gap-4 hover:bg-babgray-50 transition"
              >
                <RiMapPinLine className="text-bab w-6 h-6" />
                <p className="text-babgray-600">지도에서 맛집을 선택해주세요</p>
              </button>
            )}
          </div>

          {/* 매칭 이용 안내 */}
          <div className="px-3.5 py-4 bg-bab-100 text-bab rounded-lg flex flex-col items-start gap-2.5">
            <div className="flex items-center gap-1.5">
              <RiAlarmWarningLine />
              <p>매칭 이용 안내</p>
            </div>
            <ul className="flex flex-col list-disc text-xs gap-1 px-6">
              <li>실제 만남 시 안전을 위해 공공장소에서 만나주세요</li>
              <li>개인정보 보호를 위해 연락처는 매칭 후 공유해주세요</li>
              <li>노쇼나 갑작스러운 취소는 다른 이용자에게 피해가 됩니다</li>
              <li>매너있는 만남 문화를 만들어가요</li>
            </ul>
          </div>

          {/* 버튼 영역 */}
          <div className="flex p-6 border-t justify-center items-center gap-6">
            <ButtonLineMd className="flex-1" onClick={() => navigate('/member')}>
              취소
            </ButtonLineMd>
            <ButtonFillMd className="flex-1" onClick={() => navigate('/member/matching/detail')}>
              등록하기
            </ButtonFillMd>
          </div>
        </div>
      </div>

      {/* 지도 모달 */}
      <MapSearchModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectPlace={handlePlaceSelect}
      />
    </ConfigProvider>
  );
};

export default MatchingWritePage;
