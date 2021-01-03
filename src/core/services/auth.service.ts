import ApiService from './api.service';
import { SignInApiResult } from '../dataTransfer/auth/signIn.apiResult';
import { ApiResult } from '../dataTransfer/apiResult';
import { SignUpReq } from '../models/signUp/signUp.model';
import {SignInReq} from '../models/signUp/signInReq.model'
import {SignInGGReq} from '../models/signUp/signInGGReq.model'
import { SendOTPReq, ForgotPwReq } from '../models/signUp/forgotpwReq.model';
import { User } from '../models/user/user.model';

export default class AuthService extends ApiService {
  public signIn(data: SignInReq) {
    return this.apiPost<User>('/auth/session/signin', data, null, false);
  }

  public signUp(data: SignUpReq) {
    return this.apiPost<ApiResult>('/auth/sign-up', data, null, false);
  }

  public sendOTP(data: SendOTPReq) {
    return this.apiPost<ApiResult>('/send-recover-email', data, null, false);
  }

  public forgotPassword(data: ForgotPwReq) {
    return this.apiPost<ApiResult>('/password-recover', data, null, false);
  }

  public signInGoogle(data: SignInGGReq){
    return this.apiPost<User>('/api/me',data, null, false);
  }
}
