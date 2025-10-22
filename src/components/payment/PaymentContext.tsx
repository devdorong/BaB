import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export interface PaymentMethod {
  id: number;
  brand: string;
  number: string;
  is_default: boolean;
  description?: string;
  expire?: string;
}

interface PaymentContextType {
  paymentMethods: PaymentMethod[];
  defaultMethod: PaymentMethod | null;
  setDefaultMethod: (method: PaymentMethod) => Promise<void>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>;
  removePaymentMethod: (id: number) => Promise<void>;
  reloadPayments: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // 사용자별 결제수단 불러오기
  const fetchPaymentMethods = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('profile_id', user.id)
      .order('is_default', { ascending: false });

    if (error) {
      console.error('결제수단 불러오기 실패:', error.message);
    } else {
      setPaymentMethods(data || []);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [user]);

  const defaultMethod = paymentMethods.find(m => m.is_default) ?? null;

  // 기본 결제수단 변경
  const setDefaultMethod = async (method: PaymentMethod) => {
    if (!user) return;
    const updates = paymentMethods.map(m => ({
      ...m,
      is_default: m.id === method.id,
    }));
    setPaymentMethods(updates);

    await supabase.from('payment_methods').update({ is_default: false }).eq('profile_id', user.id);
    await supabase.from('payment_methods').update({ is_default: true }).eq('id', method.id);
  };

  // 결제수단 추가
  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>) => {
    if (!user) return;
    const { error } = await supabase.from('payment_methods').insert({
      ...method,
      profile_id: user.id,
    });
    if (error) console.error('결제수단 추가 실패:', error.message);
    await fetchPaymentMethods();
  };

  // 결제수단 삭제
  const removePaymentMethod = async (id: number) => {
    const { error } = await supabase.from('payment_methods').delete().eq('id', id);
    if (error) console.error('결제수단 삭제 실패:', error.message);
    await fetchPaymentMethods();
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentMethods,
        defaultMethod,
        setDefaultMethod,
        addPaymentMethod,
        removePaymentMethod,
        reloadPayments: fetchPaymentMethods,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error('usePayment은 PaymentProvider 안에서만 사용해야 합니다.');
  return context;
};
