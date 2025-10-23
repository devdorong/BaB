/**
 * 결제 모달 컴포넌트
 *
 * 다양한 결제 수단(카드, 간편결제, 계좌이체)을 지원하는 결제 팝업 모달
 * 단계별 UI로 사용자 경험을 최적화하고, PG사별 결제 처리를 담당
 */

import { useEffect, useState } from 'react';
import { processPayment, type PGProvider, type PaymentRequest } from './paymentService';
import { ButtonFillMd } from '../../ui/button';
import { BankCardLine } from '../../ui/Icon';
import { usePayment } from './PaymentContext';
import { useNavigate } from 'react-router-dom';

/**
 * 주문 상품 정보 인터페이스
 */
interface OrderItem {
  id: string; // 상품 고유 ID
  name: string; // 상품명
  price: number; // 단가
  quantity: number; // 수량
}

/**
 * 결제 모달 Props 인터페이스
 */
interface PaymentModalProps {
  isOpen: boolean; // 모달 열림/닫힘 상태
  onClose: () => void; // 모달 닫기 콜백
  onSuccess: (result: any) => void; // 결제 성공 시 콜백
  selectedPG: PGProvider; // 선택된 PG사
  amount: number; // 결제 금액
  orderItems?: OrderItem[]; // 주문 상품 목록 (선택사항)
  orderName?: string; // 주문명 (선택사항)
}

/**
 * 결제 모달 메인 컴포넌트
 *
 * @param props - PaymentModalProps 인터페이스
 * @returns JSX.Element
 */
