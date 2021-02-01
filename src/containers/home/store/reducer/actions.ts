import { BoardMetaData } from '@src/core/models/board/board.model';
import {
  GET_PREV_PUBLIC_BOARD,
  GetPrePublicBoardAction,
  GET_PREV_PRIVATE_BOARD,
  GetPrePrivateBoardAction,
} from './types';

export const onGetPrevPublicBoard = (payload: BoardMetaData[]): GetPrePublicBoardAction => ({
  type: GET_PREV_PUBLIC_BOARD,
  payload,
});

export const onGetPrevPrivateBoard = (payload: BoardMetaData[]): GetPrePrivateBoardAction => ({
  type: GET_PREV_PRIVATE_BOARD,
  payload,
});
