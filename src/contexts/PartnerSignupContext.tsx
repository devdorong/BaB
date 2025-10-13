import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Dayjs } from 'dayjs';
import { useAuth } from './AuthContext';
import type { Database, Profile } from '../types/bobType';
import dayjs from 'dayjs';
import { getProfile } from '../lib/propile';

const toTime = (t: any) => {
  if (!t) return null;
  try {
    const d = dayjs(t);
    return d.format('HH:mm:ss');
  } catch {
    return null;
  }
};

type RestaurantStatus = Database['public']['Enums']['restaurant_status_enum'];

interface PartnerFormData {
  email: string;
  nickname: string;
  name: string;
  phone: string;
  businessNumber: string;
  restaurantName: string;
  address: string;
  category: string;

  storeIntro: string;
  openTime: Dayjs | null;
  closeTime: Dayjs | null;
  closedDays: string[];
  businessFile: File | null;
  menuFile: File | null;
  storeFiles: File[];
  status: RestaurantStatus;
  latitude?: number | null;
  longitude?: number | null;
}

interface PartnerSignupContextType {
  formData: PartnerFormData;
  setFormData: (data: Partial<PartnerFormData>) => void;
  saveDraft: () => Promise<void>;
  submitApplication: () => Promise<void>;
  resetForm: () => void;
  loading: boolean;
}

const PartnerSignupContext = createContext<PartnerSignupContextType | null>(null);

interface PartnerSignupProviderProps {
  children: React.ReactNode;
}

export function PartnerSignupProvider({ children }: PartnerSignupProviderProps) {
  const { user } = useAuth();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  // 사용자 프로필
  const [profileData, setProfileData] = useState<Profile | null>(null);
  // 에러메세지
  const [error, setError] = useState<string>('');

  // 사용자 프로필 정보
  const loadProfile = async () => {
    if (!user?.id) {
      setError('사용자정보 없음');
      setLoading(false);
      return;
    }
    try {
      // 사용자 정보 가져오기
      const tempData = await getProfile(user?.id);
      if (!tempData) {
        // null의 경우
        setError('사용자 프로필 정보 찾을 수 없음');
        return;
      }
      // 사용자 정보 유효함
      setNickname(tempData.nickname || '');
      setProfileData(tempData);
    } catch (error) {
      setError('프로필 호출 오류');
    } finally {
      setLoading(false);
    }
  };

  // id로 닉네임을 받아옴
  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const [formData, setFormDataState] = useState<PartnerFormData>({
    email: '',
    nickname: '',
    name: '',
    phone: '',
    businessNumber: '',
    restaurantName: '',
    address: '',
    category: '',

    storeIntro: '',
    openTime: null,
    closeTime: null,
    closedDays: [],
    businessFile: null,
    menuFile: null,
    storeFiles: [],
    status: 'draft',
    latitude: null,
    longitude: null,
  });

  const setFormData = (data: Partial<PartnerFormData>) =>
    setFormDataState(prev => ({ ...prev, ...data }));

  const saveDraft = async () => {
    try {
      setLoading(true);
      if (!user) {
        alert('로그인 후 이용 가능합니다.');
        return;
      }

      await supabase.from('restaurants').upsert([
        {
          profile_id: user.id,
          name: formData.restaurantName,
          address: formData.address,
          phone: formData.phone,
          opentime: toTime(formData.openTime),
          closetime: toTime(formData.closeTime),
          closeday: formData.closedDays,
          storeintro: formData.storeIntro,
          business_number: formData.businessNumber,
          latitude: formData.latitude,
          longitude: formData.longitude,
          status: 'draft',
        },
      ]);

      alert('임시저장 되었습니다.');
    } catch (err) {
      console.error(err);
      alert(`임시저장 중 오류가 발생했습니다 : ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async () => {
    try {
      setLoading(true);
      if (!user) {
        alert('로그인 후 이용 가능합니다.');
        return;
      }

      const { error } = await supabase.from('restaurants').upsert([
        {
          profile_id: user.id,
          name: formData.restaurantName,
          address: formData.address,
          phone: formData.phone,
          opentime: toTime(formData.openTime),
          closetime: toTime(formData.closeTime),
          closeday: formData.closedDays,
          storeintro: formData.storeIntro,
          business_number: formData.businessNumber,
          latitude: formData.latitude,
          longitude: formData.longitude,
          status: 'pending', // 신청 완료 상태
        },
      ]);

      if (error) throw error;

      // 프로필 업데이트 (role 을 patner 로)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'partner' })
        .eq('id', profileData?.id);

      if (updateError) {
        console.error(updateError);
        alert('프로필 업데이트 중 오류가 발생했습니다.');
        return;
      }

      alert('신청이 완료되었습니다! 승인 후 연락드리겠습니다.');
    } catch (err) {
      console.error(err);
      alert(`신청 중 오류가 발생했습니다. : ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormDataState({
      email: '',
      nickname: '',
      name: '',
      phone: '',
      businessNumber: '',
      restaurantName: '',
      address: '',
      category: '',

      storeIntro: '',
      openTime: null,
      closeTime: null,
      closedDays: [],
      businessFile: null,
      menuFile: null,
      storeFiles: [],
      latitude: null,
      longitude: null,
      status: 'draft',
    });
  };

  return (
    <PartnerSignupContext.Provider
      value={{
        formData,
        setFormData,
        saveDraft,
        submitApplication,
        resetForm,
        loading,
      }}
    >
      {children}
    </PartnerSignupContext.Provider>
  );
}

export const usePartnerSignup = () => {
  const ctx = useContext(PartnerSignupContext);
  if (!ctx) throw new Error('파트너 회원가입 컨텍스트 없어용');
  return ctx;
};
