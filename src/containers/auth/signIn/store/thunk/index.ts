import AuthService from '@src/core/services/auth.service';
import { ThunkActionTypes } from '@src/core/store/thunk/types';
import { alerts } from '@src/core/utils/alerts';
import { ApiResult } from '@src/core/dataTransfer/apiResult';
import { SignInFormData, SignInReq } from '@src/core/models/signUp/signInReq.model';

export const onThunkSignInReq = (data: SignInFormData,
  onSuccess: () => void,
  onError: () => void,
): ThunkActionTypes => async dispatch => {
  const authService = new AuthService();
  const signInReq: SignInReq = {
    username: data.username,
    password: data.password,
  };
  try {
    const res = await authService.signIn(signInReq);
    if (res) {
      alerts.alert({ message: 'Login successful!', onResult: onSuccess });
    } else {
      alerts.alert({ message: res.message || res.error_message });
      onError();
    }
  } catch (e) {
    const { message }: ApiResult = e;
    onError();
  }
};
