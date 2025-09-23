import { useState } from 'react';
import { RiCheckboxCircleLine, RiLock2Line, RiUserLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import KakaoLoginButton from '../components/KakaoLoginButton';
import { useAuth } from '../contexts/AuthContext';
import { LogoLg } from '../ui/Ui';
import { GoogleIconSvg } from '../ui/jy/IconSvg';
import { supabase } from '../lib/supabase';
import GoogleLoginButton from '../components/GoogleLoginButton';

function MemberLoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await signIn(email, pw);
    if (!error) {
      setMsg('로그인 성공');
      navigate('/member');
      return;
    }
    try {
      const { data: exists, error: rpcError } = await supabase.rpc('check_email_exists', {
        p_email: email,
      });

      if (rpcError) {
        setMsg('로그인 오류 : 이메일 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      if (exists === true) {
        setMsg('로그인 오류 : 비밀번호가 일치하지 않습니다.');
      } else if (exists === false) {
        setMsg('로그인 오류 : 해당 이메일이 존재하지 않습니다.');
      } else {
        setMsg('로그인 오류 : 이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setMsg('로그인 오류 : 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex flex-col items-center bg-bg-bg h-screen justify-center">
      <div className="pb-[52px]">
        <LogoLg />
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

            <label className="inline-flex items-center gap-1 pt-[25px] cursor-pointer">
              <input
                type="checkbox"
                className="peer hidden" // 기본 체크박스 숨김
              />
              <RiCheckboxCircleLine
                className="text-xl text-babgray-600 
               peer-checked:text-white peer-checked:bg-[#FF5722] 
               rounded-full transition-colors"
              />
              <span className="justify-start text-babgray-900 text-base font-normal">
                로그인 상태 유지
              </span>
            </label>
            {/* 로그인 버튼 */}
            <div className="py-[28px] relative">
              <button
                type="submit"
                className="px-[15px] w-[450px] h-[50px] self-stretch bg-bab-500 rounded-lg inline-flex justify-center items-center hover:bg-[#BB2D00]"
              >
                <div className="justify-start text-white text-base font-semibold">로그인</div>
              </button>
              {/* 메시지 출력 */}
              {msg && (
                <p
                  style={{
                    textAlign: 'center',
                    marginTop: '16px',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: msg.includes('성공') ? '#ecfdf5' : '#fef2f2',
                    color: msg.includes('성공') ? '#059669' : '#dc2626',
                    border: `1px solid ${msg.includes('성공') ? '#059669' : '#dc2626'}`,
                  }}
                >
                  {msg}
                </p>
              )}
            </div>
          </div>
        </form>

        {/* 아이디/비밀번호 찾기/회원가입 */}
        <div className="flex gap-2 justify-center ">
          <div className="text-center justify-start text-babgray-500 text-base font-medium">
            아이디 찾기
          </div>
          <div className="text-center justify-start text-babgray-500 text-base font-medium">|</div>
          <div className="text-center justify-start text-babgray-500 text-base font-medium">
            비밀번호 찾기
          </div>
          <div className="text-center justify-start text-babgray-500 text-base font-medium">|</div>
          <div
            onClick={() => navigate('/member/signup')}
            className="text-center justify-start text-babgray-500 text-base font-medium cursor-pointer"
          >
            회원가입
          </div>
        </div>
        {/* SNS 로그인 영역 */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '24px' }}>
          <div style={{ flex: 1, height: 1, backgroundColor: '#d1d5db' }}></div>
          <span style={{ padding: '0 16px', fontSize: '14px' }}>또는</span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#d1d5db' }}></div>
        </div>
        {/* 소셜 로그인 아이콘 */}
        <div className="flex gap-[24px] justify-center flex-col items-center">
          {/* <div className="flex w-[40px] h-[40px] justify-center items-center pw-[8px] py-[8px] bg-white rounded-[20px]">
            <GoogleIconSvg />
          </div> */}
          <GoogleLoginButton />
          {/* 카카오 로그인 버튼 : 오류 메시지는 사용자도 볼 수 있어야 함.*/}
          <KakaoLoginButton onError={error => setMsg(`카카오 로그인 오류 : ${error}`)} />
        </div>
      </div>
    </div>
  );
}

export default MemberLoginPage;
