import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { Home } from './home.component';

export const HomeContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const navigationKey: string = 'HomeContainer';

  return (
    <Home />
  );
};
