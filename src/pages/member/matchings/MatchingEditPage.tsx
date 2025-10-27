import { RiAlarmWarningLine, RiMapPinLine } from 'react-icons/ri';
import { ButtonFillMd, ButtonLineMd } from '../../../ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ConfigProvider, DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import locale from 'antd/locale/ko_KR';
import MapSearchModal from '../../../components/member/MapSearchModal';
import { useKakaoLoader } from '../../../hooks/useKakaoLoader';
import { getMatchingById, updateMatching } from '../../../services/matchingService';
import { getRestaurantById } from '../../../services/restaurants';
import { supabase } from '../../../lib/supabase';
dayjs.locale('ko');

const headCounts = ['2', '3', '4', '5'];

interface SelectedPlace {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const MatchingEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const matchingId = parseInt(id || '0', 10);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 폼 데이터 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [desiredMembers, setDesiredMembers] = useState(2);
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [time, setTime] = useState<dayjs.Dayjs | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null);

  useKakaoLoader();

  // 기존 매칭 데이터 불러오기
  useEffect(() => {
    const fetchMatching = async () => {
      try {
        const matching = await getMatchingById(matchingId);
        console.log('매칭 데이터:', matching);

        // 기본값 설정
        setTitle(matching.title || '');
        setContent(matching.description || '');
        setDesiredMembers(matching.desired_members || 2);

        // 날짜 설정
        if (matching.met_at) {
          const metAt = dayjs(matching.met_at);
          setDate(metAt);
          setTime(metAt);
        }

        // 레스토랑 정보 불러오기
        if (matching.restaurant_id) {
          const restaurant = await getRestaurantById(matching.restaurant_id);
          if (restaurant) {
            setSelectedPlace({
              id: restaurant.id.toString(),
              name: restaurant.name,
              address: restaurant.address || '',
              lat: restaurant.latitude || 0,
              lng: restaurant.longitude || 0,
            });
          }
        }
      } catch (err) {
        console.error('매칭 데이터 불러오기 실패:', err);
        setError('매칭 정보를 불러오는데 실패했습니다.');
      }
    };

    if (matchingId) {
      fetchMatching();
    }
  }, [matchingId]);

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
      setIsLoading(true);
      setError('');

      // 유효성 검사
      if (!title.trim()) {
        setError('매칭 제목을 입력해주세요.');
        return;
      }
      if (!date) {
        setError('날짜를 선택해주세요.');
        return;
      }
      if (!time) {
        setError('시간을 선택해주세요.');
        return;
      }
      if (!selectedPlace) {
        setError('맛집을 선택해주세요.');
        return;
      }

      const { data: restaurant, error: restError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('kakao_place_id', selectedPlace.id)
        .single();

      // 날짜와 시간 합치기
      const metAt = date
        .hour(time.hour())
        .minute(time.minute())
        .second(0)
        .millisecond(0)
        .toISOString();

      const updateData = {
        title: title.trim(),
        description: content.trim(),
        desired_members: desiredMembers,
        met_at: metAt,
        restaurant_id: restaurant?.id,
      };
      console.log(parseInt(selectedPlace.id));

      await updateMatching(matchingId, updateData);
      navigate(`/member/matching/${matchingId}`);
    } catch (err) {
      console.error('매칭 수정 실패:', err);
      setError('매칭 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 선택된 인원 표시
  const memberMap: { [key: number]: string } = {
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  };
  const selectedHeadCounts = memberMap[desiredMembers] || '';

  return (
    <ConfigProvider locale={locale}>
      <div className="w-full max-w-[750px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
        {/* 헤더 */}
        <div className="flex flex-col gap-2.5 text-left">
          <p className="text-babgray-900 text-2xl sm:text-3xl font-bold">매칭 수정</p>
          <p className="text-babgray-600 text-sm sm:text-base">매칭 정보를 수정할 수 있습니다.</p>
        </div>

        {/* 폼 전체 */}
        <div className="flex flex-col text-babgray-800 p-5 sm:p-8 bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.02)] gap-8">
          {/* 제목 */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-1 items-center">
              <span>매칭 제목</span>
              <p className="text-bab">*</p>
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                maxLength={50}
                placeholder="매칭 게시글 제목을 입력해주세요"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="px-4 py-3.5 rounded-3xl border border-babgray focus:border-bab transition w-full"
              />
              <p className="flex justify-end text-babgray-500 text-xs">{title.length}/50</p>
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="flex flex-col gap-3.5">
            <p>상세 설명</p>
            <textarea
              maxLength={500}
              placeholder="함께 식사하고 싶은 이유나 추가 정보를 입력해주세요"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="h-28 sm:h-24 px-4 py-3.5 rounded-3xl border border-babgray resize-none focus:border-bab transition w-full"
            />
            <p className="flex justify-end text-babgray-500 text-xs">{content.length}/500</p>
          </div>

          {/* 날짜 / 시간 / 인원 */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch gap-5">
            {/* 날짜 */}
            <div className="flex-1 flex flex-col gap-3.5">
              <div className="flex gap-1 items-center">
                <span>날짜</span>
                <p className="text-bab">*</p>
              </div>
              <div className="rounded-3xl border border-babgray flex items-center">
                <DatePicker
                  placeholder="연도-월-일"
                  value={date}
                  onChange={setDate}
                  className="bab-date-picker w-full"
                />
              </div>
            </div>

            {/* 시간 */}
            <div className="flex-1 flex flex-col gap-3.5">
              <div className="flex gap-1 items-center">
                <span>시간</span>
                <p className="text-bab">*</p>
              </div>
              <div className="rounded-3xl border border-babgray flex items-center">
                <TimePicker
                  format="HH:mm"
                  placeholder="00:00"
                  value={time}
                  onChange={setTime}
                  className="bab-time-picker w-full"
                  classNames={{
                    popup: { root: 'bab-time-picker-panel' } as any,
                  }}
                />
              </div>
            </div>

            {/* 희망 인원 */}
            <div className="flex-1 flex flex-col gap-3.5">
              <div className="flex gap-1 items-center">
                <span>희망 인원수 (본인 포함)</span>
                <p className="text-bab">*</p>
              </div>
              <div className="flex justify-start gap-2 flex-wrap">
                {headCounts.map(item => {
                  const isSelected = selectedHeadCounts === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleMembers(item)}
                      className={`min-w-10 h-10 px-3 rounded-xl flex justify-center items-center text-base font-medium transition 
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
            <div className="flex gap-1 items-center">
              <span>맛집 선택</span>
              <span className="text-bab">*</span>
            </div>

            {selectedPlace ? (
              <div className="w-full p-4 rounded-3xl border-2 border-bab bg-bab-50 flex justify-between items-center flex-wrap gap-3">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-babgray-900">{selectedPlace.name}</p>
                  <p className="text-xs text-babgray-600">{selectedPlace.address}</p>
                </div>
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="text-bab hover:text-bab-600 transition font-medium"
                >
                  변경
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsMapModalOpen(true)}
                className="w-full h-40 sm:h-48 px-4 py-5 rounded-3xl border-dashed border-2 border-babgray flex flex-col justify-center items-center gap-4 hover:bg-babgray-50 transition"
              >
                <RiMapPinLine className="text-bab w-6 h-6" />
                <p className="text-babgray-600 text-sm sm:text-base">
                  지도에서 맛집을 선택해주세요
                </p>
              </button>
            )}
          </div>

          {/* 안내 문구 */}
          <div className="px-4 py-4 bg-bab-100 text-bab rounded-lg flex flex-col items-start gap-2.5">
            <div className="flex items-center gap-1.5">
              <RiAlarmWarningLine />
              <p className="font-medium">매칭 이용 안내</p>
            </div>
            <ul className="list-disc text-xs sm:text-sm gap-1 px-5 text-babgray-700">
              <li>실제 만남 시 안전을 위해 공공장소에서 만나주세요</li>
              <li>개인정보 보호를 위해 연락처는 매칭 후 공유해주세요</li>
              <li>노쇼나 갑작스러운 취소는 다른 이용자에게 피해가 됩니다</li>
              <li>매너있는 만남 문화를 만들어가요</li>
            </ul>
          </div>

          {/* 버튼 영역 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 border-t pt-6 justify-center">
            <ButtonLineMd
              className="flex-1"
              onClick={() => navigate(`/member/matching/${matchingId}`)}
              disabled={isLoading}
            >
              취소
            </ButtonLineMd>
            <ButtonFillMd className="flex-1" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? '수정 중...' : '수정하기'}
            </ButtonFillMd>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="px-3.5 py-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
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

export default MatchingEditPage;
