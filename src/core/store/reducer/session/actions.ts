import {
  SET_SESSION,
  SessionSetAction,
  SessionClearAction,
  CLEAR_SESSION,
} from './types';
import { Session } from '@src/core/models/session/session.model';

export const onSetSession = (payload: Session): SessionSetAction => ({
  type: SET_SESSION,
  payload,
});

export const onClearSession = (): SessionClearAction => ({
  type: CLEAR_SESSION,
});
