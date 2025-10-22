import { useState } from 'react';

export type ModalState = {
  isOpen: boolean;
  title: string;
  content: string;
  closeText?: React.ReactNode;
  submitText?: React.ReactNode;
  onSubmit?: () => void;
  onCloseAction?: () => void;
  onX?: () => void;
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
    closeText?: React.ReactNode,
    submitText?: React.ReactNode,
    onSubmit?: () => void,
    onCloseAction?: () => void,
    onX?: () => void,
  ) => {
    setModal({
      isOpen: true,
      title,
      content,
      closeText,
      submitText,
      onSubmit,
      onCloseAction,
      onX,
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
  const x = () => {
    setModal(prev => {
      return { ...prev, isOpen: false };
    });
  };
  return { modal, openModal, closeModal, x };
};
