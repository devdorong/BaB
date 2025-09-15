import { RiCheckboxCircleLine, RiLock2Line, RiUserLine } from 'react-icons/ri';
import { LogoLg } from '../ui/Ui';
import { GoogleIconSvg, KakaoIconSvg } from '../ui/jy/IconSvg';

function MemberLoginPage() {
  return (
    <div className="flex flex-col items-center bg-bg-bg h-screen justify-center">
      <div className="pb-[52px]">
        <LogoLg />
      </div>
      <div className="flex flex-col">
        <div className="inline-flex flex-col justify-start items-start gap-7">
          {/* 아이디 */}
          <div className="self-stretch w-[450px] h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray-300 inline-flex justify-start items-center text-center gap-2">
            <RiUserLine className="text-babgray-300" />
            <input
              type="email"
              placeholder="아이디"
              className="flex-1 text-babgray-300 outline-none text-[16px] items-center "
            />
          </div>
          {/* 비밀번호 */}
          <div className="self-stretch w-[450px] h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray-300 inline-flex justify-start items-center text-center gap-2">
            <RiLock2Line className="text-babgray-300" />
            <input
              type="password"
              placeholder="비밀번호"
              className="flex-1 text-babgray-300 outline-none text-[16px] items-center "
            />
          </div>
        </div>
        {/* 로그인 상태유지 */}
        <div className="w-96 inline-flex items-center gap-1 pt-[25px]">
          <RiCheckboxCircleLine className="text-babgray-600 justify-center" />
          <div className="flex justify-center items-center gap-[5px]">
            <div className="justify-start text-babgray-900 text-base font-normal">
              로그인 상태 유지
            </div>
            <div className="w-2.5 h-2.5 bg-color-grayscale-g600 justify-center" />
          </div>
        </div>
        {/* 로그인 버튼 */}
        <div className="py-[28px]">
          <div className="px-[15px] w-[450px] h-[50px] self-stretch bg-bab-500 rounded-lg inline-flex justify-center items-center hover:bg-[#BB2D00]">
            <div className="justify-start text-white text-base font-semibold">로그인</div>
          </div>
        </div>
        {/* 아이디/비밀번호 찾기/회원가입 */}
        <div className="flex gap-2 justify-center pb-[28px]">
          <div className="text-center justify-start text-babgray-500 text-base font-medium">
            아이디 찾기
          </div>
          <div className="text-center justify-start text-babgray-500 text-base font-medium">|</div>
          <div className="text-center justify-start text-babgray-500 text-base font-medium">
            비밀번호 찾기
          </div>
          <div className="text-center justify-start text-babgray-500 text-base font-medium">|</div>
          <div className="text-center justify-start text-babgray-500 text-base font-medium">
            회원가입
          </div>
        </div>
        {/* 소셜 로그인 아이콘 */}
        <div className="flex gap-[24px] justify-center">
          <div className="flex w-[40px] h-[40px] justify-center items-center pw-[8px] py-[8px] bg-white rounded-[20px]">
            <GoogleIconSvg />
          </div>
          <div className="flex w-[40px] h-[40px] justify-center items-center pw-[8px] py-[8px] bg-[#FBE300] rounded-[20px]">
            <KakaoIconSvg />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberLoginPage;
