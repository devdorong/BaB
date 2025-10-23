import { RiArrowDownSLine } from 'react-icons/ri';
import { useAuth } from '../../contexts/AuthContext';
import { ButtonFillMd } from '../button';
import Modal from './Modal';
import { useModal } from './ModalState';

function HelpDetailModal() {
  const { user } = useAuth();
  const { closeModal, modal, openModal } = useModal();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center justify-center gap-10 px-8 py-8 bg-white rounded-[30px] shadow-[0_4px_4px_0_rgba(0,0,0,0.02)] overflow-hidden">
        <p className="w-full flex items-start text-xl font-bold">1:1 문의하기</p>
        <div className="flex flex-col items-start gap-7 w-[400px] text-babgray-700">
          <div className="w-full">
            <p className="text-sm">이름</p>

            <div className="w-full h-12 px-2.5 py-3 border-b items-center">
              <div className="font-semibold">닉네임</div>
            </div>
          </div>
          <div className="w-full">
            <p className="text-sm">이메일</p>
            <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
              <div className="font-semibold">{user?.email}</div>
            </div>
          </div>
          <div className="w-full">
            <p className="text-sm">문의유형</p>
            <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
              <div className="font-semibold">문의유형</div>
            </div>
          </div>
          <div className="w-full">
            <p className="text-sm">문의내용</p>
            <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
              <div className="font-semibold">문의내용</div>
            </div>
          </div>

          <div className="w-full inline-flex items-center gap-4">
            {/* 취소 버튼 클릭시 확인모달 */}
            <ButtonFillMd
              style={{ backgroundColor: '#e5e7eb', color: '#5C5C5C' }}
              className="flex-1 hover:!bg-gray-300"
              //   onClick={() => setOpenModal(false)}
            >
              취소
            </ButtonFillMd>
            <ButtonFillMd className="flex-1 bg-bab hover:bg-bab-600">문의하기</ButtonFillMd>
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
        </div>
      </div>
    </div>
  );
}

export default HelpDetailModal;
