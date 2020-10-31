import { ApiResult } from '../apiResult';
import { Session } from '@src/core/models/session/session.model';

export class SignInApiResult extends ApiResult {
  data: Session;
}
