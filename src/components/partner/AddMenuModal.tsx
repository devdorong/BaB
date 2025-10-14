import React, { useEffect, useRef, useState } from 'react';
import type { Category } from './MenusList';

type AddMenuProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    title: string;
    description?: string;
    price: number;
    tag: Category;
    interestIs: number[];
    files: File[]; // 업로드용 파일
    enabled?: boolean;
  }) => void;
};

const AddMenuModal = ({ open, onClose, onSubmit }: AddMenuProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [interest, setInterest] = useState('');
  const [enable, setEnable] = useState(true);

  // 파일 선택
  const handlePickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    e.target.value = '';
  };

  // 파일 제거
  const removeFile = () => {
    setFile(null);
  };

  // 리셋 함수
  const resetReview = () => {
    setTitle('');
    setDescription('');
    setPrice(0);
    setInterest('');
    setEnable(true);
    setFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 열릴 때 스크롤 잠금
  useEffect(() => {
    if (!open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = open ? 'hidden' : '';
      return () => {
        document.body.style.overflow = prev;
      };
    } else {
      // 닫히면 폼 초기화
      resetReview();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[520px] rounded-2xl bg-white shadow-2xl p-8 flex flex-col gap-6">
          {/* 헤더 */}
          <div className="flex justify-start items-center border-b border-gray-200 pb-3">
            <h2 className="text-xl font-bold text-gray-900">새 메뉴 등록</h2>
            {/* <button className="text-2xl text-gray-400 hover:text-gray-600">&times;</button> */}
          </div>

          {/* 사진 등록 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">사진 등록</label>
            <div
              onClick={() => {
                if (file) {
                  removeFile();
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="relative w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 cursor-pointer hover:border-[#FF5722] hover:text-[#FF5722] transition"
            >
              {file ? (
                <div className="w-full h-full relative rounded-xl overflow-hidden ">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                    onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                  />
                </div>
              ) : (
                <div>이미지 업로드</div>
              )}
            </div>
          </div>

          {/* 메뉴명 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">메뉴명</label>
            <input
              type="text"
              placeholder="예: 마르게리타 피자"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] outline-none"
            />
          </div>

          {/* 카테고리 + 가격 나란히 */}
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-sm font-medium text-gray-700">카테고리</label>
              <select className="w-full h-[40px] appearance-none rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] outline-none">
                <option value="피자">음식카테고리</option>
              </select>
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-sm font-medium text-gray-700">가격</label>
              <input
                type="number"
                placeholder="예: 12000"
                className="w-full h-[40px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] outline-none"
              />
            </div>
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">설명</label>
            <textarea
              rows={4}
              placeholder="메뉴 설명을 입력하세요"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] outline-none resize-none"
            />
          </div>

          {/* 파일 등록 */}
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handlePickFiles}
            className="hidden"
          />

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              취소
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#FF5722] text-white hover:bg-[#e14a1c] transition">
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenuModal;
