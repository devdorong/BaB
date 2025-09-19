import React, { useEffect, useState } from 'react';
import { RiCoupon2Line } from 'react-icons/ri';
import type { Coupon, Profile_Points } from '../../types/bobType';
import { supabase } from '../../lib/supabase';
import { ButtonFillMd, ButtonLineMd } from '../../ui/button';
import { changePoint, totalChangePoint } from '../../services/babService';
import { usePoint } from '../../contexts/BabContext';
import { useAuth } from '../../contexts/AuthContext';

const RewardChange = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const { subPoint, refreshPoint } = usePoint();
  const [totalPoint, setTotalPoint] = useState(0);

  useEffect(() => {
    const couponList = async () => {
      try {
        const { data, error } = await supabase.from('coupons').select('*');
        if (error) throw error;
        setCoupons(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    couponList();
  }, []);

  const handleCouponChange = async (coupon: Coupon) => {
    const result = await changePoint(coupon.id, coupon.required_points);
    if (result.success) {
      subPoint(coupon.required_points);
      alert('쿠폰발급');
      await refreshPoint();
      const total = await totalChangePoint();
      setTotalPoint(total);
    } else {
      alert('쿠폰 발급 오류');
    }
  };

  return (
    <div className="flex flex-col justify-center items-self">
      <div className="text-babgray-900 text-[18px] font-bold pb-[25px]">
        <div>리워드 교환</div>
      </div>
      <div className="flex">
        <div className="grid grid-cols-3 grid-rows-3 gap-[20px] w-full">
          {coupons.map(item => (
            <div
              key={item.id}
              className="flex flex-col gap-[14px] p-[17px] justify-center items-self rounded-[12px] border border-bab-300 bg-bab-100"
            >
              <div className="flex items-center justify-between">
                <div className="bg-bab-200 p-[12px] items-center rounded-[8px]">
                  <RiCoupon2Line className="w-[16px] h-[16px] text-bab-500" />
                </div>
                <div className="text-bab-500 font-bold">
                  {item.required_points.toLocaleString()}P
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <div className="text-babgray-900">{item.name}</div>
                <div className="text-babgray-600 text-[15px]">{item.description}</div>
              </div>
              <ButtonFillMd onClick={() => handleCouponChange(item)} style={{ fontWeight: 400 }}>
                교환하기
              </ButtonFillMd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardChange;
