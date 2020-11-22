import AuthService from '@src/core/services/auth.service';
import { ThunkActionTypes } from '@src/core/store/thunk/types';
import { alerts } from '@src/core/utils/alerts';
import { ApiResult } from '@src/core/dataTransfer/apiResult';
import { SendOTPData, SendOTPReq, ForgotPwFormData, ForgotPwReq } from '@src/core/models/signUp/forgotpwReq.model';

export const onThunkSendOTPReq = (data: SendOTPData,
  onSuccess: () => void,
  onError: () => void,
): ThunkActionTypes => async dispatch => {
  const authService = new AuthService();
  const sendOTPReq: SendOTPReq = {
    email: data.email,
  };

  try {
    const res = await authService.sendOTP(sendOTPReq);
    if (res) {
      alerts.alert({ message: 'Send OTP successful!', onResult: onSuccess });
    } else {
      //alerts.alert({ message: res.message || res.error_message });
      onError();
    }
  } catch (e) {
    const { message }: ApiResult = e;
    onError();
    //alerts.alert({ message });
  }
};
export const onThunkForgotPasswordReq = (data: ForgotPwFormData,
    onSuccess: () => void,
    onError: () => void,
  ): ThunkActionTypes => async dispatch => {
    const authService = new AuthService();
    const forgotPwReq: ForgotPwReq = {
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword,
    };
  
    try {
      const res = await authService.forgotPassword(forgotPwReq);
      if (res) {
        alerts.alert({ message: 'Password changed successfully!', onResult: onSuccess });
      } else {
        //alerts.alert({ message: res.message || res.error_message });
        onError();
      }
    } catch (e) {
      const { message }: ApiResult = e;
      onError();
      //alerts.alert({ message });
    }
  };

