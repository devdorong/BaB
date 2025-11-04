import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { AdminReportsPageProps } from '@/pages/admin/AdminSettingsPage';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ButtonFillMd } from '../button';
import Modal from './Modal';
import { useModal } from './ModalState';

type AdminSupportDetailModalProps = {
  onClose: () => void;
  helpDetail: AdminReportsPageProps;
};

function AdminSupportDetailModal({ onClose, helpDetail }: AdminSupportDetailModalProps) {
  const [helpAnswer, setHelpAnswer] = useState('');
  const { user } = useAuth();
  const profileId = user?.id;

  const { closeModal, modal, openModal, x } = useModal();

  const insertData = async (helpId: number, profileId: string, content: string) => {
    const { data, error } = await supabase
      .from('help_comments')
      .insert([{ help_id: helpId, profile_id: profileId, content: helpAnswer }])
      .select();

    if (error) {
      console.error('답변 등록 실패:', error.message);
      return null;
    }
    const { data: updated, error: updateError } = await supabase
      .from('helps')
      .update({ status: true })
      .eq('help_id', helpId);

    if (updateError) console.error('상태 업데이트 실패:', updateError.message);

    return data;
  };

  const handleInsertClick = async () => {
    if (!helpDetail || !profileId) {
      return;
    }

    if (!helpAnswer.trim()) {
      openModal('안내', '문의 답변을 입력해주세요', '닫기');
      return;
    }

    const result = await insertData(helpDetail.help_id, profileId, helpAnswer);

    if (result) {
      openModal(
        '안내',
        '답변이 등록되었습니다.',
        '확인',
        '',
        () => {},
        () => {
          onClose();
        },
        () => {
          onClose();
        },
      );
    } else {
      openModal('오류', '답변 등록에 실패했습니다.', '닫기');
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className={`flex flex-col items-center gap-6 p-6 max-h-screen bg-white rounded-[30px] shadow text-babgray-700`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <p className="w-full flex items-start text-xl px-2.5 font-bold">문의 상세</p>

          <div
            className={`flex flex-col items-start gap-4 w-[400px] max-h-[70%] overflow-y-auto text-babgray-700`}
          >
            <div className="w-full">
              <p className="text-sm">답변상태</p>
              <div className="w-full h-12 px-2.5 py-3 border-b items-center">
                <div className="font-semibold">
                  {helpDetail.status === false ? '답변 대기중' : '답변 완료'}
                </div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">닉네임</p>
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">{helpDetail.profiles?.nickname}</div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의 일자</p>
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">
                  {dayjs(helpDetail.created_at).format('YYYY-MM-DD HH:mm')}
                </div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의유형</p>
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">{helpDetail.help_type}</div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의제목</p>
              <div className="w-full px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">{helpDetail.title}</div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의내용</p>
              <div className="w-full px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold whitespace-pre-line break-words">
                  {helpDetail.contents}
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full gap-4">
              <p className="text-sm">문의 답변</p>
              <textarea
                value={helpAnswer}
                placeholder="답변 내용을 입력해주세요."
                onChange={e => setHelpAnswer(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] outline-none resize-none"
              />
            </div>

            <div className="w-full inline-flex items-center gap-4">
              <ButtonFillMd onClick={handleInsertClick} className="flex-1">
                답변하기
              </ButtonFillMd>
              <ButtonFillMd
                style={{ backgroundColor: '#e5e7eb', color: '#5C5C5C' }}
                className="flex-1 hover:!bg-gray-300"
                onClick={() => onClose()}
              >
                닫기
              </ButtonFillMd>
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
              onX={modal.onX}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AdminSupportDetailModal;
