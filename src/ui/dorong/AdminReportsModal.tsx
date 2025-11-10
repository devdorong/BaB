import { useEffect, useState } from 'react';
import type { ReportsType } from '../../pages/member/communitys/CommunityDetailPage';
import { ButtonFillMd } from '../button';
import { AnimatePresence, motion } from 'framer-motion';
import type { ModalProps } from '../sdj/Modal';
import Modal from '../sdj/Modal';

type AdminReportsModalProps = {
  setReports: React.Dispatch<React.SetStateAction<boolean>>;
  targetNickname: string;
  reporterNickname: string;
  titleText?: string;
  contentText?: string;
  handleReport: (type: ReportsType, title: string, reason: string) => Promise<void>;
  reportType: ReportsType;
};

const AdminReportsModal = ({
  setReports,
  targetNickname,
  reporterNickname,
  handleReport,
  reportType,
  titleText,
  contentText,
}: AdminReportsModalProps) => {
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (isSubmitting) {
        return;
      }
      setIsSubmitting(true);
      await handleReport(reportType, title, reason);
      showModal('신고완료', '신고가 정상적으로 접수되었습니다.', '닫기');
      setReports(false);
      setIsSubmitting(false);
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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50"
        initial={{ opacity: 0 }} // 등장 전
        animate={{ opacity: 1 }} // 등장 시
        exit={{ opacity: 0 }} // 사라질 때
        transition={{ duration: 0.25 }} // 애니메이션 시간
      >
        <motion.div
          className="flex flex-col items-center justify-center gap-10 px-8 py-8 bg-white rounded-[30px] shadow-[0_4px_4px_0_rgba(0,0,0,0.02)] overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <p className="w-full flex items-start text-xl font-bold">신고하기</p>
          <div className="flex flex-col items-start gap-7 text-babgray-700">
            <div className="w-full">
              <p className="text-sm">신고자</p>
              <div className="w-full h-12 px-2.5 py-3 border-b items-center">
                <div className="font-semibold">{reporterNickname}</div>
              </div>
            </div>
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
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold"> {titleText}</div>
              </div>
            </div>
            <div className="w-full">
              <span className="flex items-center gap-1">
                문의 내용<p className="text-bab">*</p>
              </span>
              <div className="w-[400px] h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold"> {contentText}</div>
              </div>
            </div>
            <div className="w-full inline-flex items-center gap-4">
              <ButtonFillMd
                style={{ backgroundColor: '#e5e7eb', color: '#5C5C5C', cursor: 'pointer' }}
                className="flex-1 hover:!bg-gray-300"
                onClick={() => setReports(false)}
              >
                확인
              </ButtonFillMd>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminReportsModal;
