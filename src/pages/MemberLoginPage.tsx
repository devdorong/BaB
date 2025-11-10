import { useEffect, useState } from 'react';
import { RiCheckboxCircleLine, RiLock2Line, RiUserLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import KakaoLoginButton from '../components/KakaoLoginButton';
import { useAuth } from '../contexts/AuthContext';
import { LogoLg } from '../ui/Ui';
import { GoogleIconSvg } from '../ui/jy/IconSvg';
import { supabase } from '../lib/supabase';
import GoogleLoginButton from '../components/GoogleLoginButton';

function MemberLoginPage() {
  const navigate = useNavigate();
  const {  signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    signOut();
  }, []);

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
    <div className="flex flex-col items-center bg-bg-bg min-h-[calc(100vh/0.9)] justify-center px-4 sm:px-6">
      {/* 로고 영역 */}
      <div className="pb-10">
        <Link to="/member" className="cursor-pointer">
          <div className="transform transition-transform duration-300 scale-90 sm:scale-100 max-w-[200px] sm:max-w-none mx-auto">
            <LogoLg />
          </div>
        </Link>
      </div>

      <div className="flex flex-col w-full max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-7">
            {/* 아이디 */}
            <div className="w-full h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-babgray-300 flex items-center gap-2">
              <RiUserLine className="text-babgray-300" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="아이디"
                required
                className="flex-1 text-babgray-700 outline-none text-[16px]"
              />
            </div>

            {/* 비밀번호 */}
            <div className="w-full h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-babgray-300 flex items-center gap-2">
              <RiLock2Line className="text-babgray-300" />
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="비밀번호"
                required
                className="flex-1 text-babgray-700 outline-none text-[16px]"
              />
            </div>
          </div>

          {/* 로그인 상태 유지 */}
          <label className="inline-flex items-center gap-1 pt-6 cursor-pointer">
            <input type="checkbox" className="peer hidden" />
            <RiCheckboxCircleLine className="text-xl text-babgray-600 peer-checked:text-white peer-checked:bg-[#FF5722] rounded-full transition-colors" />
            <span className="text-babgray-900 text-base font-normal">로그인 상태 유지</span>
          </label>

          {/* 로그인 버튼 */}
          <div className="py-7">
            <button
              type="submit"
              className="w-full h-[50px] bg-bab-500 rounded-lg flex justify-center items-center hover:bg-[#BB2D00] transition-colors"
            >
              <span className="text-white text-base font-semibold">로그인</span>
            </button>

            {msg && (
              <p
                className={`mt-4 p-3 rounded-lg text-center border ${
                  msg.includes('성공')
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-600'
                    : 'bg-rose-50 text-rose-600 border-rose-600'
                }`}
              >
                {msg}
              </p>
            )}
          </div>
        </form>

        {/* 아이디/비밀번호 찾기/회원가입 */}
        <div className="flex flex-wrap justify-center gap-2 text-sm sm:text-base text-babgray-500 font-medium">
          <span>아이디 찾기</span>
          <span>|</span>
          <span>비밀번호 찾기</span>
          <span>|</span>
          <span
            onClick={() => navigate('/member/signup')}
            className="cursor-pointer hover:text-bab-500"
          >
            회원가입
          </span>
        </div>

        {/* 구분선 */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">또는</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* SNS 로그인 */}
        <div className="flex flex-col items-center gap-4">
          <GoogleLoginButton
            onError={error => setMsg(`구글 로그인 오류 : ${error}`)}
            // onSuccess={message => setMsg(message)}
          />
          <KakaoLoginButton onError={error => setMsg(`카카오 로그인 오류 : ${error}`)} />
        </div>
      </div>
    </div>
  );
}

export default MemberLoginPage;
