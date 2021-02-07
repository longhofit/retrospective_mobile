import AuthService from '@src/core/services/auth.service';
import { ThunkActionTypes } from '@src/core/store/thunk/types';
import { alerts } from '@src/core/utils/alerts';
import { ApiResult } from '@src/core/dataTransfer/apiResult';
import { SignInFormData, SignInReq } from '@src/core/models/signUp/signInReq.model';
import { onSetUser } from '@src/core/store/reducer/user/actions';
import { User } from '@src/core/models/user/user.model';

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
    const res: User = await authService.signIn(signInReq);
    if (res) {
      dispatch(onSetUser(res))
      alerts.alert({ message: 'Login successfully!', onResult: onSuccess });
    } else {
      alerts.alert({ message: 'Login no successfully' });
      onError();
    }
  } catch (e) {
    const { message }: ApiResult = e;
    onError();
  }
};

export const onThunkAnoSignInReq = (data: SignInFormData,
  onSuccess: () => void,
  onError: () => void,
): ThunkActionTypes => async dispatch => {
  const authService = new AuthService();
  const signInReq: SignInReq = {
    username: data.username,
    password: data.password,
  };
  try {
    const res: User = await authService.anoSignIn(signInReq);
    if (res) {
      dispatch(onSetUser(res))
      alerts.alert({ message: 'Login successfully!', onResult: onSuccess });
    } else {
      alerts.alert({ message: 'Login no successfully' });
      onError();
    }
  } catch (e) {
    const { message }: ApiResult = e;
    onError();
  }
};
