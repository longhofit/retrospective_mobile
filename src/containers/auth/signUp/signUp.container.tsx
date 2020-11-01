import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { SignUpFormData } from '@src/core/models/signUp/signUp.model';
import { SignUp } from './signUp.component';

export const SignUpContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const navigationKey: string = 'SignUpContainer';

  const onSignUpPress = (data: SignUpFormData): void => {
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
