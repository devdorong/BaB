import { useState } from 'react';

export type ModalState = {
  isOpen: boolean;
  title: string;
  content: string;
  closeText?: string;
  submitText?: string;
  onSubmit?: () => void;
  onCloseAction?: () => void;
};

export const useModal = () => {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: '',
    content: '',
    closeText: '',
    submitText: '',
  });

  const openModal = (
    title: string,
    content: string,
    closeText?: string,
    submitText?: string,
    onSubmit?: () => void,
    onCloseAction?: () => void,
  ) => {
    setModal({
      isOpen: true,
      title,
      content,
      closeText,
      submitText,
      onSubmit,
      onCloseAction,
    });
  };

  const closeModal = () => {
    setModal(prev => {
      if (prev.onCloseAction) {
        prev.onCloseAction();
      }
      return { ...prev, isOpen: false };
    });
  };
  return { modal, openModal, closeModal };
};
