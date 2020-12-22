import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { HomeContainer } from '../home/home.container';
import { SignUpContainer } from '../auth/signUp/signUp.container';
import { ForgotPasswordContainer } from '../auth/forgotPassword/forgotPassword.container';
import { SignIn } from '../auth/signIn/signIn.container';

export const TestContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const navigationKey: string = 'TestContainer';

  return (
    <SignIn navigation={props.navigation} />
  );
};
