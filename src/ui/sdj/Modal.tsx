/**
 * Modal 컴포넌트 사용 예시:
 * <Modal
 *   isOpen={true} // 고정
 *   onClose={() => setIsOpen(false)} // 고정
 *   titleText="타이틀"
 *   contentText="내용"
 *   submitButtonText="확인버튼 텍스트"
 *   closeButtonText="닫기버튼 텍스트"
 * />
 */
import { RiCloseFill } from 'react-icons/ri';
import { ButtonFillMd } from '../button';
import type React from 'react';
import { useEffect } from 'react';
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
  submitButtonText?: string;
  closeButtonText?: string;
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
}) => {
  if (!isOpen) return null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowX = 'hidden'; // X 스크롤 막기
      document.body.style.overflowY = 'hidden'; // Y 스크롤 막기
    } else {
      document.body.style.overflowX = 'hidden'; // X는 항상 막기
      document.body.style.overflowY = 'auto'; // Y는 원상복구
    }

    return () => {
      document.body.style.overflowX = 'hidden'; // X는 계속 막기
      document.body.style.overflowY = 'auto'; // Y는 복원
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col gap-10 w-[470px] min-h-[250px] bg-white rounded-[30px] shadow ">
        <div className="flex items-center justify-between p-8 border-b border-b-babgray ">
          <p className="font-bold">{titleText}</p>
          <div>
            <RiCloseFill onClick={onClose} className="text-babgray-300 cursor-pointer" />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <p className="font-bold">{contentText}</p>
        </div>
        <div className="flex justify-center gap-4 items-center bg-babgray-100 py-[20px] px-[20px] rounded-b-[30px]">
          {submitButtonText && (
            <ButtonFillMd onClick={onSubmit} style={{ background: submitButtonBgColor, flex: 1 }}>
              {submitButtonText}
            </ButtonFillMd>
          )}
          {closeButtonText && (
            <ButtonFillMd
              onClick={onClose}
              className="w-full flex-1 !text-babgray-700 !bg-babgray-200"
            >
              {closeButtonText}
            </ButtonFillMd>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
