import { supabase } from '@/lib/supabase';
import Modal from '@/ui/sdj/Modal';
import { useModal } from '@/ui/sdj/ModalState';
import { useNavigate, useParams } from 'react-router-dom';

const UserDetail = () => {
  const { id, user } = useParams();
  const navigate = useNavigate();
  const { closeModal, modal, openModal } = useModal();

  const handleBlock = () => {
    openModal('차단', '해당 사용자를 차단하시겠습니까?', '취소', '차단', async () => {
      const { error } = await supabase.from('profile_blocks').insert({});
      if (error) {
        console.log(error);
      }
    });
  };

  return (
    <div
      //   ref={menuRef}
      className="absolute left-4 bottom-4 bg-white border border-gray-200 rounded-md shadow-md p-2 w-32 z-50"
    >
      <button
        // onClick={handleLogout}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 rounded-sm hover:bg-gray-100"
      >
        채팅하기
      </button>
      <button
        onClick={() => navigate('/')}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 rounded-sm hover:bg-gray-100"
      >
        차단하기
      </button>
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
};

export default UserDetail;
