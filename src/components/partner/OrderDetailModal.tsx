import React, { useEffect, useRef, useState } from 'react';
import type { Category } from './MenusList';

type Interest = {
  id: number;
  name: string; // 예: "매운맛", "치즈", "단짠"
};

type OrderDetailModalProps = {
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

const OrderDetailModal = ({ open, onClose, onSubmit }: OrderDetailModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);

  // 리셋 함수
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [tag, setTag] = useState('');
  const [interest, setInterest] = useState('');
  const [enable, setEnable] = useState(true);

  // 관심사
  const interests: Interest[] = [
    { id: 1, name: '양식' },
    { id: 2, name: '실내' },
    { id: 3, name: '술' },
  ]; // Supabase에서 불러와야 함

  const toggleInterest = (id: number) => {
    setSelectedInterests(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]));
  };

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
            <h2 className="text-xl font-bold text-gray-900">주문번호 ORD-001</h2>
          </div>

          <div>
            <h3>주문번호 ORD-001</h3>
            <div>
              <p>고객명: 김사라 </p>
              <p>연락처: 010-1234-5678</p>
              <p>주문일시: 2025-09-05 14:30</p>
            </div>
          </div>

          <div>
            <h3>[주문내역]</h3>
            <ul>
              <li>안심 스테이크 × 2 → 50,000원</li>
              <li>시저 샐러드 × 1 → 12,000원</li>
              <li>콜라 × 2 → 6,000원</li>
            </ul>
            <div>
              <p>소계: 68,000원</p>
              <p>부가세(10%): 6,800원</p>
              <p>서비스 차지: 2,000원</p>
              <p>총액: 76,800원</p>
            </div>
            <div>
              <p>결제방법: 카드 결제</p>
              <p>주문상태: 조리 중</p>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
