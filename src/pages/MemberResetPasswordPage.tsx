import { supabase } from '@/lib/supabase';
import { updatePassword } from '@/services/auth';
import Modal from '@/ui/sdj/Modal';
import { useModal } from '@/ui/sdj/ModalState';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LogoLg } from '../ui/Ui';

function MemberResetPasswordPage() {
  const { closeModal, modal, openModal } = useModal();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      toast.error('새 비밀번호를 입력해주세요', { position: 'top-center' });
      return;
    }
    if (newPassword.length < 6) {
      toast.error('비밀번호는 최소 6자 이상 입력해주세요', { position: 'top-center' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다', { position: 'top-center' });
      return;
    }
    try {
      await updatePassword({ password: newPassword });

      openModal(
        '비밀번호 변경',
        `비밀번호가 성공적으로 변경되었습니다.\n새 비밀번호로 로그인 해주세요.`,
        '',
        '로그인 하러 가기',
        async () => {
          await supabase.auth.signOut();
          navigate('/member/login');
        },
      );
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      toast.error('비밀번호 변경 중 오류가 발생했습니다.', { position: 'top-center' });
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
            <div className="flex flex-col">
              <span className="font-bold text-lg">비밀번호 재설정하기</span>
              <span>새로운 비밀번호를 입력하세요.</span>
            </div>
            {/* 아이디 */}
            <div className="w-full h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-babgray-300 flex items-center gap-2">
              <input
                type="password"
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                }}
                placeholder="새 비밀번호"
                required
                className="flex-1 text-babgray-700 outline-none text-[16px]"
              />
            </div>
            <div className="w-full h-[45px] px-3.5 py-3 bg-white rounded-3xl outline outline-1 outline-babgray-300 flex items-center gap-2">
              <input
                type="password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                }}
                placeholder="새 비밀번호 확인"
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
              <span className="text-white text-base font-semibold">비밀번호 변경하기</span>
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

export default MemberResetPasswordPage;
