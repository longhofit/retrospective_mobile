import { BoardMetaData } from "@src/core/models/board/board.model";

export interface HomeState {
  boards: BoardMetaData[];
}

export const GET_PREV_PUBLIC_BOARD = 'GET_PREV_PUBLIC_BOARD';

export interface GetPrePublicBoardAction {
  type: typeof GET_PREV_PUBLIC_BOARD;
  payload: BoardMetaData[];
}

export type HomeActionTypes = GetPrePublicBoardAction;