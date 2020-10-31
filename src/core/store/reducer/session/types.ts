import { Session } from '@src/core/models/session/session.model';

// Describing the shape of the session's slice of state
export interface SessionState {
  loggedIn: boolean;
  session: Session;
}

// Describing the different ACTION NAMES available
export const SET_SESSION = 'SET_SESSION';
export const CLEAR_SESSION = 'CLEAR_SESSION';

export interface SessionSetAction {
  type: typeof SET_SESSION;
  payload: Session;
}

export interface SessionClearAction {
  type: typeof CLEAR_SESSION;
}

export type SessionActionTypes = SessionSetAction & SessionClearAction;
