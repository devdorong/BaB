/**
 * PG사별 결제 서비스
 *
 * 다양한 PG사(토스페이먼츠, KG이니시스, NHN페이코, 카카오페이, 네이버페이)의
 * 모의 결제 처리를 담당하는 서비스 모듈
 *
 * 실제 운영 시에는 각 PG사의 실제 SDK로 교체 필요
 */

/**
 * 결제 요청 데이터 인터페이스
 */
export interface PaymentRequest {
  amount: number; // 결제 금액
  orderName: string; // 주문명
  customerName: string; // 고객명
  customerEmail: string; // 고객 이메일
  customerPhone: string; // 고객 전화번호
}

/**
 * 결제 응답 데이터 인터페이스
 */
export interface PaymentResponse {
  success: boolean; // 결제 성공 여부
  paymentId: string; // 결제 고유 ID
  orderId: string; // 주문 고유 ID
  amount: number; // 결제 금액
  method: string; // 결제 수단
  pgProvider: string; // PG사명
  timestamp: string; // 결제 시간 (ISO 8601)
  message?: string; // 결제 결과 메시지
  error?: string; // 오류 메시지 (실패 시)
}

/**
 * 지원하는 PG사 타입
 */
export type PGProvider = 'toss' | 'kg' | 'nhn' | 'kakao' | 'naver';

/**
 * 토스페이먼츠 모의 결제 함수
 *
 * @param data - 결제 요청 데이터
 * @returns Promise<PaymentResponse> - 결제 결과
 *
 * 특징:
 * - 처리 시간: 1.5초
 * - 성공률: 95%
 * - 실패 시 오류: 카드 정보 오류
 */
export const tossPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  // 실제 결제 처리 시간 시뮬레이션 (1.5초)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 95% 성공률로 랜덤 결과 생성
  const isSuccess = Math.random() > 0.05;

  return {
    success: isSuccess,
    paymentId: `toss_${Date.now()}`, // 토스페이먼츠 결제 ID
    orderId: `order_${Date.now()}`, // 주문 ID
    amount: data.amount, // 결제 금액
    method: 'card', // 결제 수단 (카드)
    pgProvider: 'toss', // PG사명
    timestamp: new Date().toISOString(), // 결제 시간
    message: isSuccess
      ? '토스페이먼츠 결제가 완료되었습니다.'
      : '토스페이먼츠 결제가 실패했습니다.',
    error: isSuccess ? undefined : '카드 정보가 올바르지 않습니다.',
  };
};

/**
 * KG이니시스 모의 결제 함수
 *
 * @param data - 결제 요청 데이터
 * @returns Promise<PaymentResponse> - 결제 결과
 *
 * 특징:
 * - 처리 시간: 2초
 * - 성공률: 92%
 * - 실패 시 오류: 결제 승인 실패
 */
export const kgPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  // 실제 결제 처리 시간 시뮬레이션 (2초)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 92% 성공률로 랜덤 결과 생성
  const isSuccess = Math.random() > 0.08;

  return {
    success: isSuccess,
    paymentId: `kg_${Date.now()}`, // KG이니시스 결제 ID
    orderId: `order_${Date.now()}`, // 주문 ID
    amount: data.amount, // 결제 금액
    method: 'card', // 결제 수단 (카드)
    pgProvider: 'kg', // PG사명
    timestamp: new Date().toISOString(), // 결제 시간
    message: isSuccess ? 'KG이니시스 결제가 완료되었습니다.' : 'KG이니시스 결제가 실패했습니다.',
    error: isSuccess ? undefined : '결제 승인에 실패했습니다.',
  };
};

/**
 * NHN페이코 모의 결제 함수
 *
 * @param data - 결제 요청 데이터
 * @returns Promise<PaymentResponse> - 결제 결과
 *
 * 특징:
 * - 처리 시간: 1.8초
 * - 성공률: 94%
 * - 실패 시 오류: 결제 시스템 오류
 */
