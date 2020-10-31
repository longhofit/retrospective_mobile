// Describing the shape of the app's slice of state
export interface AppState {
  isEnabledSpinner: boolean;
  textSpinner: string;
}

export interface SpinnerPayload {
  isEnabled: boolean;
  textSpinner?: string;
}

// Describing the different ACTION NAMES available
export const SET_ENABLED_SPINNER = 'SET_ENABLED_SPINNER';

export interface SpinnerSetEnabledAction {
  type: typeof SET_ENABLED_SPINNER;
  payload: SpinnerPayload;
}

export type AppActionTypes = SpinnerSetEnabledAction;
