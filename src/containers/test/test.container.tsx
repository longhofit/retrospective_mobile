import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import SignInFormComponent from '../auth/signIn/signInForm.component';
import { HomeContainer } from '../home/home.container';

export const TestContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const navigationKey: string = 'TestContainer';

  return (
    <SignInFormComponent/>
  );
};
