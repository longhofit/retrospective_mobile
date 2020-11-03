export class SignInFormData {
  username: string | undefined;
  password: string | undefined;
}
export class SignInReq {
  username: string;
  password: string;

  constructor() {
    this.username = undefined;
    this.password = undefined;
  }
}
