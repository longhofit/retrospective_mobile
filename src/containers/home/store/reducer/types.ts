import {BoardMetaData} from '@src/core/models/board/board.model';

export interface HomeState {
  boards: BoardMetaData[];
  privateBoards: BoardMetaData[];
}

export const GET_PREV_PUBLIC_BOARD = 'GET_PREV_PUBLIC_BOARD';
export const GET_PREV_PRIVATE_BOARD = 'GET_PREV_PRIVATE_BOARD';
export const CREATE_BOARD = 'CREATE_BOARD';

export interface GetPrePublicBoardAction {
  type: typeof GET_PREV_PUBLIC_BOARD;
  payload: BoardMetaData[];
}

export interface GetPrePrivateBoardAction {
  type: typeof GET_PREV_PRIVATE_BOARD;
  payload: BoardMetaData[];
}

export interface CreateBoardAction {
  type: typeof CREATE_BOARD;
  payload: BoardMetaData[];
}

export type HomeActionTypes = GetPrePublicBoardAction &
  GetPrePrivateBoardAction;
