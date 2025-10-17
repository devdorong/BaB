import { useEffect, useState } from 'react';
import { RiCheckboxCircleLine, RiLock2Line, RiUserLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import GoogleLoginSmallButton from '../components/GoogleLoginSmallButton';
import KakaoLoginSmallButton from '../components/KakaoLoginSmallButton';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../lib/propile';
import Modal from '../ui/sdj/Modal';
import { useModal } from '../ui/sdj/ModalState';
import { PartnerLogo } from '../ui/Ui';

function PartnerLoginPage() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const { openModal, closeModal, modal } = useModal();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 로그인 시도
    const { error } = await signIn(email, pw);
    if (error) {
      setMsg(`로그인 오류 : ${error}`);
      return;
    }
  };

  const handlePartnerSign = () => {
    if (!user) {
      openModal('로그인', '로그인 후 이용 가능한 서비스입니다.', '확인', '');
    } else {
      navigate('/partner/signup');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const tempData = await getProfile(user.id);
      if (!tempData) {
        setMsg('프로필 없음');
        return;
      }

      // 파트너 또는 관리자면 바로 이동
      if (tempData.role === 'partner' || tempData.role === 'admin') {
        setTimeout(() => navigate('/partner'), 0);
        return;
      }

      openModal(
        '파트너 신청',
        '파트너만 이용가능합니다. 파트너 신청 하시겠습니까?',
        '홈으로 돌아가기',
        '신청하기',
        () => {
          setTimeout(() => navigate('/partner/signup'), 0);
        },
        () => {
          setTimeout(() => navigate('/member'), 0);
        },
      );
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="flex flex-col items-center bg-bg-bg min-h-[calc(100vh/0.9)] justify-center">
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

            <label className="inline-flex items-center gap-1 pt-[25px] cursor-pointer">
              <input
                type="checkbox"
                className="peer hidden" // 기본 체크박스 숨김
              />
              <RiCheckboxCircleLine
                className="text-xl text-babgray-600 
               peer-checked:text-white peer-checked:bg-babgray-600 
               rounded-full transition-colors"
              />
              <span className="justify-start text-babgray-900 text-base font-normal">
                로그인 상태 유지
              </span>
            </label>
            {/* 로그인 버튼 */}
            <div className="py-[28px]">
              <button
                type="submit"
                className="px-[15px] w-[450px] h-[50px] self-stretch bg-babgray-800 rounded-lg inline-flex justify-center items-center hover:bg-babgray-600"
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
            onClick={handlePartnerSign}
            className="text-center justify-start text-babgray-500 text-base font-medium cursor-pointer"
          >
            파트너 신청하기
          </div>
        </div>
        {/* 소셜 로그인 아이콘 */}
        <div className="flex gap-[24px] justify-center">
          <GoogleLoginSmallButton
            onError={error => setMsg(`구글 로그인 오류 : ${error}`)}
            onSuccess={message => setMsg(message)}
          />

          <KakaoLoginSmallButton onError={error => setMsg(`카카오 로그인 오류 : ${error}`)} />
        </div>
      </div>
      {modal.isOpen && (
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          titleText={modal.title}
          contentText={modal.content}
          closeButtonText={modal.closeText}
          submitButtonText={modal.submitText}
          onSubmit={modal.onSubmit}
        />
      )}
    </div>
  );
}

export default PartnerLoginPage;
