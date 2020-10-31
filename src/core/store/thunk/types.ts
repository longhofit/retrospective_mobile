import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '@src/core/store';

export type ThunkActionTypes = ThunkAction<void, AppState, null, Action<string>>;
