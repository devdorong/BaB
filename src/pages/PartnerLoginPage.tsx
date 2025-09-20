import { RiCheckboxCircleLine, RiLock2Line, RiUserLine } from "react-icons/ri";
import { LogoLg, PartnerLogo } from "../ui/Ui";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { GoogleIconSvg, KakaoIconSvg } from "../ui/jy/IconSvg";

function PartnerLoginPage() {

   const navigate = useNavigate();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [msg, setMsg] = useState('');
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { error } = await signIn(email, pw);
      if (error) {
        setMsg(`로그인 오류 : ${error}`);
      } else {
        setMsg('로그인 성공');
        navigate('/member');
      }
    };


  return <div className="flex flex-col items-center bg-bg-bg h-screen justify-center">
        <div className="pb-[52px]">
          <PartnerLogo />
        </div>
        <div className="flex flex-col">
          <form onSubmit={handleSubmit}>
            <div className="inline-flex flex-col justify-start items-start ">
              <div className="flex flex-col gap-7">
                {/* 아이디 */}
                <div className="self-stretch w-[450px] h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray-300 inline-flex justify-start items-center text-center gap-2">
                  <RiUserLine className="text-babgray-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="아이디"
                    required
                    className="flex-1 text-babgray-700 outline-none text-[16px] items-center "
                  />
                </div>
                {/* 비밀번호 */}
                <div className="self-stretch w-[450px] h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-babgray-300 inline-flex justify-start items-center text-center gap-2">
                  <RiLock2Line className="text-babgray-300" />
                  <input
                    type="password"
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                    placeholder="비밀번호"
                    required
                    className="flex-1 text-babgray-700 outline-none text-[16px] items-center "
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
                <button
                  type="submit"
                  className="px-[15px] w-[450px] h-[50px] self-stretch bg-babgray-800 rounded-lg inline-flex justify-center items-center hover:bg-[#BB2D00]"
                >
                  <div className="justify-start text-white text-base font-semibold">로그인</div>
                </button>
              </div>
            </div>
          </form>
  
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
            <div
              onClick={() => navigate('/partner/signup')}
              className="text-center justify-start text-babgray-500 text-base font-medium cursor-pointer"
            >
              파트너 신청하기
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
      </div>;
}

export default PartnerLoginPage;
