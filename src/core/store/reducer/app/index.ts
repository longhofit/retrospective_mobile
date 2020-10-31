import {
  AppState,
  AppActionTypes,
  SET_ENABLED_SPINNER,
} from './types';

const initialState: AppState = {
  isEnabledSpinner: false,
  textSpinner: undefined,
};

export const appReducer = (state = initialState, action: AppActionTypes): AppState => {
  switch (action.type) {
    case SET_ENABLED_SPINNER: {
      const { isEnabled, textSpinner } = action.payload;

      return {
        ...state,
        isEnabledSpinner: isEnabled,
        textSpinner: isEnabled ? textSpinner : undefined,
      };
    }
    default: {
      return state;
    }
  }
};
