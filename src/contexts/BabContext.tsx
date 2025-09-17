// 1. 상태관리 및 초기값
type PointState = {
  point: number;
  loading: boolean;
};

const initialState: PointState = {
  point: 0,
  loading: false,
};

// 2. 액션 타입 정의
enum PointActionType {
  SET_LOADING = 'SET_LOADING',
  SET_POINT = 'SET_POINT',
  ADD_POINT = 'ADD_POINT',
  SUB_POINT = 'SUB_POINT',
  RESET = 'RESET',
}

type SetLoadingAction = { type: PointActionType.SET_LOADING };
type SetPointAction = { type: PointActionType.SET_POINT; payload: number };
type AddPointAction = { type: PointActionType.ADD_POINT; payload: number };
type SubPointAction = { type: PointActionType.SUB_POINT; payload: number };
type ResetAction = { type: PointActionType.RESET };

type PointAction =
  | SetLoadingAction
  | SetPointAction
  | AddPointAction
  | SubPointAction
  | ResetAction;
