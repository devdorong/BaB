import dayjs from 'dayjs';
import { useAuth } from '../../contexts/AuthContext';
import type { Help } from '../../types/bobType';
import { ButtonFillMd } from '../button';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './HelpDetailModal.module.css';

type HelpDetailModalProps = {
  isOpen: (value: React.SetStateAction<boolean>) => void;
  help: Help;
};

function HelpDetailModal({ isOpen, help }: HelpDetailModalProps) {
  const { user } = useAuth();

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
          className={styles.modalContainer}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <p className="w-full flex items-start text-xl font-bold">1:1 문의하기</p>

          <div className={styles.modalContent} style={{ scrollbarGutter: 'stable both-edges' }}>
            <div className="w-full">
              <p className="text-sm">답변상태</p>
              <div className="w-full h-12 px-2.5 py-3 border-b items-center">
                <div className="font-semibold">
                  {help.status === false ? '답변 대기중' : '답변 완료'}
                </div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">이메일</p>
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">{user?.email}</div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의 일자</p>
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">
                  {dayjs(help.created_at).format('YYYY-MM-DD HH:mm')}
                </div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의유형</p>
              <div className="w-full h-12 px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">{help.help_type}</div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의제목</p>
              <div className="w-full px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold">{help.title}</div>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm">문의내용</p>
              <div className="w-full px-2.5 py-3 bg-white border-b items-center">
                <div className="font-semibold whitespace-pre-line break-words">{help.contents}</div>
              </div>
            </div>

            <div className="w-full inline-flex items-center gap-4">
              <ButtonFillMd
                style={{ backgroundColor: '#e5e7eb', color: '#5C5C5C' }}
                className="flex-1 hover:!bg-gray-300"
                onClick={() => isOpen(false)}
              >
                닫기
              </ButtonFillMd>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default HelpDetailModal;
