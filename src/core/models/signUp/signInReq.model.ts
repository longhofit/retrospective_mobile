export class SignInReq {
  username: string;
  password: string;
  device_code: string;
  device_name: string;
  device_type: number;
  version: string;

  constructor() {
    this.username = undefined;
    this.password = undefined;
  }
}
