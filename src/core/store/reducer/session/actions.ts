import {
  ReceiveBoardAction,
  ReceivePostAction,
  RECEIVE_BOARD,
  RECEIVE_POST,
} from './types';
import { Post, Session } from '@src/core/models/type';

export const onReceivePost = (payload: Post): ReceivePostAction => ({
  type: RECEIVE_POST,
  payload,
});

export const onReceiveBoard = (payload: Session): ReceiveBoardAction => ({
  type: RECEIVE_BOARD,
  payload,
});

