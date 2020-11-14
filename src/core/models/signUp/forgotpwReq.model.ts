export class SendOTPData {
    email: string | undefined;
}

export class SendOTPReq {
    email: string;
}

export class ForgotPwFormData {
    email: string | undefined;
    otp: string | undefined;
    newPassword: string | undefined;
}

export class ForgotPwReq {
    email: string;
    otp: string;
    newPassword: string;
}