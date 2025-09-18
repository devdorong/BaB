import React, { useEffect, useState } from 'react';
import { RiCoupon2Line } from 'react-icons/ri';
import { supabase } from '../../lib/supabase';
import { ButtonFillMd, ButtonLineMd } from '../../ui/button';
import type { Coupon } from '../../types/bobType';

const RewardChange = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex flex-col justify-center items-self">
      <div className="text-babgray-900 text-[18px] font-bold pb-[25px]">
        <div>리워드 교환</div>
      </div>
      <div className="flex">
        <div className="grid grid-cols-3 gap-[20px] w-full">
          {coupons.map(item => (
            <div
              key={item.id}
              className="p-[17px] justify-center items-center rounded-[12px] border-bab-300 bg-bab-100"
            >
              <div className="flex items-center justify-between">
                <div className="bg-bab-200 p-[12px] items-center rounded-[8px]">
                  <RiCoupon2Line className="w-[16px] h-[16px] text-bab-500" />
                </div>
                <div className="text-bab-500 font-bold">
                  {item.required_points.toLocaleString()}P
                </div>
              </div>
              <div>{item.name}</div>
              <div>{item.description}</div>
              <ButtonFillMd style={{ fontWeight: 400 }}>교환하기</ButtonFillMd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardChange;
