import {
  SessionState,
  SessionActionTypes,
  SET_SESSION,
  CLEAR_SESSION,
} from './types';
import { Session } from '@src/core/models/session/session.model';

const initialState: SessionState = {
  loggedIn: false,
  session: new Session,
};

export const sessionReducer = (state = initialState, action: SessionActionTypes): SessionState => {
  switch (action.type) {
    case SET_SESSION: {
      return {
        session: action.payload,
        loggedIn: true,
      };
    }
    case CLEAR_SESSION: {
      return {
        ...initialState,
      };
    }
    default: {
      return state;
    }
  }
};
