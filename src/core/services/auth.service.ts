import ApiService from './api.service';
import { SignInApiResult } from '../dataTransfer/auth/signIn.apiResult';
import { ApiResult } from '../dataTransfer/apiResult';
import { SignUpReq } from '../models/signUp/signUp.model';
import {SignInReq} from '../models/signUp/signInReq.model'

export default class AuthService extends ApiService {
  public signIn(data: SignInReq) {
    return this.apiPost<SignInApiResult>('/session/signin', data, null, false);
  }

  public signUp(data: SignUpReq) {
    return this.apiPost<ApiResult>('/sign-up', data, null, false);
  }
}
