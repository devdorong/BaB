import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RiCoupon2Line } from 'react-icons/ri';
import { supabase } from '../../lib/supabase';
import type { Coupon, Database } from '../../types/bobType';
import { getProfile } from '../../lib/propile';

interface ProfileCoupon {
  id: number;
  profile_id: string;
  coupon_id: number;
  is_used: boolean;
  issued_at: string;
  expires_at: string;
  coupons: Coupon[];
}

const CouponPage = () => {
  const { user } = useAuth();

  const [coupons, setCoupons] = useState<ProfileCoupon[]>([]);
  // 로딩
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const couponSave = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('profile_coupons')
          .select(
            `id, profile_id, coupon_id, is_used, issued_at, expires_at, coupons( id, name, description, discount_amount, required_points )`,
          )
          .eq('profile_id', user.id)
          .order('expires_at', { ascending: false });
        if (error) throw error;

        // conpons를 무조건 배열로 변환 (객체로 받을때도 존재함)
        const normalized = (data || []).map((item: any) => ({
          ...item,
          coupons: Array.isArray(item.coupons) ? item.coupons : [item.coupons],
        }));

        // 유효기한 만료된 쿠폰 제거 (나중에 Supabase에서도 제거가능하도록 변경해보기)
        const filtered = normalized.filter(item => new Date(item.expires_at) > new Date());

        setCoupons(filtered as ProfileCoupon[]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    couponSave();
  }, [user?.id]);

  return (
    <div className="flex flex-col justify-center items-self">
      <div className="text-babgray-900 text-[18px] font-bold pb-[25px]">
        <div>쿠폰함</div>
      </div>
      <div className="flex">
        <div className="grid grid-cols-3 gap-[20px] w-full">
          {coupons.map(item =>
            item.coupons.map(coupon => (
              <div
                key={`${item.id}-${coupon.id}`}
                className="flex flex-col gap-[14px] p-[17px] justify-center items-self rounded-[12px] border border-bab-300 bg-bab-100"
              >
                <div className="flex items-center justify-between">
                  <div className="bg-bab-200 p-[12px] items-center rounded-[8px]">
                    <RiCoupon2Line className="w-[16px] h-[16px] text-bab-500" />
                  </div>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <div className="text-babgray-900">{coupon.name}</div>
                  <div className="text-babgray-600 text-[15px]">{coupon.description}</div>
                </div>
                <div className="flex gap-[5px] text-babgray-600 text-[15px] justify-end ">
                  <div>~{new Date(item.expires_at).toLocaleDateString()}</div>
                </div>
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponPage;
