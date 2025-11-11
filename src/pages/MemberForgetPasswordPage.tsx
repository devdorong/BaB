import { requestPasswordResetEmail } from '@/services/auth';
import Modal from '@/ui/sdj/Modal';
import { useModal } from '@/ui/sdj/ModalState';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoLg } from '../ui/Ui';

function MemberForgetPasswordPage() {
  const { closeModal, modal, openModal } = useModal();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return openModal('비밀번호 찾기', '이메일을 입력하세요.', '닫기', '');
    await requestPasswordResetEmail({ email });
    openModal(
      '비밀번호 찾기',
      `${email} 주소로 메일을 보냈습니다.\n메일함을 열어 비밀번호를 재설정 해주세요.`,
      '닫기',
      '메일함 열기',
      () => {
        // 이메일 도메인에 따라 자동 이동
        const domain = email.split('@')[1];
        let mailUrl = '';

        if (domain.includes('gmail')) mailUrl = 'https://mail.google.com/';
        else if (domain.includes('naver')) mailUrl = 'https://mail.naver.com/';
        else if (domain.includes('daum')) mailUrl = 'https://mail.daum.net/';
        else if (domain.includes('kakao')) mailUrl = 'https://mail.kakao.com/';
        else mailUrl = `https://tmailor.com/ko/`; // 기본값 임시이메일생성

        window.location.href = mailUrl;
        closeModal();
      },
    );
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
            <div className="flex flex-col">
              <span className="font-bold text-lg">비밀번호를 잊으셨나요?</span>
              <span> 이메일 비밀번호를 재설정 할 수 있는 인증 링크를 보내드립니다.</span>
            </div>
            {/* 아이디 */}
            <div className="w-full h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-babgray-300 flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@example.com"
                required
                className="flex-1 text-babgray-700 outline-none text-[16px]"
              />
            </div>
          </div>

          {/* 로그인 버튼 */}
          <div className="py-7">
            <button
              type="submit"
              className="w-full h-[50px] bg-bab-500 rounded-lg flex justify-center items-center hover:bg-[#BB2D00] transition-colors"
            >
              <span className="text-white text-base font-semibold">인증 메일 요청하기</span>
            </button>
          </div>
        </form>
      </div>
      {modal.isOpen && (
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          closeButtonText={modal.closeText}
          contentText={modal.content}
          submitButtonText={modal.submitText}
          titleText={modal.title}
          onSubmit={modal.onSubmit}
        />
      )}
    </div>
  );
}

export default MemberForgetPasswordPage;
