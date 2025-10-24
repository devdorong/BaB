import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Modal from './Modal';
import { useModal } from './ModalState';
import { ButtonFillMd } from '../button';
import EventDateSelector from './EventDateSelector';
import { RiImageLine } from 'react-icons/ri';
import type { DateSelectType } from './EventWriteModal';
import { AnimatePresence, motion } from 'framer-motion';

interface EventEditModalProps {
  eventId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

function EventEditModal({ eventId, isOpen, onClose }: EventEditModalProps) {
  const { closeModal, modal, openModal } = useModal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [benefit, setBenefit] = useState('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleEditCancel = () => {
    onClose();
  };

  const handleDateSelect = ({ start, end, status }: DateSelectType) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!eventId || !isOpen) return;
    const fetchEvent = async (eventId: number) => {
      const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();

      if (error) console.error('이벤트 불러오기 오류:', error);
      else if (data) {
        setTitle(data.title);
        setBenefit(data.benefit);
        setContent(data.description);
        setImagePreview(data.image_url);
        setStartDate(data.start_date);
        setEndDate(data.end_date);
      }
    };
    fetchEvent(eventId);
  }, [eventId, isOpen]);

  const handleEditSubmit = async () => {
    try {
      if (
        !title.trim() ||
        !benefit.trim() ||
        !content.trim() ||
        !imagePreview?.trim() ||
        !startDate
      ) {
        openModal(
          '이벤트 수정',
          '설정하지 않은 내용을 확인 후 다시 등록해주세요',
          '닫기',
          '',
          onClose,
        );
        return;
      }
      const { error } = await supabase
        .from('events')
        .update({
          title,
          benefit,
          description: content,
          image_url: imagePreview,
          start_date: startDate,
          end_date: endDate,
        })
        .eq('id', eventId);

      if (error) {
        openModal('이벤트 수정', '이벤트 수정 중 오류가 발생했습니다.', '', '닫기', onClose);
      } else {
        openModal('이벤트 수정', '이벤트가 성공적으로 수정되었습니다.', '', '닫기', onClose);
      }
    } catch (err) {
      console.error(err);
    }
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
          className="flex flex-col w-[615px] min-h-[250px] bg-white text-babgray-500 rounded-[30px] overflow-hidden shadow"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div
            onClick={handleDivClick}
            className="w-full h-[230px] bg-babgray-200  flex justify-center items-center cursor-pointer"
          >
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
                value={benefit}
                onChange={e => setBenefit(e.target.value)}
                type="text"
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
            <EventDateSelector
              onSelect={handleDateSelect}
              startDate={startDate}
              endDate={endDate}
            />
            <div className="flex w-full gap-4">
              <ButtonFillMd className="flex flex-1" type="button" onClick={handleEditSubmit}>
                수정하기
              </ButtonFillMd>
              <ButtonFillMd
                className="flex flex-1 !text-babgray-700 !bg-babgray-200 hover:!bg-babgray-500 hover:!text-white"
                type="button"
                onClick={handleEditCancel}
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

export default EventEditModal;
