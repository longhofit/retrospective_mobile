import AuthService from '@src/core/services/auth.service';
import { ThunkActionTypes } from '@src/core/store/thunk/types';
import { alerts } from '@src/core/utils/alerts';
import { ApiResult } from '@src/core/dataTransfer/apiResult';
import { SignUpFormData, SignUpReq } from '@src/core/models/signUp/signUp.model';

export const onThunkSignUpReq = (data: SignUpFormData,
  onSuccess: () => void,
  onError: () => void,
): ThunkActionTypes => async dispatch => {
  const authService = new AuthService();
  const signUpReq: SignUpReq = {
    username: data.username,
    password: data.password,
  };

  try {
    const res = await authService.signUp(signUpReq);
    if (res) {
      alerts.alert({ message: 'SignUp successful!', onResult: onSuccess });
    } else {
      alerts.alert({ message: res.message || res.error_message });
      onError();
    }
  } catch (e) {
    const { message }: ApiResult = e;
    onError();
    alerts.alert({ message });
  }
};
