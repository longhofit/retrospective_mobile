import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { Payment } from './payment.component';

export const PaymentContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const navigationKey: string = 'Payment';
  const dispatch: Dispatch<any> = useDispatch();

  const onSuccess = (name: string): void => {
    props.navigation.navigate({
      routeName: 'SignIn',
    })
  };

  const onError = (): void => {

  };

  const onProAccountPress = (): void => {
    
  };

  const onPlusAccountPress = (): void => {
    props.navigation.goBack();
  };

  return (
    <Payment
        onPlusAccountPress={onPlusAccountPress}
        onProAccountPress={onProAccountPress}
    />
  );
};
// onSignUpPress={onSignUpPress}
// onBackPress={onBackPress}