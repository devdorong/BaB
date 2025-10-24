import { RiCloseFill } from 'react-icons/ri';
import { ButtonFillMd } from '../button';
import type React from 'react';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  contentText?: React.ReactNode;
  titleText?: string;
  closeButtonBgColor?: string;
  submitButtonBgColor?: string;
  closeButtonTextColor?: string;
  submitButtonTextColor?: string;
  submitButtonText?: React.ReactNode;
  closeButtonText?: React.ReactNode;
  onX?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  titleText,
  contentText,
  submitButtonText,
  closeButtonText,
  closeButtonBgColor = '#c2c2c2',
  submitButtonBgColor = '#ff5722',
  closeButtonTextColor = '#5C5C5C',
  submitButtonTextColor = '#ffffff',
  onX,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }} // 등장 전
          animate={{ opacity: 1 }} // 등장 시
          exit={{ opacity: 0 }} // 사라질 때
          transition={{ duration: 0.25 }} // 애니메이션 시간
        >
          <motion.div
            className="flex flex-col gap-10 w-[470px] min-h-[250px] bg-white rounded-[30px] shadow"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* 상단 영역 */}
            <div className="flex items-center justify-between p-8 border-b border-b-babgray">
              <p className="font-bold">{titleText}</p>
              <RiCloseFill
                onClick={onX ? onX : onClose}
                className="text-babgray-300 cursor-pointer"
              />
            </div>

            {/* 본문 내용 */}
            <div className="flex justify-center items-center px-6 text-center">
              <p className="font-bold">{contentText}</p>
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-center gap-4 items-center bg-babgray-100 py-[20px] px-[20px] rounded-b-[30px]">
              {submitButtonText && (
                <ButtonFillMd
                  onClick={onSubmit}
                  style={{ background: submitButtonBgColor, flex: 1, color: submitButtonTextColor }}
                >
                  {submitButtonText}
                </ButtonFillMd>
              )}
              {closeButtonText && (
                <ButtonFillMd
                  onClick={onClose}
                  style={{
                    background: closeButtonBgColor,
                    flex: 1,
                    color: closeButtonTextColor,
                  }}
                  className="hover:!bg-gray-300"
                >
                  {closeButtonText}
                </ButtonFillMd>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
