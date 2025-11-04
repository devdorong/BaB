import React, { useRef, useState } from 'react';
import { RiImageLine } from 'react-icons/ri';
import { supabase } from '../../lib/supabase';
import { uploadEventImage } from '../../lib/uploadEventImage';
import type { Database, Events } from '../../types/bobType';
import { ButtonFillMd } from '../button';
import EventDateSelector from './EventDateSelector';
import Modal from './Modal';
import { useModal } from './ModalState';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './EventWriteModal.module.css';

export type EventBadge = Database['public']['Tables']['events']['Row']['badge'];
export type EventWriteModalProps = {
  onClose: () => void;
  onSuccess: () => Promise<Events[]>;
};
export type DateSelectType = {
  start: string;
  end: string;
  status: string;
};

function EventWriteModal({ onClose, onSuccess }: EventWriteModalProps) {
  const { closeModal, modal, openModal } = useModal();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [benefit, setbenefit] = useState('');
  const [startDate, setstartDate] = useState<string | null>(null);
  const [endDate, setendDate] = useState<string | null>(null);
  const [badgeType, setbadgeType] = useState<EventBadge>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleEventCancel = () => {
    openModal(
      '작성 취소',
      '현재 작성중인 이벤트내용을 저장하지않고 닫으시겠습니까?',
      '취소',
      '확인',
      () => {
        onClose();
      },
    );
  };

  const handleDateSelect = ({ start, end, status }: DateSelectType) => {
    setstartDate(start);
    setendDate(end);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !benefit.trim() || !image || !startDate) {
      openModal('이벤트 등록', '설정하지 않은 내용을 확인 후 다시 등록해주세요.', '닫기');
      return;
    }

    openModal(
      '이벤트 등록',
      '현재 내용으로 이벤트를 등록하시겠습니까?',
      '취소',
      '등록',
      async () => {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) throw userError;

        let imageUrl: string | null = null;
        if (image) {
          imageUrl = await uploadEventImage(image);
        }

        const { error } = await supabase.from('events').insert({
          title,
          benefit,
          description: content,
          image_url: imageUrl,
          start_date: startDate,
          end_date: endDate,
          status: '예정',
          badge: badgeType,
          participants_count: 0,
        });

        if (error) {
          openModal('이벤트 등록', '이벤트 등록 중 오류가 발생했습니다.', '', '닫기', () =>
            onClose(),
          );
          return;
        }

        const now = new Date();
        const eventStart = new Date(startDate);
        const isSameDay = now.toISOString().slice(0, 10) === eventStart.toISOString().slice(0, 10);

        if (isSameDay) {
          const { data: allUserData, error: allUserError } = await supabase
            .from('profiles')
            .select('id');

          if (!allUserData && allUserError) return;

          const notification = allUserData.map(u => ({
            profile_id: user.id,
            receiver_id: u.id,
            title: '새로운 이벤트가 시작되었습니다!',
            content: '',
            target: 'profiles',
            type: '이벤트',
          }));
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert(notification);

          if (notificationError) {
            console.error('알림 생성 실패:', notificationError);
            // 알림은 실패해도 이벤트 등록은 성공으로 처리
          }
        }

        openModal('이벤트 등록', '이벤트가 성공적으로 등록되었습니다.', '', '확인', () => {
          onSuccess?.();
          onClose();
        });
      },
    );
  };

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
          <div onClick={handleDivClick} className={styles.imageContainer}>
            {imagePreview ? (
              <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover" />
            ) : (
              <RiImageLine className="text-5xl" />
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <form className="flex flex-col p-6 gap-6">
            <div className="flex flex-col gap-6">
              <input
                className="w-full h-[42px] p-3 border border-babgray rounded-3xl focus:ring-1 focus:ring-bab
              "
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
              />
              <input
                className="w-full h-[42px] p-3 border border-babgray rounded-3xl focus:ring-1 focus:ring-bab
              "
                type="text"
                value={benefit}
                onChange={e => setbenefit(e.target.value)}
                placeholder="혜택을 입력해주세요"
              />
              <input
                type="text"
                className="w-full h-[42px] p-3 border border-babgray rounded-3xl focus:ring-1 focus:ring-bab
              "
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="상세 내용을 입력해주세요"
              />
            </div>
            <EventDateSelector onSelect={handleDateSelect} />
            <div className="flex w-full gap-4">
              <ButtonFillMd className="flex flex-1" type="button" onClick={handleSubmit}>
                작성하기
              </ButtonFillMd>
              <ButtonFillMd
                className="flex flex-1 !text-babgray-700 !bg-babgray-200 hover:!bg-babgray-500 hover:!text-white"
                type="button"
                onClick={handleEventCancel}
              >
                취소
              </ButtonFillMd>
            </div>
          </form>
          {modal.isOpen && (
            <Modal
              isOpen={modal.isOpen}
              onClose={closeModal}
              titleText={modal.title}
              contentText={modal.content}
              closeButtonText={modal.closeText}
              submitButtonText={modal.submitText}
              onSubmit={modal.onSubmit}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default EventWriteModal;
