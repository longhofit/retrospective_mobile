import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { Home } from './home.component';

export const HomeContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const navigationKey: string = 'HomeContainer';
  const name: string = props.navigation.getParam('name');

  const onBackPress = (): void => {
    props.navigation.goBack();
  };

  return (
    <Home
      onBackPress={onBackPress}
      name={name} />
  );
};
