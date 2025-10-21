import React, { useEffect, useState } from 'react';
import { CalendarCheckLine, Sparkling2Fill } from '../../ui/Icon';
import {
  RiAddLine,
  RiCalendarCheckLine,
  RiLightbulbLine,
  RiStarLine,
  RiUserAddLine,
  RiUserHeartLine,
} from 'react-icons/ri';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { usePoint } from '../../contexts/PointContext';

interface PointRulesType {
  change_type: string;
  default_amount: number;
}

const ruleLabels: Record<string, { title: string; description: string; icon: JSX.Element }> = {
  daily_login: {
    title: '매일 출석 체크',
    description: '매일 접속 시',
    icon: <RiCalendarCheckLine className="w-[20px] h-[20px] text-bab-500" />,
  },
  review: {
    title: '레스토랑 리뷰 작성',
    description: '사진 포함 리뷰',
    icon: <RiStarLine className="w-[20px] h-[20px] text-bab-500" />,
  },
  matching: {
    title: '식사 메이트 매칭',
    description: '매칭 성사 후',
    icon: <RiUserHeartLine className="w-[20px] h-[20px] text-bab-500" />,
  },
  invite_friend: {
    title: '친구 초대',
    description: '가입 완료 시',
    icon: <RiUserAddLine className="w-[20px] h-[20px] text-bab-500" />,
  },
};

const RuleSkeleton = () => {
  return (
    <div className="flex flex-col w-full gap-[30px] animate-pulse">
      <div className="flex flex-col w-full gap-[10px] animate-pulse">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex w-full gap-[17px] p-[20px] justify-start items-center rounded-[12px] border border-gray-100 bg-white"
            >
              <div className="w-[48px] h-[50px] bg-gray-200 rounded-xl" />
              <div className="flex w-full justify-between items-center">
                <div className="flex flex-col gap-[5px] w-[70%]">
                  <div className="h-[18px] w-[60%] bg-gray-200 rounded"></div>
                  <div className="h-[14px] w-[40%] bg-gray-100 rounded"></div>
                </div>
                <div className="h-[18px] w-[40px] bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-[16px] px-[20px] py-[15px] rounded-[12px] border border-gray-200 bg-gray-50">
        <div className="flex gap-[9px] items-center">
          <div className="w-[30px] h-[30px] bg-gray-200 rounded-full"></div>
          <div className="h-[30px] w-[100px] bg-gray-200 rounded"></div>
        </div>
        <div className="flex flex-col gap-[5px]">
          <div className="h-[18px] w-[80%] bg-gray-100 rounded"></div>
          <div className="h-[18px] w-[70%] bg-gray-100 rounded"></div>
          <div className="h-[18px] w-[90%] bg-gray-100 rounded"></div>
          <div className="h-[18px] w-[60%] bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const PointRule = () => {
  const { user } = useAuth();
  const { point, addPoint } = usePoint();
  const [couponRules, setCouponRules] = useState<PointRulesType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const pointrules = async () => {
      try {
        const { data, error } = await supabase.from('point_rules').select('*');
        if (error) throw error;

        setCouponRules(data || []);
      } catch (err) {
        console.log(`포인트 적립 오류 ${err}`);
      } finally {
        setLoading(false);
      }
    };
    pointrules();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-self gap-[25px]">
        <div className="text-babgray-900 text-[18px] font-bold">
          <div>포인트 적립 방법</div>
        </div>
        <RuleSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-self gap-[25px]">
      <div className="text-babgray-900 text-[18px] font-bold">
        <div>포인트 적립 방법</div>
      </div>
      <div className="flex flex-col items-center gap-[10px]">
        {couponRules.map(item => {
          const rule = ruleLabels[item.change_type];
          if (!rule) return null;
          return (
            <div
              key={item.change_type}
              className="flex w-full gap-[17px] p-[20px] justify-start items-center rounded-[12px] border border-graybab-150 bg-white"
            >
              <div className="flex w-[48px] h-[48px] bg-bab-100 p-[12px] items-center justify-center rounded-[8px]">
                <div className="w-[20px] h-[20px] text-bab-500">{rule.icon}</div>
              </div>
              <div className="flex w-full justify-between items-center">
                <div className="flex flex-col gap-[5px]">
                  <div className="text-[17px] text-babgray-900">{rule.title}</div>
                  <div className="text-[14px] text-babgray-600">{rule.description}</div>
                </div>
                <div>
                  <span className="text-[17px] font-bold text-bab-500">+{item.default_amount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-[14px] px-[20px] py-[15px] justify-center items-self rounded-[12px] border border-bab-300 bg-bab-100">
        <div className="flex gap-[9px] items-center">
          <RiLightbulbLine className="text-bab-500" />
          <div className="text-[15px] font-medium text-babgray-900">포인트 적립 팁</div>
        </div>
        <div className="text-[15px] font-medium text-babgray-600" style={{ lineHeight: '24px' }}>
          <div>· 매일 출석 체크로 꾸준히 포인트를 적립하세요</div>
          <div>· 사진이 포함된 리뷰는 많은 포인트를 받을 수 있어요</div>
          <div>· 친구 초대는 한 번에 많은 포인트를 얻는 좋은 방법이에요</div>
          <div>· 매칭 성사 후에는 포인트가 지급돼요</div>
        </div>
      </div>
    </div>
  );
};

export default PointRule;
