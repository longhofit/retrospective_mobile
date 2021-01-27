import React, {useState} from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { SendOTPData, ForgotPwFormData } from '@src/core/models/signUp/forgotpwReq.model';
import { onThunkSendOTPReq, onThunkForgotPasswordReq } from './store/thunk';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import ForgotPassword from './forgotPassword.component';

export const ForgotPasswordContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const navigationKey: string = 'ForgotPassword';
  const dispatch: Dispatch<any> = useDispatch();
  const [valueReturnSendOTP, setValueReturnSendOTP] = useState(false);

  const onSuccess = (): void => {
    setValueReturnSendOTP(true);
    console.log("valueReturnSendOTPSuccess:",valueReturnSendOTP);
  };

  const onError = (): void => {
    Alert.alert("Email does not exist");
    setValueReturnSendOTP(false);
    console.log("valueReturnSendOTPError:",valueReturnSendOTP);
  };

  const onSuccessFPW = (): void => {
    props.navigation.navigate({
        routeName: 'SignIn',
        key: navigationKey,
        params: {
        },
      })
  };

  const onErrorFPW = (): void => {
    Alert.alert("OTP code incorrect");
  };

  const onSendOTPPress = (data: SendOTPData): boolean => {
    dispatch(onThunkSendOTPReq(data, () => onSuccess(), onError));
    return valueReturnSendOTP;
  };
  const onNewPasswordPress = (data: ForgotPwFormData): void => {
    dispatch(onThunkForgotPasswordReq(data, () => onSuccessFPW(), onErrorFPW));
  };
  const onBackPress = (): void => {
    props.navigation.goBack();
  };

  return (
    <ForgotPassword
      onSendOTPPress={onSendOTPPress}
      onNewPasswordPress={onNewPasswordPress}
      onBackPress={onBackPress}
    />
  );
};
