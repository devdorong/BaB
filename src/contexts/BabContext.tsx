// 포인트 컨택스트

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type PropsWithChildren,
} from 'react';
import { createPoint, GetPoint, totalChangePoint } from '../services/PointService';
import { useAuth } from './AuthContext';

// 1. 상태관리 및 초기값
type PointState = {
  point: number;
  total: number;
  loading: boolean;
};

const initialState: PointState = {
  point: 0,
  total: 0,
  loading: false,
};

// 2. 액션 타입 정의
enum PointActionType {
  SET_LOADING = 'SET_LOADING',
  SET_POINT = 'SET_POINT',
  SET_TOTAL = 'SET_TOTAL',
  ADD_POINT = 'ADD_POINT',
  SUB_POINT = 'SUB_POINT',
  RESET = 'RESET',
}

type SetLoadingAction = { type: PointActionType.SET_LOADING; payload: boolean };
type SetPointAction = { type: PointActionType.SET_POINT; payload: number };
type SetTotalAction = { type: PointActionType.SET_TOTAL; payload: number };
type AddPointAction = { type: PointActionType.ADD_POINT; payload: number };
type SubPointAction = { type: PointActionType.SUB_POINT; payload: number };
type ResetAction = { type: PointActionType.RESET };

type PointAction =
  | SetLoadingAction
  | SetPointAction
  | SetTotalAction
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

  // 초기로딩 (포인트 가져오기)
  // 함수 참조가 매번 새로 생성되어 무한 루프를 일으키는 문제 발생, useCallback 함수 사용
  const refreshPoint = useCallback(async (): Promise<void> => {
    if (!user) {
      console.log('💰 refreshPoint - 유저 없어서 스킵');
      return;
    }

    dispatch({ type: PointActionType.SET_LOADING, payload: true });

    try {
      let result = await GetPoint();
      if (!result) {
        result = await createPoint();
      }

      dispatch({ type: PointActionType.SET_POINT, payload: result?.point ?? 0 });

      const used = await totalChangePoint();
      dispatch({ type: PointActionType.SET_TOTAL, payload: used });
    } catch (err) {
      dispatch({ type: PointActionType.SET_POINT, payload: 0 });
      dispatch({ type: PointActionType.SET_TOTAL, payload: 0 });
      console.log(err);
    } finally {
      dispatch({ type: PointActionType.SET_LOADING, payload: false });
    }
  }, [user]);

  // 로그인 상태 바뀔 때마다 포인트 갱신
  useEffect(() => {
    if (user) {
      refreshPoint();
    } else {
      dispatch({ type: PointActionType.RESET });
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