export const nhnPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  // 실제 결제 처리 시간 시뮬레이션 (1.8초)
  await new Promise(resolve => setTimeout(resolve, 1800));

  // 94% 성공률로 랜덤 결과 생성
  const isSuccess = Math.random() > 0.06;

  return {
    success: isSuccess,
    paymentId: `nhn_${Date.now()}`, // NHN페이코 결제 ID
    orderId: `order_${Date.now()}`, // 주문 ID
    amount: data.amount, // 결제 금액
    method: 'card', // 결제 수단 (카드)
    pgProvider: 'nhn', // PG사명
    timestamp: new Date().toISOString(), // 결제 시간
    message: isSuccess ? 'NHN페이코 결제가 완료되었습니다.' : 'NHN페이코 결제가 실패했습니다.',
    error: isSuccess ? undefined : '결제 시스템 오류가 발생했습니다.',
  };
};

/**
 * 카카오페이 모의 결제 함수
 *
 * @param data - 결제 요청 데이터
 * @returns Promise<PaymentResponse> - 결제 결과
 *
 * 특징:
 * - 처리 시간: 1.2초 (가장 빠름)
 * - 성공률: 97% (가장 높음)
 * - 실패 시 오류: 잔액 부족
 */
export const kakaoPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  // 실제 결제 처리 시간 시뮬레이션 (1.2초)
  await new Promise(resolve => setTimeout(resolve, 1200));

  // 97% 성공률로 랜덤 결과 생성
  const isSuccess = Math.random() > 0.03;

  return {
    success: isSuccess,
    paymentId: `kakao_${Date.now()}`, // 카카오페이 결제 ID
    orderId: `order_${Date.now()}`, // 주문 ID
    amount: data.amount, // 결제 금액
    method: 'kakao', // 결제 수단 (카카오페이)
    pgProvider: 'kakao', // PG사명
    timestamp: new Date().toISOString(), // 결제 시간
    message: isSuccess ? '카카오페이 결제가 완료되었습니다.' : '카카오페이 결제가 실패했습니다.',
    error: isSuccess ? undefined : '카카오페이 잔액이 부족합니다.',
  };
};

/**
 * 네이버페이 모의 결제 함수
 *
 * @param data - 결제 요청 데이터
 * @returns Promise<PaymentResponse> - 결제 결과
 *
 * 특징:
 * - 처리 시간: 1.6초
 * - 성공률: 96%
 * - 실패 시 오류: 인증 실패
 */
export const naverPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  // 실제 결제 처리 시간 시뮬레이션 (1.6초)
  await new Promise(resolve => setTimeout(resolve, 1600));

  // 96% 성공률로 랜덤 결과 생성
  const isSuccess = Math.random() > 0.04;

  return {
    success: isSuccess,
    paymentId: `naver_${Date.now()}`, // 네이버페이 결제 ID
    orderId: `order_${Date.now()}`, // 주문 ID
    amount: data.amount, // 결제 금액
    method: 'naver', // 결제 수단 (네이버페이)
    pgProvider: 'naver', // PG사명
    timestamp: new Date().toISOString(), // 결제 시간
    message: isSuccess ? '네이버페이 결제가 완료되었습니다.' : '네이버페이 결제가 실패했습니다.',
    error: isSuccess ? undefined : '네이버페이 인증에 실패했습니다.',
  };
};

/**
 * PG사별 결제 함수 매핑 객체
 *
 * 각 PG사명을 키로 하여 해당 결제 함수를 매핑
 */
export const pgProviders = {
  toss: tossPayment, // 토스페이먼츠
  kg: kgPayment, // KG이니시스
  nhn: nhnPayment, // NHN페이코
  kakao: kakaoPayment, // 카카오페이
  naver: naverPayment, // 네이버페이
};

/**
 * 통합 결제 처리 함수
 *
 * 선택된 PG사에 따라 적절한 결제 함수를 호출하는 통합 인터페이스
 *
 * @param pgProvider - 선택된 PG사
 * @param data - 결제 요청 데이터
 * @returns Promise<PaymentResponse> - 결제 결과
 *
 * @throws Error - 지원하지 않는 PG사인 경우
 */
export const processPayment = async (
  pgProvider: PGProvider,
  data: PaymentRequest,
): Promise<PaymentResponse> => {
  // 선택된 PG사에 해당하는 결제 함수 조회
  const paymentFunction = pgProviders[pgProvider];

  // 지원하지 않는 PG사인 경우 오류 발생
  if (!paymentFunction) {
    throw new Error(`지원하지 않는 PG사입니다: ${pgProvider}`);
  }

  // 해당 PG사의 결제 함수 실행
  return await paymentFunction(data);
};
