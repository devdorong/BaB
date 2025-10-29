import React, { useState, useEffect } from 'react';
import { X, CreditCard } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface PaymentInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: PaymentData) => void;
}

interface PaymentData {
  number: string;
  expire: string;
  cvv: string;
  card_holder: string;
  brand: string;
  description: string;
}

export const PaymentInputModal: React.FC<PaymentInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  // 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // 카드번호 포맷팅 (4자리마다 공백)
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\s/g, '').replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ') : numbers;
  };

  // 만료일 포맷팅 (MM/YY)
  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace(/\//g, '').length <= 4) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, '');
    if (numbers.length <= 3) {
      setCvv(numbers);
    }
  };

  const handleSubmit = () => {
    const paymentData: PaymentData = {
      number: cardNumber.replace(/\s/g, ''),
      expire: expiryDate,
      cvv: cvv,
      card_holder: cardHolder,
      brand: brand,
      description: description,
    };
    
    onSubmit(paymentData);

    // 폼 초기화
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardHolder('');
    setBrand('');
    setDescription('');
  };

  const isFormValid =
    cardNumber.replace(/\s/g, '').length === 16 &&
    expiryDate.length === 5 &&
    cvv.length === 3 &&
    cardHolder.trim().length > 0 &&
    brand.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-md shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <h2 className="text-lg font-bold">결제수단 등록</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 본문 */}
            <div className="p-6 space-y-4">
              {/* 카드번호 */}
              <div>
                <label className="block text-sm font-medium mb-2">카드번호</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bab-500"
                />
              </div>

              {/* 만료일 & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">만료일</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bab-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bab-500"
                  />
                </div>
              </div>

              {/* 카드 소유자명 */}
              <div>
                <label className="block text-sm font-medium mb-2">카드 소유자명</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={e => setCardHolder(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bab-500"
                />
              </div>

              {/* 카드 브랜드 */}
              <div>
                <label className="block text-sm font-medium mb-2">카드 브랜드</label>
                <input
                  type="text"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  placeholder="VISA, MASTERCARD 등"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bab-500"
                />
              </div>

              {/* 설명 (선택사항) */}
              <div>
                <label className="block text-sm font-medium mb-2">설명 (선택사항)</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="주 사용 카드, 비상용 카드 등"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bab-500"
                />
              </div>
            </div>

            {/* 등록하기 버튼 */}
            <div className="p-6 pt-0">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`w-full py-4 rounded-lg font-bold text-white transition-colors ${
                  isFormValid ? 'bg-bab-500 hover:bg-bab-600' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                등록하기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};