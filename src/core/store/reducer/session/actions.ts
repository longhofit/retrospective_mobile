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
  SET_PLAYERS,
  SetPlayersAction,
  SetVoteAction,
  RECEIVE_VOTE,
  RECEIVE_POST_GROUP,
  RECEIVE_POSTGROUP,
  ReceivePostGroupAction,
  UpdatePostGroupAction,
  UPDATE_POST_GROUP,
  DeletePostGroupAction,
  DELETE_POST_GROUP,
} from './types';
import {Post, PostGroup, Session} from '@src/core/models/type';

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

export const onSetPlayers = (payload: string[]): SetPlayersAction => ({
  type: SET_PLAYERS,
  payload,
});

export const onReceiveVote = (payload: any): SetVoteAction => ({
  type: RECEIVE_VOTE,
  payload,
});

export const onReceivePostGroup = (payload: PostGroup): ReceivePostGroupAction => ({
  type: RECEIVE_POSTGROUP,
  payload,
});

export const onUpdatePostGroup = (payload: PostGroup): UpdatePostGroupAction => ({
  type: UPDATE_POST_GROUP,
  payload,
});

export const onDeletePostGroupSuccess = (payload: PostGroup): DeletePostGroupAction => ({
  type: DELETE_POST_GROUP,
  payload,
});
