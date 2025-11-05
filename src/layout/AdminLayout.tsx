import AdminHeader from '@/components/admin/AdminHeader';
import { AdminHeaderProvider, useAdminHeader } from '@/contexts/AdminLayoutContext';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile } from '@/lib/propile';
import type { Profile } from '@/types/bobType';
import Modal from '@/ui/sdj/Modal';
import { useModal } from '@/ui/sdj/ModalState';
import { useEffect, useRef, useState } from 'react';
import { RiNotification3Line } from 'react-icons/ri';
import { Outlet, useNavigate } from 'react-router-dom';

function AdminTopBar() {
  const { title, subtitle } = useAdminHeader();
  const { closeModal, modal, openModal } = useModal();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [nickname, setNickName] = useState('');
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const loadProfile = async () => {
    if (!user?.id) {
      setError('사용자정보 없음');
      setLoading(false);
      return;
    }
    try {
      // 사용자 정보 가져오기
      const tempData = await getProfile(user?.id);
      if (!tempData) {
        // null의 경우
        setError('사용자 프로필 정보 찾을 수 없음');
        return;
      }
      // 사용자 정보 유효함
      setNickName(tempData.nickname || '');
      setProfileData(tempData);
    } catch (error) {
      setError('프로필 호출 오류');
    } finally {
      setLoading(false);
    }
  };

  // id로 닉네임을 받아옴
  useEffect(() => {
    loadProfile();
  }, [user?.id]);
  const handleLogout = () => {
    openModal('로그아웃 확인', '로그아웃 하시겠습니까?', '닫기', '로그아웃', () => {
      closeModal();
      openModal('로그아웃 확인', '로그아웃 되었습니다', '', '확인', () => {
        signOut();
        navigate('/');
        setOpen(false);
      });
    });
  };
  useEffect(() => {
    // 외부 클릭 감지 핸들러
    const handleClickOutside = (event: MouseEvent) => {
      // menuRef가 존재하고, 클릭한 영역이 menuRef 내부가 아닐 경우
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // cleanup (컴포넌트 언마운트 시 이벤트 제거)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <header className="fixed top-0 left-[260px] right-0 h-[87px] bg-white border-b border-gray-200 z-20 flex items-center justify-between px-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-[23px] font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-[13px] text-gray-500">{subtitle}</p>}
      </div>
      {/* 오른쪽 알림/프로필 등 */}
      <div
        className="flex items-center gap-3 cursor-pointer relative border-none hover:bg-bg-bg p-4 rounded-[50px]"
        onClick={() => setOpen(!open)}
      >
        <img
          src={`${profileData?.avatar_url === 'guest_image' ? 'https://www.gravatar.com/avatar/?d=mp&s=200' : profileData?.avatar_url}`}
          alt="admin"
          className="w-8 h-8 rounded-full border"
        />
        <span className="text-gray-700 font-semibold">{nickname}</span>
        {open && (
          <div
            ref={menuRef}
            className="absolute right-0 top-10 bg-white border border-gray-200 rounded-md shadow-md p-2 w-32 z-50"
          >
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
            >
              로그아웃
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
            >
              메인페이지로
            </button>
          </div>
        )}
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
    </header>
  );
}

function AdminLayout() {
  return (
    <AdminHeaderProvider>
      <div className="flex min-h-[calc(100vh/0.9)]">
        <AdminHeader />
        <div className="flex-1 ml-[260px] flex flex-col">
          <AdminTopBar />

          <main className="flex-1 overflow-y-auto mt-[87px] ">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminHeaderProvider>
  );
}

export default AdminLayout;
