import { useEffect, useState } from 'react';
import type { ReportsType } from '../../pages/member/communitys/CommunityDetailPage';
import { ButtonFillMd } from '../button';
import Modal, { type ModalProps } from './Modal';

type ReportsModalProps = {
  setReports: React.Dispatch<React.SetStateAction<boolean>>;
  targetNickname: string;
  handleReport: (type: ReportsType, title: string, reason: string) => Promise<void>;
  reportType: ReportsType;
};

const ReportsModal = ({
  setReports,
  targetNickname,
  handleReport,
  reportType,
}: ReportsModalProps) => {
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');

  const [modal, setModal] = useState<ModalProps>({
    isOpen: false,
    onClose: () => {},
    titleText: '',
    contentText: '',
    closeButtonText: '',
    submitButtonText: '',
  });

  const showModal = (
    title: string,
    content: string,
    closeText: string,
    submitText?: string,
    onSubmit?: () => void,
  ) => {
    setModal({
      isOpen: true,
      onClose: () => setModal(prev => ({ ...prev, isOpen: false })),
      titleText: title,
      contentText: content,
      closeButtonText: closeText,
      submitButtonText: submitText,
      onSubmit: onSubmit,
    });
  };

  const handleConfirm = async () => {
    if (!title && !reason) {
      showModal('신고확인', '제목과 내용을 입력해주세요', '확인');
      return;
    }
    if (!title) {
      showModal('신고확인', '제목을 입력해주세요', '확인');
      return;
    } else if (!reason) {
      showModal('신고확인', '내용을 입력해주세요', '확인');
      return;
    }
    showModal('신고 확인', '작성된 내용으로 신고하시겠습니까?', '취소', '신고하기', async () => {
      await handleReport(reportType, title, reason);
      showModal('신고완료', '신고가 정상적으로 접수되었습니다.', '닫기');
      setReports(false);
    });
  };

  useEffect(() => {
    if (modal) {
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
    }
    return () => {
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
    };
  }, [modal]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
      <div className="flex flex-col items-center justify-center gap-10 px-8 py-8 bg-white rounded-[30px] shadow-[0_4px_4px_0_rgba(0,0,0,0.02)] overflow-hidden transition duration-300 ease-in-out">
        <p className="w-full flex items-start text-xl font-bold">신고하기</p>
        <div className="flex flex-col items-start gap-7 text-babgray-700">
          <div className="w-full">
            <p className="text-sm">신고대상</p>
            <div className="w-full h-12 px-2.5 py-3 border-b items-center">
              <div className="font-semibold">{targetNickname}</div>
            </div>
          </div>
          <div className="w-full">
            <p className="text-sm">문의유형</p>
            <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
              <div className="font-semibold">{reportType}</div>
            </div>
          </div>
          <div className="w-full">
            <span className="flex items-center gap-1">
              제목<p className="text-bab">*</p>
            </span>
            <input
              type="text"
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full h-12 mt-2 px-2.5 py-3 bg-white rounded-3xl outline outline-1 outline-gray-300 hover:outline hover:outline-1 focus:outline-bab"
            />
          </div>
          <div className="w-full">
            <span className="flex items-center gap-1">
              문의 내용<p className="text-bab">*</p>
            </span>
            <textarea
              placeholder="문의내용을 자세히 입력해주세요"
              value={reason}
              onChange={e => setReason(e.target.value)}
              maxLength={500}
              className="w-[400px] h-[150px] mt-2 px-2.5 py-3 resize-none bg-white rounded-3xl outline outline-1 outline-gray-300 hover:outline hover:outline-1 focus:outline-bab"
            />
            <p className="mt-2 text-right text-babgray-500 text-xs font-medium">
              {reason.length}/500 자
            </p>
          </div>
          <div className="w-full inline-flex items-center gap-4">
            <ButtonFillMd
              style={{ backgroundColor: '#e5e7eb', color: '#5C5C5C' }}
              className="flex-1 hover:!bg-gray-300"
              onClick={() =>
                showModal(
                  '작성 취소',
                  '작성 중인 신고 내용을 취소하시겠습니까?',
                  '아니요',
                  '예',
                  () => setReports(false),
                )
              }
            >
              취소
            </ButtonFillMd>
            <ButtonFillMd
              className="flex-1 !bg-babbutton-red hover:!bg-bab-700"
              onClick={handleConfirm}
            >
              신고하기
            </ButtonFillMd>
            {modal.isOpen && (
              <Modal
                isOpen={modal.isOpen}
                onClose={modal.onClose}
                titleText={modal.titleText}
                contentText={modal.contentText}
                submitButtonText={modal.submitButtonText}
                closeButtonText={modal.closeButtonText}
                submitButtonBgColor="#ef4444"
                onSubmit={modal.onSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;
