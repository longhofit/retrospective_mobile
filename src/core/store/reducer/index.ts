import { combineReducers } from 'redux';
import { sessionReducer } from './session';
import { appReducer } from './app';
import { userReducer } from './user';
import { homeReducer } from '@src/containers/home/store/reducer';

export const rootReducer = combineReducers({
  session: sessionReducer,
  app: appReducer,
  user: userReducer,
  home:homeReducer,
});
