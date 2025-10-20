import { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { addMatchingParticipant } from '../services/matchingService';
import dayjs from 'dayjs';

interface SelectedPlace {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface MatchingFormData {
  title: string;
  content: string;
  desiredMembers: number;
  date: dayjs.Dayjs | null;
  time: dayjs.Dayjs | null;
  selectedPlace: SelectedPlace | null;
}

interface MatchingContextType {
  formData: MatchingFormData;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setDesiredMembers: (members: number) => void;
  setDate: (date: dayjs.Dayjs | null) => void;
  setTime: (time: dayjs.Dayjs | null) => void;
  setSelectedPlace: (place: SelectedPlace | null) => void;
  submitMatching: () => Promise<number>;
  resetForm: () => void;
  isLoading: boolean;
  error: string | null;
}

const MatchingContext = createContext<MatchingContextType | undefined>(undefined);

interface MatchingProviderProps {
  children: React.ReactNode;
}

export const MatchingProvider = ({ children }: MatchingProviderProps) => {
  const [formData, setFormData] = useState<MatchingFormData>({
    title: '',
    content: '',
    desiredMembers: 2,
    date: null,
    time: null,
    selectedPlace: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setTitle = useCallback((title: string) => {
    setFormData(prev => ({ ...prev, title }));
  }, []);

  const setContent = useCallback((content: string) => {
    setFormData(prev => ({ ...prev, content }));
  }, []);

  const setDesiredMembers = useCallback((members: number) => {
    setFormData(prev => ({ ...prev, desiredMembers: members }));
  }, []);

  const setDate = useCallback((date: dayjs.Dayjs | null) => {
    setFormData(prev => ({ ...prev, date }));
  }, []);

  const setTime = useCallback((time: dayjs.Dayjs | null) => {
    setFormData(prev => ({ ...prev, time }));
  }, []);

  const setSelectedPlace = useCallback((place: SelectedPlace | null) => {
    setFormData(prev => ({ ...prev, selectedPlace: place }));
  }, []);

  const submitMatching = useCallback(async (): Promise<number> => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. 유효성 검사
      if (!formData.title.trim()) {
        throw new Error('제목을 입력해주세요');
      }
      if (!formData.date || !formData.time) {
        throw new Error('날짜와 시간을 선택해주세요');
      }
      if (!formData.selectedPlace) {
        throw new Error('맛집을 선택해주세요');
      }
      if (formData.desiredMembers < 2 || formData.desiredMembers > 8) {
        throw new Error('희망 인원은 2명 이상 8명 이하여야 합니다');
      }

      // 2. 현재 사용자 정보 조회
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('사용자 정보를 찾을 수 없습니다');
      }

      // 3. 레스토랑 정보 확인 (kakao_place_id로 조회)
      let restaurantId: number;
      const { data: existingRestaurant, error: restaurantCheckError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('kakao_place_id', formData.selectedPlace.id)
        .maybeSingle();

      if (restaurantCheckError) {
        console.error('레스토랑 조회 에러:', restaurantCheckError);
      }

      if (existingRestaurant) {
        restaurantId = existingRestaurant.id;
      } else {
        // 시연용: 레스토랑이 없으면 목업 ID 사용 (1번 레스토랑이 존재한다고 가정 우리의 경우 제일 상위레스토랑이 8번 샐러디)
        // 실제 운영 시: 새 레스토랑 생성 로직 추가 필요
        restaurantId = 8;
        console.warn(`레스토랑 미등재: "${formData.selectedPlace.name}" - 목업 ID 사용`);
      }

      // 4. 매칭 생성
      const metAt = formData.date
        .hour(formData.time.hour())
        .minute(formData.time.minute())
        .toISOString();

      const { data: newMatching, error: matchingError } = await supabase
        .from('matchings')
        .insert({
          host_profile_id: user.id,
          restaurant_id: restaurantId,
          type: 'post',
          status: 'waiting',
          description: formData.content,
          desired_members: formData.desiredMembers,
          met_at: metAt,
          title: formData.title,
        })
        .select('id')
        .single();

      if (matchingError) {
        throw new Error(`매칭 생성 실패: ${matchingError.message}`);
      }

      const matchingId = newMatching!.id;

      // 5. Host를 자동으로 참가자에 추가
      try {
        await addMatchingParticipant(matchingId, user.id);
      } catch (participantError) {
        console.error('참가자 추가 실패:', participantError);
        // 참가자 추가 실패해도 매칭은 생성됨
      }

      setIsLoading(false);
      return matchingId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '매칭 등록에 실패했습니다';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      content: '',
      desiredMembers: 2,
      date: null,
      time: null,
      selectedPlace: null,
    });
    setError(null);
  }, []);

  return (
    <MatchingContext.Provider
      value={{
        formData,
        setTitle,
        setContent,
        setDesiredMembers,
        setDate,
        setTime,
        setSelectedPlace,
        submitMatching,
        resetForm,
        isLoading,
        error,
      }}
    >
      {children}
    </MatchingContext.Provider>
  );
};

export const useMatching = () => {
  const ctx = useContext(MatchingContext);
  if (!ctx) {
    throw new Error('useMatching 컨텍스트 없어요');
  }
  return ctx;
};
