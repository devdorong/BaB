import React from 'react';
import { ButtonFillMd } from '../../ui/button';

interface ModalProps {
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

const OkCancelModal: React.FC<ModalProps> = ({
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
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col pt-5  w-[470px] min-h-[250px] bg-white rounded-[30px] shadow ">
        <div className="flex items-center justify-between  ">
          <div className=" w-full font-bold">{titleText}</div>
        </div>
        <div className="w-full flex  items-center p-[20px]">
          <div className="w-full font-bold">{contentText}</div>
        </div>
        <div className="flex justify-center gap-4 items-center  py-[20px] px-[20px] rounded-b-[30px]">

          <ButtonFillMd onClick={onClose} className="flex flex-1 !text-babgray-700 !bg-babgray-200">

            {closeButtonText}
          </ButtonFillMd>
          <ButtonFillMd
            onClick={onSubmit}
            className="flex flex-1"
            style={{ background: submitButtonBgColor, flex: 1 }}
          >
            {submitButtonText}
          </ButtonFillMd>
        </div>
      </div>
    </div>
  );
};

export default OkCancelModal;
