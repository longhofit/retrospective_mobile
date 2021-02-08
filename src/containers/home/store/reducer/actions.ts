import { BoardMetaData } from '@src/core/models/board/board.model';
import {
  GET_PREV_PUBLIC_BOARD,
  GetPrePublicBoardAction,
  GET_PREV_PRIVATE_BOARD,
  GetPrePrivateBoardAction,
  ClearBoardsAction,
  CLEAR_BOARDS,
} from './types';

export const onGetPrevPublicBoard = (payload: BoardMetaData[]): GetPrePublicBoardAction => ({
  type: GET_PREV_PUBLIC_BOARD,
  payload,
});

export const onGetPrevPrivateBoard = (payload: BoardMetaData[]): GetPrePrivateBoardAction => ({
  type: GET_PREV_PRIVATE_BOARD,
  payload,
});

export const onClearBoards = (): ClearBoardsAction => ({
  type: CLEAR_BOARDS,
});

