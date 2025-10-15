import { useState } from 'react';

export type ModalState = {
  isOpen: boolean;
  title: string;
  content: string;
  closeText?: string;
  submitText?: string;
  onSubmit?: () => void;
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
  ) => {
    setModal({
      isOpen: true,
      title,
      content,
      closeText,
      submitText,
      onSubmit,
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };
  return { modal, openModal, closeModal };
};
