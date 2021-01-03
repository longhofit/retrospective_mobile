export class SignInGGFormData {
    email: string | undefined;
    googleId: string | undefined;
  }
  export class SignInGGReq {
    email: string;
    googleId: string;
  
    constructor() {
      this.email = undefined;
      this.googleId = undefined;
    }
  }
  