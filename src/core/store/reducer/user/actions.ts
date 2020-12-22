import {
  SET_USER,
  SetUserAction,
  SetLoggedInAction,
  SET_LOGGED_IN,
} from './types';
import { User as UserModel } from '@src/core/models/user/user.model';

export const onSetUser = (payload: UserModel): SetUserAction => ({
  type: SET_USER,
  payload,
});

export const onSetLoggedIn = (userID: string): SetLoggedInAction => ({
  type: SET_LOGGED_IN,
  userID,
});
