import {
  UserActionTypes,
  SET_USER,
  SET_LOGGED_OUT,
  SET_LOGGED_IN,
} from './types';
import { User } from '@src/core/models/user/user.model';

export class UserState {
  loggedIn: boolean;
  user: User;
}

const initialState: UserState = {
  loggedIn: false,
  user: null,
};

export const userReducer = (state = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case SET_USER: {
      const userPayload: User = action.payload;

      return {
        loggedIn: true,
        user: userPayload,
      }
    }
    case SET_LOGGED_IN: {

    }
    case SET_LOGGED_OUT: {

    }
    
    default:
      return state;
  };
};
