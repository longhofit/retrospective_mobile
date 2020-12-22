import { Post, Session } from "@src/core/models/type";
import { User } from "@src/core/models/user/user.model";

export interface SessionState {
  panelOpen: boolean;
  players: User[];
  session: Session | null;
}

export const TOGGLE_PANEL = 'retrospected/panel/toggle';
export const SET_PLAYERS = 'retrospected/game/players/set';
export const RENAME_SESSION = 'retrospected/game/session/rename';
export const RESET_SESSION = 'retrospected/game/session/reset';
export const RECEIVE_POST = 'retrospected/game/post/receive';
export const RECEIVE_POST_GROUP = 'retrospected/game/group/receive';
export const RECEIVE_VOTE = 'retrospected/game/post/vote/receive';
export const DELETE_POST = 'retrospected/game/post/delete';
export const UPDATE_POST = 'retrospected/game/post/update';
export const DELETE_POST_GROUP = 'retrospected/game/group/delete';
export const UPDATE_POST_GROUP = 'retrospected/game/group/update';
export const RECEIVE_BOARD = 'retrospected/game/board/receive';
export const EDIT_OPTIONS = 'retrospected/game/options/edit';
export const EDIT_COLUMNS = 'retrospected/game/columns/edit';

export interface ReceivePostAction {
  type: typeof RECEIVE_POST;
  payload: Post;
}

export interface ReceiveBoardAction {
  type: typeof RECEIVE_BOARD;
  payload: Session;
}

export type SessionActionTypes = ReceivePostAction
  & ReceiveBoardAction;