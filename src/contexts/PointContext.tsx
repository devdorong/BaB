// 포인트 컨택스트

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type PropsWithChildren,
} from 'react';
import {
  createPoint,
  GetOrCreatePoint,
  GetPoint,
  givePoint,
  totalAddPoint,
  totalChangePoint,
} from '../services/PointService';
import { useAuth } from './AuthContext';

// 1. 상태관리 및 초기값
type PointState = {
  point: number;
  total: number;
  totaladd: number;
  loading: boolean;
};

const initialState: PointState = {
  point: 0,
  total: 0,
  totaladd: 0,
  loading: false,
};

// 2. 액션 타입 정의
enum PointActionType {
  SET_LOADING = 'SET_LOADING',
  SET_POINT = 'SET_POINT',
  SET_TOTAL = 'SET_TOTAL',
  SET_TOTAL_ADD = 'SET_TOTAL_ADD',
  ADD_POINT = 'ADD_POINT',
  SUB_POINT = 'SUB_POINT',
  RESET = 'RESET',
}

type SetLoadingAction = { type: PointActionType.SET_LOADING; payload: boolean };
type SetPointAction = { type: PointActionType.SET_POINT; payload: number };
type SetTotalAction = { type: PointActionType.SET_TOTAL; payload: number };
type SetTotalAddAction = { type: PointActionType.SET_TOTAL_ADD; payload: number };
type AddPointAction = { type: PointActionType.ADD_POINT; payload: number };
type SubPointAction = { type: PointActionType.SUB_POINT; payload: number };
type ResetAction = { type: PointActionType.RESET };

type PointAction =
  | SetLoadingAction
  | SetPointAction
  | SetTotalAction
  | SetTotalAddAction
  | AddPointAction
  | SubPointAction
  | ResetAction;

// 3. 리듀서 함수
function reducer(state: PointState, action: PointAction): PointState {
  switch (action.type) {
    case PointActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case PointActionType.SET_POINT:
      return { ...state, point: action.payload };
    case PointActionType.SET_TOTAL:
      return { ...state, total: action.payload };
    case PointActionType.SET_TOTAL_ADD:
      return { ...state, totaladd: action.payload };
    case PointActionType.ADD_POINT:
      return { ...state, point: state.point + action.payload };
    case PointActionType.SUB_POINT:
      return { ...state, point: state.point - action.payload };
    case PointActionType.RESET:
      return initialState;
    default:
      return state;
  }
}

// 4. Context 생성
type PointContextValue = {
  point: number;
  total: number;
  totaladd: number;
  loading: boolean;
  refreshPoint: () => Promise<void>;
  addPoint: (amount: number) => void;
  subPoint: (amount: number) => void;
  reset: () => void;
};

const PointContext = createContext<PointContextValue | null>(null);

// 5. Provider 생성

interface PointProviderProps {
  children?: React.ReactNode;
}
export const PointProvider = ({ children }: PointProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { user } = useAuth();
  const isRefreshing = useRef(false);

  // 초기로딩 (포인트 가져오기)
  // 함수 참조가 매번 새로 생성되어 무한 루프를 일으키는 문제 발생, useCallback 함수 사용
  const refreshPoint = useCallback(async (): Promise<void> => {
    if (!user) {
      return;
    }

    // 이미 실행 중이면 건너뛰기
    if (isRefreshing.current) {
      // console.log('이미 포인트 갱신 중입니다.');
      return;
    }

    isRefreshing.current = true;
    dispatch({ type: PointActionType.SET_LOADING, payload: true });

    try {
      // console.log('포인트 갱신 시작');

      // UPSERT 방식으로 한 번에 조회/생성
      const result = await GetOrCreatePoint();

      if (result) {
        dispatch({ type: PointActionType.SET_POINT, payload: result.point });
        // console.log('포인트 설정 완료:', result.point);
      } else {
        dispatch({ type: PointActionType.SET_POINT, payload: 0 });
      }

      const used = await totalChangePoint();
      dispatch({ type: PointActionType.SET_TOTAL, payload: used });
      const addused = await totalAddPoint();
      dispatch({ type: PointActionType.SET_TOTAL_ADD, payload: addused });
    } catch (err) {
      console.error('포인트 갱신 실패:', err);
      dispatch({ type: PointActionType.SET_POINT, payload: 0 });
      dispatch({ type: PointActionType.SET_TOTAL, payload: 0 });
      dispatch({ type: PointActionType.SET_TOTAL_ADD, payload: 0 });
    } finally {
      dispatch({ type: PointActionType.SET_LOADING, payload: false });
      isRefreshing.current = false;
    }
  }, [user]);

  // 로그인 상태 바뀔 때마다 포인트 갱신
  useEffect(() => {
    if (user) {
      (async () => {
        // 매일 출석 포인트 적립 후 최신 값 반영
        await givePoint();
        await refreshPoint();
      })(); // 함수 즉시 실행
    } else {
      dispatch({ type: PointActionType.RESET });
      isRefreshing.current = false;
    }
  }, [user, refreshPoint]);

  // 포인트 추가
  const addPoint = (amount: number) => {
    dispatch({ type: PointActionType.ADD_POINT, payload: amount });
  };

  // 포인트 사용
  const subPoint = (amount: number) => {
    dispatch({ type: PointActionType.SUB_POINT, payload: amount });
  };

  // 포인트 초기화
  const reset = () => {
    dispatch({ type: PointActionType.RESET });
  };

  const value: PointContextValue = {
    point: state.point,
    total: state.total,
    totaladd: state.totaladd,
    loading: state.loading,
    refreshPoint,
    addPoint,
    subPoint,
    reset,
  };

  return <PointContext.Provider value={value}>{children}</PointContext.Provider>;
};

// 6. 커스텀 훅

export function usePoint(): PointContextValue {
  const ctx = useContext(PointContext);
  if (!ctx) {
    throw new Error('컨텍스트 없어용');
  }
  return ctx;
}
