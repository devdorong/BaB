import { RiAlarmWarningLine, RiCalendarLine, RiMapPinLine, RiCloseLine } from 'react-icons/ri';
import { ButtonFillMd, ButtonLineMd } from '../../../ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ConfigProvider, DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import locale from 'antd/locale/ko_KR';
import MapSearchModal from '../../../components/member/MapSearchModal';
import { useKakaoLoader } from '../../../hooks/useKakaoLoader';
import { useMatching } from '../../../contexts/MatchingContext';
dayjs.locale('ko');

const headCounts = ['2', '3', '4', '5'];

interface SelectedPlace {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const MatchingWritePage = () => {
  const navigate = useNavigate();
  const {
    formData,
    setTitle,
    setContent,
    setDesiredMembers,
    setDate,
    setTime,
    setSelectedPlace,
    submitMatching,
    isLoading,
    error,
  } = useMatching();

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const toggleMembers = (headCount: string) => {
    const memberMap: { [key: string]: number } = {
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
    };
    setDesiredMembers(memberMap[headCount]);
  };

  const handlePlaceSelect = (place: SelectedPlace) => {
    setSelectedPlace(place);
    setIsMapModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const matchingId = await submitMatching();
      navigate(`/member/matching/${matchingId}`);
    } catch (err) {
      console.error('매칭 등록 실패:', err);
    }
  };

  useKakaoLoader();

  // 선택된 인원 표시
  const memberMap: { [key: number]: string } = {
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  };
  const selectedHeadCounts = memberMap[formData.desiredMembers] || '';

  // useEffect(() => {
  //   console.log(formData.selectedPlace);
  // }, [formData]);

  return (
    <ConfigProvider locale={locale}>
      <div className="w-full max-w-[750px] mx-auto px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-10">
        {/* 헤더 */}
        <div className="flex flex-col gap-2.5 sm:text-left">
          <p className="text-2xl sm:text-3xl font-bold text-babgray-900">매칭 등록</p>
          <p className="text-babgray-600 text-sm sm:text-base">함께 식사할 친구를 찾아보세요.</p>
        </div>

        {/* 입력 폼 */}
        <div className="flex flex-col text-babgray-800 p-6 sm:p-8 bg-white rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)] gap-8">
          {/* 제목 */}
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
                value={formData.title}
                onChange={e => setTitle(e.target.value)}
                className="px-4 py-3.5 rounded-3xl border border-babgray focus:border-bab text-sm sm:text-base"
              />
              <p className="flex justify-end text-babgray-500 text-xs">
                {formData.title.length}/50
              </p>
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="flex flex-col gap-3.5">
            <p>상세 설명</p>
            <textarea
              maxLength={500}
              placeholder="함께 식사하고 싶은 이유나 추가 정보를 입력해주세요"
              value={formData.content}
              onChange={e => setContent(e.target.value)}
              className="h-28 sm:h-32 px-4 py-3.5 rounded-3xl border border-babgray resize-none focus:border-bab text-sm sm:text-base"
            />
            <p className="flex justify-end text-babgray-500 text-xs">
              {formData.content.length}/500
            </p>
          </div>

          {/* 날짜, 시간, 인원 */}
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            {/* 날짜 */}
            <div className="flex-1 flex flex-col gap-3.5">
              <div className="flex gap-1">
                <span>날짜</span>
                <p className="text-bab">*</p>
              </div>
              <div className="w-full flex items-center rounded-3xl ">
                <DatePicker
                  className="bab-date-picker w-full"
                  placeholder="연도-월-일"
                  value={formData.date}
                  onChange={setDate}
                  disabledDate={current => current && current < dayjs().startOf('day')}
                />
              </div>
            </div>

            {/* 시간 */}
            <div className="flex-1 flex flex-col gap-3.5">
              <div className="flex gap-1">
                <span>시간</span>
                <p className="text-bab">*</p>
              </div>
              <div className="w-full flex items-center rounded-3xl ">
                <TimePicker
                  className="bab-time-picker w-full"
                  format="HH:mm"
                  placeholder="시간 선택"
                  value={formData.time}
                  onChange={setTime}
                  classNames={{
                    popup: { root: 'bab-time-picker-panel' } as any,
                  }}
                  disabledTime={() => {
                    if (formData.date && dayjs(formData.date).isSame(dayjs(), 'day')) {
                      const now = dayjs();
                      const limit = now.add(30, 'minute');
                      const limitHour = limit.hour();
                      const limitMinute = limit.minute();

                      return {
                        disabledHours: () => Array.from({ length: limitHour }, (_, i) => i),
                        disabledMinutes: (hour: number) =>
                          hour === limitHour
                            ? Array.from({ length: limitMinute }, (_, i) => i)
                            : [],
                      };
                    }
                    return {};
                  }}
                />
              </div>
            </div>

            {/* 인원 */}
            <div className="flex-1 flex flex-col gap-3.5">
              <div className="flex gap-1">
                <span>희망 인원수 (본인 포함)</span>
                <p className="text-bab">*</p>
              </div>
              <div className="flex flex-wrap justify-start gap-2 sm:gap-2">
                {headCounts.map(item => {
                  const isSelected = selectedHeadCounts === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleMembers(item)}
                      className={`min-w-[40px] h-10 px-3 rounded-xl flex justify-center items-center text-sm sm:text-base font-medium transition 
                    ${
                      isSelected
                        ? 'bg-bab text-white border border-bab'
                        : 'border border-babgray-300 text-babgray-800 hover:bg-babgray-100'
                    }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 맛집 선택 */}
          <div className="flex flex-col items-start gap-3.5">
            <div className="flex gap-1">
              <span>맛집 선택</span>
              <span className="text-bab">*</span>
            </div>

            {formData.selectedPlace ? (
              <div className="w-full p-4 rounded-3xl border-2 border-bab bg-bab-50 flex justify-between items-center flex-wrap gap-3">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-babgray-900">{formData.selectedPlace.name}</p>
                  <p className="text-xs text-babgray-600">{formData.selectedPlace.address}</p>
                </div>
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="text-bab hover:text-bab-600 transition text-sm"
                >
                  변경
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsMapModalOpen(true)}
                className="w-full h-44 px-4 py-5 rounded-3xl border-dashed border-2 border-babgray flex flex-col justify-center items-center gap-4 hover:bg-babgray-50 transition text-sm sm:text-base"
              >
                <RiMapPinLine className="text-bab w-6 h-6" />
                <p className="text-babgray-600">지도에서 맛집을 선택해주세요</p>
              </button>
            )}
          </div>

          {/* 이용 안내 */}
          <div className="px-4 py-4 bg-bab-100 text-bab rounded-lg flex flex-col items-start gap-2.5 text-sm">
            <div className="flex items-center gap-1.5 font-medium">
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
          <div className="flex flex-col sm:flex-row pt-6 border-t justify-center items-center gap-3 sm:gap-6">
            <ButtonLineMd
              className="w-full sm:flex-1"
              onClick={() => navigate('/member')}
              disabled={isLoading}
            >
              취소
            </ButtonLineMd>
            <ButtonFillMd className="w-full sm:flex-1" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? '등록 중...' : '등록하기'}
            </ButtonFillMd>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="px-3.5 py-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
          )}
        </div>

        {/* 지도 모달 */}
        <MapSearchModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          onSelectPlace={handlePlaceSelect}
        />
      </div>
    </ConfigProvider>
  );
};

export default MatchingWritePage;
