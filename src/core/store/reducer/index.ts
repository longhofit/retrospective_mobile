import { combineReducers } from 'redux';
import { sessionReducer } from './session';
import { appReducer } from './app';

export const rootReducer = combineReducers({
  session: sessionReducer,
  app: appReducer,
});
