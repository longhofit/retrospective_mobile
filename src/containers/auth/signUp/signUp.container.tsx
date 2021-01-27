import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { SignUpFormData } from '@src/core/models/signUp/signUp.model';
import { SignUp } from './signUp.component';
import { onThunkSignUpReq } from './store/thunk';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';

export const SignUpContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const navigationKey: string = 'SignUpContainer';
  const dispatch: Dispatch<any> = useDispatch();

  const onSuccess = (name: string): void => {
    props.navigation.navigate({
      routeName: 'SignIn',
    })
  };

  const onError = (): void => {

  };

  const onSignUpPress = (data: SignUpFormData): void => {
    dispatch(onThunkSignUpReq(data, () => onSuccess(data.username), onError));
  };

  const onBackPress = (): void => {
    props.navigation.goBack();
  };

  return (
    <SignUp
      onSignUpPress={onSignUpPress}
      onBackPress={onBackPress}
    />
  );
};
