import React, { useEffect, useRef, useState } from 'react';
import type { Category } from './MenusList';
import { useMenus } from '../../contexts/MenuContext';
import type { Database, MenusInsert } from '../../types/bobType';
import { supabase } from '../../lib/supabase';
import { useRestaurant } from '../../contexts/PartnerRestaurantContext';
import { Select } from 'antd';

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

type CategoryType = Database['public']['Enums']['menu_category_enum'];

const AddMenuModal = ({ open, onClose }: AddMenuProps) => {
  const { createMenuItem } = useMenus();
  const { restaurant } = useRestaurant();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [interest, setInterest] = useState('');
  const [enable, setEnable] = useState(true);

  const [category, setCategory] = useState<CategoryType>('메인메뉴');
  const [loading, setLoading] = useState(false);

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

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('store_photos').upload(fileName, file);
    if (error) {
      console.log('파일 업로드 오류 :', error.message);
      return null;
    }
    const { data: urlData } = supabase.storage.from('store_photos').getPublicUrl(data.path);
    return urlData.publicUrl ?? null;
  };

  const handleSubmit = async () => {
    try {
      if (!title.trim() || price <= 0) {
        alert(`메뉴명과 가격을 입력해주세요.`);
        return;
      }
      setLoading(true);
      let imageUrl: string | null = null;

      if (file) {
        imageUrl = await uploadFile(file);
        if (!imageUrl) {
          alert(`이미지 업로드 실패`);
          return;
        }
      }

      const newMenu: MenusInsert = {
        name: title.trim(),
        description: description.trim(),
        price,
        category,
        image_url: imageUrl,
        is_active: true,
        restaurant_id: restaurant!.id,
      };
      await createMenuItem(newMenu);
      alert('메뉴가 등록되었습니다!');
      onClose();
    } catch (error) {
      console.error('메뉴 등록 중 오류:', error);
      alert('메뉴 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setPrice(0);
      setFile(null);
      setCategory('메인메뉴');
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
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] outline-none"
            />
          </div>

          {/* 카테고리 + 가격 나란히 */}
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-sm font-medium text-gray-700">카테고리</label>
              <Select
                value={category}
                onChange={(value: CategoryType) => setCategory(value)}
                size={'large'}
                className="bab-menu-select w-full h-[40px]"
                classNames={{
                  popup: {
                    root: 'bab-menu-select-dropdown',
                  },
                }}
              >
                <Select.Option value="메인메뉴">메인메뉴</Select.Option>
                <Select.Option value="사이드">사이드</Select.Option>
                <Select.Option value="음료 및 주류">음료 및 주류</Select.Option>
              </Select>
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-sm font-medium text-gray-700">가격</label>
              <input
                type="number"
                placeholder="예: 12000"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
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
              value={description}
              onChange={e => setDescription(e.target.value)}
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
            <button
              className="px-4 py-2 rounded-lg bg-[#FF5722] text-white hover:bg-[#e14a1c] transition"
              onClick={handleSubmit}
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenuModal;
