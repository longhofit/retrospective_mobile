import { User } from '@src/core/models/user/user.model';

// Describing the different ACTION NAMES available
export const SET_USER = 'SET_USER';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_LOGGED_OUT = 'SET_LOGGED_OUT';

export interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
}

export interface SetLoggedInAction {
  type: typeof SET_LOGGED_IN;
  userID: string;
}

export interface SetLoggedOutAction {
  type: typeof SET_LOGGED_OUT;
}

export type UserActionTypes = SetUserAction &
  SetLoggedOutAction &
  SetLoggedInAction;
