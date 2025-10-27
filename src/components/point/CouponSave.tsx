import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RiCoupon2Line } from 'react-icons/ri';
import { supabase } from '../../lib/supabase';
import type { Coupon, Database } from '../../types/bobType';
import { getProfile } from '../../lib/propile';
import { ButtonLineMd } from '@/ui/button';

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

  // 목록 보여주기
  const [showAll, setShowAll] = useState(false);

  const mobileCouponList = showAll ? coupons : coupons.slice(0, 3);

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
          .order('expires_at', { ascending: true });
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[20px] w-full">
          {coupons.length > 0 &&
            (window.innerWidth < 640 ? mobileCouponList : coupons).map(item =>
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
      {/* 더보기 버튼 — 모바일에서만 보이게 */}
      {coupons.length > 3 && (
        <div className="flex justify-center mt-[24px] sm:hidden">
          <ButtonLineMd
            onClick={() => setShowAll(!showAll)}
            className="!rounded-[24px] px-6 py-3 text-sm text-babgray-700 hover:text-bab-500"
          >
            {showAll ? '접기' : '더보기'}
          </ButtonLineMd>
        </div>
      )}
    </div>
  );
};

export default CouponPage;
