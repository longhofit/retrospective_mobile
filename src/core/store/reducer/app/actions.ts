import {
  SpinnerSetEnabledAction,
  SET_ENABLED_SPINNER,
} from './types';

export const onSetEnabledSpinner = (isEnabled: boolean, textSpinner?: string): SpinnerSetEnabledAction => ({
  type: SET_ENABLED_SPINNER,
  payload: {
    isEnabled,
    textSpinner,
  },
});
