import React, { useRef, useState } from 'react';
import { RiCalendarLine, RiImageLine } from 'react-icons/ri';
import { uploadEventImage } from '../../lib/uploadEventImage';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/bobType';
import dayjs from 'dayjs';

type EventBadge = Database['public']['Tables']['events']['Row']['badge'];
type EventWriteModalProps = {
  onClose: () => void;
};
function EventWriteModal({ onClose }: EventWriteModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [benefit, setbenefit] = useState('');
  const [attend, setattend] = useState(0);
  const [startDate, setstartDate] = useState<Date | null>(null);
  const [endDate, setendDate] = useState<Date | null>(null);
  const [badgeType, setbadgeType] = useState<EventBadge>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const today = dayjs();
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  let status: '예정' | '진행중' | '종료' = '예정';
  if (today.isBefore(start)) {
    status = '예정';
  } else if (today.isAfter(end)) {
    status = '종료';
  } else {
    status = '진행중';
  }

  const badgeHot = attend >= 50 ? 'HOT' : null;
  const badgeNew = attend <= 10 ? 'NEW' : null;

  const dateLabel = dayjs(startDate).format('MM-DD(dd) HH:mm');

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
    setLoading(true);

    let imageUrl: string | null = null;
    if (image) {
      imageUrl = await uploadEventImage(image);
    }
    console.log('이미지 URL:', imageUrl);

    await supabase.from('events').insert({
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
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col w-[615px] min-h-[250px] bg-white text-babgray-500 rounded-[30px] overflow-hidden shadow ">
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
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
            <input
              className="w-full h-[42px] p-3 border border-babgray rounded-3xl focus:ring-1 focus:ring-bab
              "
              type="text"
              required
              placeholder="혜택을 입력해주세요"
            />
            <input
              type="text"
              className="w-full h-[42px] p-3 border border-babgray rounded-3xl focus:ring-1 focus:ring-bab
              "
              required
              placeholder="상세 내용을 입력해주세요"
            />
          </div>
          <div className="flex items-center gap-2 cursor-pointer text-babgray-700">
            <RiCalendarLine />
            이벤트 기간을 설정해주세요
          </div>
          <div>
            <button onClick={handleSubmit}>작성하기</button>
            <button onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventWriteModal;
