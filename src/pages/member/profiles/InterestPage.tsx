import { useEffect, useState } from 'react';
import { RiArrowRightSLine, RiSaveLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import CategoryListBadge from '../../../components/member/CategoryListBadge';
import {
  fetchCurrentProfileInterests,
  fetchInterestsGrouped,
  saveCurrentProfileInterests,
} from '../../../lib/interests';
import { ButtonFillMd } from '../../../ui/button';
import CategoryBadge from '../../../ui/jy/CategoryBadge';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

function InterestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const FOOD = '음식 종류';
  const DRINK = '음료 · 디저트';
  const SPACE = '공간 · 환경';

  const [interests, setInterests] = useState<Record<string, string[]>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // 전체 관심사 목록
        const grouped = await fetchInterestsGrouped();
        setInterests(grouped);

        // 사용자가 이미 선택한 관심사
        const profileInterests = await fetchCurrentProfileInterests();
        setSelected(profileInterests);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addSelect = (name: string) =>
    setSelected(prev => (prev.includes(name) ? prev : [...prev, name]));

  const removeSelect = (name: string) =>
    setSelected(prev => prev.filter(interest => interest !== name));

  const handleSave = async () => {
    // setSaving(true);
    try {
      await saveCurrentProfileInterests(selected);
      navigate('/member/profile');
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-bg-bg">
      <div className="flex flex-col w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
        {/* 프로필 헤더 링크 */}
        <div className="hidden lg:flex py-[15px]">
          <div
            onClick={() => navigate('/member/profile')}
            className="cursor-pointer hover:text-babgray-900 text-babgray-600 text-[17px]"
          >
            프로필
          </div>
          <div className="flex pt-[3px] items-center text-babgray-600 px-[5px] text-[17px]">
            <RiArrowRightSLine />
          </div>{' '}
          <div className="text-bab-500 text-[17px]">관심사</div>
        </div>
        <div className="mt-[20px] mb-[60px]">
          <div className="flex flex-col lg:flex-row gap-[40px] items-start">
            {/* 왼쪽 프로필 카드 */}
            <div className="flex flex-col gap-[20px] items-center justify-center w-full lg:w-[300px]">
              <div className="inline-flex w-full lg:w-[260px] p-[25px] flex-col justify-center items-start bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                {/* 프로필 및 설명 */}
                <div className="gap-[25px] flex flex-col justify-center items-start">
                  <div className="text-[16px] text-babgray-900 font-bold">
                    <p>💡 관심사 활용 팁</p>
                  </div>
                  <div className="flex flex-col text-[14px] items-start text-babgray-600 gap-[10px]">
                    <p>· 관심사는 맛집 추천에 활용됩니다.</p>
                    <p>· 비슷한 취향의 사람과 매칭됩니다.</p>
                    <p>· 언제든지 수정할 수 있습니다.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* 오른쪽 프로필카드 */}
            <div className="flex flex-col w-full gap-[25px]">
              {/* 선택된 관심사 */}
              <div className="w-full px-[20px] sm:px-[35px] py-[25px] flex flex-col bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col gap-[30px]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-babgray-900 text-[18px] font-bold">선택된 관심사</h2>
                    <ButtonFillMd
                      onClick={handleSave}
                      style={{ fontWeight: 400, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <RiSaveLine />
                      저장
                    </ButtonFillMd>
                  </div>
                  <div className="flex flex-wrap  gap-[12px] ">
                    {selected.length === 0 ? (
                      <span className="text-babgray-500 text-[13px]">
                        아직 선택된 관심사가 없어요
                      </span>
                    ) : (
                      selected.map(item => (
                        <button key={item} onClick={() => removeSelect(item)} type="button">
                          <CategoryBadge name={item} />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
              {/* 추천 관심사 */}
              <section className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col gap-[30px]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-babgray-900 text-[18px] font-bold">추천 관심사</h2>
                  </div>
                  <div className="flex flex-col gap-[50px]">
                    {interests[FOOD] && (
                      <div className="flex flex-col gap-[15px]">
                        <p className="text-[14px] text-babgray-900">{FOOD}</p>
                        <hr />
                        <div className="flex gap-[12px]">
                          <CategoryListBadge categories={interests[FOOD]} onClick={addSelect} />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-[15px]">
                      <p className="text-[14px] text-babgray-900">{DRINK}</p>
                      <hr />
                      <div className="flex gap-[12px]">
                        <CategoryListBadge categories={interests[DRINK]} onClick={addSelect} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-[15px]">
                      <p className="text-[14px] text-babgray-900">{SPACE}</p>
                      <hr />
                      <div className="flex gap-[12px]">
                        <CategoryListBadge categories={interests[SPACE]} onClick={addSelect} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterestPage;
