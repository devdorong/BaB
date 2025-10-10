import { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Database } from '../types/bobType';
import dayjs from 'dayjs';

type RestaurantStatus = Database['public']['Enums']['restaurant_status_enum'];

interface PartnerFormData {
  email: string;
  pw: string;
  nickname: string;
  name: string;
  phone: string;
  businessNumber: string;
  restaurantName: string;
  address: string;
  category: string;
  price: string;
  storeIntro: string;
  openTime: string | null;
  closeTime: string | null;
  closedDays: string[];
  businessFile: File | null;
  menuFile: File | null;
  storeFiles: File[];
  status: RestaurantStatus;
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
  const { user, signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormDataState] = useState<PartnerFormData>({
    email: '',
    pw: '',
    nickname: '',
    name: '',
    phone: '',
    businessNumber: '',
    restaurantName: '',
    address: '',
    category: '',
    price: '',
    storeIntro: '',
    openTime: null,
    closeTime: null,
    closedDays: [],
    businessFile: null,
    menuFile: null,
    storeFiles: [],
    status: 'draft',
  });

  const setFormData = (data: Partial<PartnerFormData>) =>
    setFormDataState(prev => ({ ...prev, ...data }));

  const saveDraft = async () => {
    try {
      setLoading(true);
      let currentUser = user;

      if (!currentUser) {
        const { error } = await signUp({
          email: formData.email,
          password: formData.pw,
          name: formData.name,
          nickName: formData.nickname,
          phone: formData.phone,
          gender: true,
          birth: dayjs().format('YYYY-MM-DD'),
        });

        if (error) throw new Error('회원가입 중 오류 발생');
        const { data } = await supabase.auth.getUser();
        currentUser = data.user;
      }

      if (!currentUser) throw new Error('유저 정보를 불러올 수 없습니다.');

      await supabase.from('restaurants').upsert([
        {
          profile_id: currentUser.id,
          name: formData.restaurantName,
          address: formData.address,
          phone: formData.phone,
          opentime: formData.openTime,
          closetime: formData.closeTime,
          closeday: formData.closedDays,
          storeintro: formData.storeIntro,
          business_number: formData.businessNumber,
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
      let currentUser = user;

      if (!currentUser) {
        const { error } = await signUp({
          email: formData.email,
          password: formData.pw,
          name: formData.name,
          nickName: formData.nickname,
          phone: formData.phone,
          gender: true,
          birth: dayjs().format('YYYY-MM-DD'),
        });

        if (error) throw new Error('회원가입 중 오류 발생');
        const { data } = await supabase.auth.getUser();
        currentUser = data.user;
      }

      if (!currentUser) throw new Error('유저 정보를 불러올 수 없습니다.');

      const { error: restaurantError } = await supabase.from('restaurants').upsert([
        {
          profile_id: currentUser.id,
          name: formData.restaurantName,
          address: formData.address,
          phone: formData.phone,
          opentime: formData.openTime,
          closetime: formData.closeTime,
          closeday: formData.closedDays,
          storeintro: formData.storeIntro,
          business_number: formData.businessNumber,
          status: 'pending',
        },
      ]);

      if (restaurantError) throw restaurantError;

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
      pw: '',
      nickname: '',
      name: '',
      phone: '',
      businessNumber: '',
      restaurantName: '',
      address: '',
      category: '',
      price: '',
      storeIntro: '',
      openTime: null,
      closeTime: null,
      closedDays: [],
      businessFile: null,
      menuFile: null,
      storeFiles: [],
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