function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  selectedPG,
  amount,
  orderItems,
  orderName,
}: PaymentModalProps) {
  // ===== 상태 관리 =====
  const { paymentMethods, defaultMethod, setDefaultMethod } = usePayment();
  const navigate = useNavigate();

  /** 결제 처리 중 로딩 상태 */
  const [isLoading, setIsLoading] = useState(false);

  /** 결제 단계 상태: method(수단선택) → input(정보입력) → processing(처리중) → result(결과) */
  const [paymentStep, setPaymentStep] = useState<'method' | 'input' | 'processing' | 'result'>(
    'method',
  );

  /** 선택된 결제 수단: card(카드), kakao(카카오페이), toss(토스), naver(네이버페이), kg(등록된 카드) */
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'card' | 'kakao' | 'toss' | 'naver' | 'bank' | 'kg'
  >('kg');

  /** 카드 정보 입력 상태 */
  const [cardInfo, setCardInfo] = useState({
    number: '', // 카드번호
    expiry: '', // 만료일 (MM/YY)
    cvv: '', // CVV 코드
    name: '', // 카드 소유자명
  });

  /** 결제 결과 데이터 */
  const [paymentResult, setPaymentResult] = useState<any>(null);

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setPaymentStep('method');

      // 등록된 기본 카드가 있는지 확인
      const hasDefaultCard = paymentMethods.some(m => m.is_default);

      // 있으면 'kg', 없으면 'card'
      setSelectedPaymentMethod(hasDefaultCard ? 'kg' : 'card');

      setCardInfo({ number: '', expiry: '', cvv: '', name: '' });
      setPaymentResult(null);
    }
  }, [isOpen, paymentMethods]);

  // 결제 수단에 따라 PG사 자동 선택
  const getPGForPaymentMethod = (method: string): PGProvider => {
    switch (method) {
      case 'kakao':
        return 'kakao';
      case 'toss':
        return 'toss';
      case 'naver':
        return 'naver';
      case 'card':
        return 'kg';
      case 'bank':
      case 'kg':
        return 'kg';
      default:
        return selectedPG; // 카드/계좌이체는 선택된 PG사 사용
    }
  };

  const handleCardInput = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'number') {
      // 카드번호 포맷팅 (4자리마다 공백)
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    } else if (field === 'expiry') {
      // 만료일 포맷팅 (MM/YY)
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    } else if (field === 'cvv') {
      // CVV는 숫자만, 3자리
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 3) formattedValue = formattedValue.slice(0, 3);
    }

    setCardInfo(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handlePayment = async () => {
    // 카드 결제인 경우에만 카드 정보 검증
    if (selectedPaymentMethod === 'card') {
      if (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvv || !cardInfo.name) {
        alert('카드 정보를 모두 입력해주세요.');
        return;
      }
    }

    setIsLoading(true);
    setPaymentStep('processing');

    try {
      const paymentData: PaymentRequest = {
        amount,
        orderName: orderName || '도로롱의 피자 주문',
        customerName: '홍길동',
        customerEmail: 'customer@example.com',
        customerPhone: '010-1234-5678',
      };

      // 선택된 결제 수단에 맞는 PG사 결정
      const pgForPayment = getPGForPaymentMethod(selectedPaymentMethod);

      // 결제 처리 실행
      const response = await processPayment(pgForPayment, paymentData);
      // 결제 결과 저장
      setPaymentResult(response);
      // 결제 결과 화면으로 이동
      setPaymentStep('result');
    } catch (error) {
      console.error('결제 오류:', error);
      setPaymentResult({
        success: false,
        message: '결제 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      });
      setPaymentStep('result');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // 결제 성공 시에만 onSuccess 콜백 실행
    if (paymentStep === 'result' && paymentResult?.success) {
      onSuccess(paymentResult); // 결제 완료 시 실행되는 핵심 부분
    }
    onClose();
    navigate('/member/profile/recentmatching');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <BankCardLine color="none" bgColor="none" size={22} />
            <h2 className="text-lg font-semibold text-gray-800">결제하기</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition">
            ✕
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6">
          {paymentStep === 'method' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">결제 수단을 선택하세요</h3>
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">등록된 결제수단</h3>
                  {paymentMethods.map(m =>
                    m.is_default ? (
                      <button
                        key={m.id}
                        onClick={async () => {
                          setSelectedPaymentMethod('kg');
                          setPaymentStep('processing');
                          await handlePayment();
                        }}
                        className={`w-full flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
          ${
            selectedPaymentMethod === 'kg'
              ? 'border-bab bg-bab-50 shadow-[0_2px_6px_rgba(255,87,34,0.1)]'
              : 'border-gray-200 hover:border-bab/50 hover:bg-gray-50'
          }`}
                      >
                        <div className="text-[15px] font-semibold text-gray-800">
                          {m.brand} {m.number}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">기본 카드</div>
                      </button>
                    ) : null,
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'card', name: '카드 결제', icon: '💳', desc: '신용/체크카드' },
                    { id: 'kakao', name: '카카오페이', icon: '💛', desc: '간편결제' },
                    { id: 'toss', name: '토스페이먼츠', icon: '🔵', desc: '간편결제' },
                    { id: 'naver', name: '네이버페이', icon: '🟢', desc: '간편결제' },
                    // { id: 'bank', name: '계좌이체', icon: '🏦', desc: '실시간 계좌이체' },
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => {
                        setSelectedPaymentMethod(method.id as any);
                        setPaymentStep('input');
                      }}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition ${
                        selectedPaymentMethod === method.id
                          ? 'border-bab bg-bab/5'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium">{method.name}</span>
                      <span className="text-xs text-gray-500">{method.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 주문 정보 */}
              {orderItems && orderItems.length > 0 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-3">주문 내역</h4>
                  <div className="space-y-2">
                    {orderItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>{(item.price * item.quantity).toLocaleString()}원</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 mt-3">
                    <div className="flex justify-between items-center font-semibold">
                      <span>총 결제 금액</span>
                      <span className="text-bab">{amount.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              )}

              {(!orderItems || orderItems.length === 0) && (
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">결제 금액</span>
                    <span className="text-xl font-bold text-bab">{amount.toLocaleString()}원</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {paymentStep === 'input' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setPaymentStep('method')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  ← 결제 수단 선택
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {selectedPaymentMethod === 'card'
                      ? '💳 카드 결제'
                      : selectedPaymentMethod === 'kakao'
                        ? '💛 카카오페이'
                        : selectedPaymentMethod === 'toss'
                          ? '🔵 토스페이먼츠'
                          : selectedPaymentMethod === 'naver'
                            ? '🟢 네이버페이'
                            : '🏦 계좌이체'}
                  </span>
                </div>
              </div>

              {selectedPaymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">카드번호</label>
                    <input
                      type="text"
                      value={cardInfo.number}
                      onChange={e => handleCardInput('number', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bab"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">만료일</label>
                      <input
                        type="text"
                        value={cardInfo.expiry}
                        onChange={e => handleCardInput('expiry', e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bab"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        value={cardInfo.cvv}
                        onChange={e => handleCardInput('cvv', e.target.value)}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bab"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      카드 소유자명
                    </label>
                    <input
                      type="text"
                      value={cardInfo.name}
                      onChange={e => handleCardInput('name', e.target.value)}
                      placeholder="홍길동"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bab"
                    />
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'kakao' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💛</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">카카오페이</h3>
                  <p className="text-gray-600 mb-4">카카오페이로 간편하게 결제하세요</p>
                  <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                      카카오페이 계정으로 로그인하여
                      <br />
                      간편하게 결제를 진행할 수 있습니다.
                    </p>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'toss' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔵</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">토스페이먼츠</h3>
                  <p className="text-gray-600 mb-4">토스로 간편하게 결제하세요</p>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      토스 계정으로 로그인하여
                      <br />
                      간편하게 결제를 진행할 수 있습니다.
                    </p>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'naver' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🟢</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">네이버페이</h3>
                  <p className="text-gray-600 mb-4">네이버페이로 간편하게 결제하세요</p>
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800">
                      네이버페이 계정으로 로그인하여
                      <br />
                      간편하게 결제를 진행할 수 있습니다.
                    </p>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      은행 선택
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bab">
                      <option>국민은행</option>
                      <option>신한은행</option>
                      <option>우리은행</option>
                      <option>하나은행</option>
                      <option>농협은행</option>
                      <option>기업은행</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">계좌번호</label>
                    <input
                      type="text"
                      placeholder="계좌번호를 입력하세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bab"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">예금주명</label>
                    <input
                      type="text"
                      placeholder="예금주명을 입력하세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bab"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">결제 금액</span>
                  <span className="text-xl font-bold text-bab">{amount.toLocaleString()}원</span>
                </div>
                <ButtonFillMd onClick={handlePayment} className="w-full">
                  {selectedPaymentMethod === 'card'
                    ? '결제하기'
                    : selectedPaymentMethod === 'kakao'
                      ? '카카오페이로 결제'
                      : selectedPaymentMethod === 'toss'
                        ? '토스로 결제'
                        : selectedPaymentMethod === 'naver'
                          ? '네이버페이로 결제'
                          : '계좌이체로 결제'}
                </ButtonFillMd>
              </div>
            </div>
          )}

          {paymentStep === 'processing' && (
            <div className="text-center py-8">
              {/* 결제 수단에 따른 PG사별 로딩 아이콘과 색상 */}
              {(() => {
                const currentPG = getPGForPaymentMethod(selectedPaymentMethod);
                return (
                  <>
                    <div
                      className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${
                        currentPG === 'toss'
                          ? 'border-blue-500'
                          : currentPG === 'kg'
                            ? 'border-green-500'
                            : currentPG === 'nhn'
                              ? 'border-purple-500'
                              : currentPG === 'kakao'
                                ? 'border-yellow-500'
                                : 'border-green-500'
                      }`}
                    ></div>
                    <h3 className="text-lg font-semibold mb-2">
                      {currentPG === 'toss'
                        ? '토스페이먼츠 결제 처리 중...'
                        : currentPG === 'kg'
                          ? 'KG이니시스 결제 처리 중...'
                          : currentPG === 'nhn'
                            ? 'NHN페이코 결제 처리 중...'
                            : currentPG === 'kakao'
                              ? '카카오페이 결제 처리 중...'
                              : '네이버페이 결제 처리 중...'}
                    </h3>
                  </>
                );
              })()}
              <p className="text-gray-600">잠시만 기다려주세요.</p>
            </div>
          )}

          {/* 결제 결과 화면 - 성공/실패에 따른 UI 표시 */}
          {paymentStep === 'result' && paymentResult && (
            <div className="text-center">
              {paymentResult.success ? (
                <div className="text-green-600">
                  {/* 결제 수단에 따른 PG사별 아이콘과 색상 */}
                  {(() => {
                    const currentPG = getPGForPaymentMethod(selectedPaymentMethod);
                    return (
                      <>
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                            currentPG === 'toss'
                              ? 'bg-blue-100'
                              : currentPG === 'kg'
                                ? 'bg-green-100'
                                : currentPG === 'nhn'
                                  ? 'bg-purple-100'
                                  : currentPG === 'kakao'
                                    ? 'bg-yellow-100'
                                    : 'bg-green-100'
                          }`}
                        >
                          <span className="text-2xl">
                            {currentPG === 'toss'
                              ? '🔵'
                              : currentPG === 'kg'
                                ? '💚'
                                : currentPG === 'nhn'
                                  ? '💜'
                                  : currentPG === 'kakao'
                                    ? '💛'
                                    : '🟢'}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {currentPG === 'toss'
                            ? '토스페이먼츠 결제 완료'
                            : currentPG === 'kg'
                              ? 'KG이니시스 결제 완료'
                              : currentPG === 'nhn'
                                ? 'NHN페이코 결제 완료'
                                : currentPG === 'kakao'
                                  ? '카카오페이 결제 완료'
                                  : '네이버페이 결제 완료'}
                        </h3>
                      </>
                    );
                  })()}
                  <p className="text-gray-600 mb-4">{paymentResult.message}</p>
                  {/* 결제 완료 정보 표시 - 결제 ID, 주문 ID, 금액 */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>결제 ID:</span>
                        <span className="font-medium">{paymentResult.paymentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>주문 ID:</span>
                        <span className="font-medium">{paymentResult.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>결제 금액:</span>
                        <span className="font-medium">
                          {paymentResult.amount.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-red-600">
                  {/* 결제 수단에 따른 PG사별 실패 아이콘과 색상 */}
                  {(() => {
                    const currentPG = getPGForPaymentMethod(selectedPaymentMethod);
                    return (
                      <>
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                            currentPG === 'toss'
                              ? 'bg-red-100'
                              : currentPG === 'kg'
                                ? 'bg-red-100'
                                : currentPG === 'nhn'
                                  ? 'bg-red-100'
                                  : currentPG === 'kakao'
                                    ? 'bg-red-100'
                                    : 'bg-red-100'
                          }`}
                        >
                          <span className="text-2xl">✕</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {currentPG === 'toss'
                            ? '토스페이먼츠 결제 실패'
                            : currentPG === 'kg'
                              ? 'KG이니시스 결제 실패'
                              : currentPG === 'nhn'
                                ? 'NHN페이코 결제 실패'
                                : currentPG === 'kakao'
                                  ? '카카오페이 결제 실패'
                                  : '네이버페이 결제 실패'}
                        </h3>
                      </>
                    );
                  })()}
                  <p className="text-gray-600 mb-4">{paymentResult.message}</p>
                  {paymentResult.error && (
                    <div className="bg-red-50 rounded-lg p-4 mb-4">
                      <p className="text-red-700 text-sm">{paymentResult.error}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 결제 완료/실패 시 확인 버튼 - handleClose에서 onSuccess 콜백 실행 */}
              <ButtonFillMd onClick={handleClose} className="w-full">
                {paymentResult.success ? '확인' : '다시 시도'}
              </ButtonFillMd>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
