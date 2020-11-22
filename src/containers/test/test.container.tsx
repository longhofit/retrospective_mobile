import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { HomeContainer } from '../home/home.container';
import { SignUpContainer } from '../auth/signUp/signUp.container';
import { ForgotPasswordContainer } from '../auth/forgotPassword/forgotPassword.container';

export const TestContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const navigationKey: string = 'TestContainer';

  return (
    <HomeContainer navigation={props.navigation} />
  );
};
