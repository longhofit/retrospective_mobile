import { BoardMetaData } from '@src/core/models/board/board.model';
import {
  GET_PREV_PUBLIC_BOARD,
  GetPrePublicBoardAction,
} from './types';

export const onGetPrevPublicBoard = (payload: BoardMetaData[]): GetPrePublicBoardAction => ({
  type: GET_PREV_PUBLIC_BOARD,
  payload,
});
