import { RiEdit2Line, RiSaveLine } from 'react-icons/ri';
import { ButtonFillMd } from '../../../ui/button';
import { useNavigate } from 'react-router-dom';
import {
  AsianFood,
  Cafe,
  ChineseFood,
  Dessert,
  Drink,
  IndianFood,
  Indoor,
  ItalianFood,
  JapaneseFood,
  KFood,
  KoreanFood,
  MexicanFood,
  Outdoor,
  RoofTop,
} from '../../../ui/tag';

function InterestPage() {
  const navigate = useNavigate();
  return (
    <div className="flex bg-bg-bg ">
      {/* 프로필 헤더 링크 */}
      <div className="flex flex-col w-[1280px] m-auto">
        <div className="flex py-[15px]">
          <div
            onClick={() => navigate('/member/profile')}
            className="cursor-pointer hover:text-babgray-900 text-babgray-600 text-[17px]"
          >
            프로필
          </div>
          <div className="text-babgray-600 px-[5px] text-[17px]">{'>'}</div>
          <div className="text-bab-500 text-[17px]">관심사</div>
        </div>
        <div className="mt-[20px] mb-[60px]">
          <div className="flex gap-[40px] items-start">
            {/* 왼쪽 프로필 카드 */}
            <div className="flex flex-col gap-[20px] items-center justify-center">
              <div className="inline-flex w-[260px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                {/* 프로필 및 설명 */}
                <div className="gap-[25px] flex flex-col justify-center items-start">
                  <div className="text-[16px] text-babgray-900 font-bold">
                    <p>💡 관심사 활용 팁</p>
                  </div>
                  <div className="flex flex-col *:text-[14px] text-babgray-600 gap-[10px]">
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
              <section className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col gap-[30px]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-babgray-900 text-[18px] font-bold">선택된 관심사</h2>
                    <ButtonFillMd
                      onClick={() => navigate('/member/profile')}
                      style={{ fontWeight: 400, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <RiSaveLine />
                      저장
                    </ButtonFillMd>
                  </div>
                  <div className="flex gap-[12px]">
                    <KFood />
                    <ChineseFood />
                    <Cafe />
                    <Indoor />
                  </div>
                </div>
              </section>
              {/* 추천 관심사 */}
              <section className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col gap-[30px]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-babgray-900 text-[18px] font-bold">추천 관심사</h2>
                  </div>
                  <div className="flex flex-col gap-[15px]">
                    <p className="text-[14px] text-babgray-900">음식 종류</p>
                    <div className="flex gap-[12px]">
                      <KoreanFood />
                      <ChineseFood />
                      <JapaneseFood />
                      <ItalianFood />
                      <KFood />
                      <AsianFood />
                      <IndianFood />
                      <MexicanFood />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[15px]">
                    <p className="text-[14px] text-babgray-900">음료 · 디저트</p>
                    <div className="flex gap-[12px]">
                      <Cafe />
                      <Dessert />
                      <Drink />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[15px]">
                    <p className="text-[14px] text-babgray-900">공간 · 환경</p>
                    <div className="flex gap-[12px]">
                      <Indoor />
                      <Outdoor />
                      <RoofTop />
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
