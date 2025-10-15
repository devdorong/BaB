import React, { useEffect, useRef, useState } from 'react';
import { useMenus } from '../../contexts/MenuContext';
import { useRestaurant } from '../../contexts/PartnerRestaurantContext';
import type { Database, MenusUpdate } from '../../types/bobType';
import type { Menus } from '../../types/bobType';
import { supabase } from '../../lib/supabase';
import { Select } from 'antd';

interface EditMenuModalProps {
  open: boolean;
  onClose: () => void;
  menu: Menus;
}

type CategoryType = Database['public']['Enums']['menu_category_enum'];

const EditMenuModal = ({ open, onClose, menu }: EditMenuModalProps) => {
  const { updateMenuItem } = useMenus();
  const { restaurant } = useRestaurant();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState<CategoryType>('메인메뉴');
  const [loading, setLoading] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // 메뉴 데이터로 초기화
  useEffect(() => {
    if (open && menu) {
      setTitle(menu.name);
      setDescription(menu.description || '');
      setPrice(menu.price);
      setCategory(menu.category as CategoryType);
      setExistingImageUrl(menu.image_url || null);
      setFile(null);
    }
  }, [open, menu]);

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
    setExistingImageUrl(null);
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
        alert('메뉴명과 가격을 입력해주세요.');
        return;
      }
      setLoading(true);
      let imageUrl: string | null = existingImageUrl;

      // 새 파일이 선택된 경우에만 업로드
      if (file) {
        imageUrl = await uploadFile(file);
        if (!imageUrl) {
          alert('이미지 업로드 실패');
          return;
        }
      }

      const updatedMenu: MenusUpdate = {
        name: title.trim(),
        description: description.trim(),
        price,
        category,
        image_url: imageUrl,
      };

      await updateMenuItem(menu.id, updatedMenu);
      alert('메뉴가 수정되었습니다!');
      onClose();
    } catch (error) {
      console.error('메뉴 수정 중 오류:', error);
      alert('메뉴 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 모달이 닫힐 때 스크롤 잠금 해제
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[520px] rounded-2xl bg-white shadow-2xl p-8 flex flex-col gap-6">
          {/* 헤더 */}
          <div className="flex justify-start items-center border-b border-gray-200 pb-3">
            <h2 className="text-xl font-bold text-gray-900">메뉴 수정</h2>
          </div>

          {/* 사진 등록 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">사진 등록</label>
            <div
              onClick={() => {
                if (file || existingImageUrl) {
                  removeFile();
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="relative w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 cursor-pointer hover:border-[#FF5722] hover:text-[#FF5722] transition"
            >
              {file ? (
                <div className="w-full h-full relative rounded-xl overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                    onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                  />
                </div>
              ) : existingImageUrl ? (
                <div className="w-full h-full relative rounded-xl overflow-hidden">
                  <img
                    src={existingImageUrl}
                    alt=""
                    className="w-full h-full object-cover"
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
            ref={fileInputRef}
            onChange={handlePickFiles}
            className="hidden"
          />

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-5 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50"
            >
              취소
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-[#FF5722] text-white hover:bg-[#e14a1c] transition disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '수정 중...' : '수정'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMenuModal;