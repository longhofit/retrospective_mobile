import {
  ClearBoardAction,
  CLEAR_BOARD,
  DeletePostAction,
  DELETE_POST,
  EDIT_POST,
  ReceiveBoardAction,
  ReceivePostAction,
  RECEIVE_BOARD,
  RECEIVE_POST,
  UpdatePostAction,
} from './types';
import {Post, Session} from '@src/core/models/type';

export const onReceivePost = (payload: Post): ReceivePostAction => ({
  type: RECEIVE_POST,
  payload,
});

export const onReceiveBoard = (payload: Session): ReceiveBoardAction => ({
  type: RECEIVE_BOARD,
  payload,
});

export const onClearBoard = (): ClearBoardAction => ({
  type: CLEAR_BOARD,
});

export const onUpdatePost = (payload: Post): UpdatePostAction => ({
  type: EDIT_POST,
  payload,
});

export const onDeletePost = (payload: Post): DeletePostAction => ({
  type: DELETE_POST,
  payload,
});
