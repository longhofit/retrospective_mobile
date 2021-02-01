import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { Dispatch } from 'redux';
import { AppState } from '@src/core/store';
import { useDispatch } from 'react-redux';
import { Payment } from './payment.component';
import { UserState } from '@src/core/store/reducer/user';
import { useSelector } from 'react-redux';
export const PaymentContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const { user }: UserState = useSelector((state: AppState) => state.user);
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
        user={user}
    />
  );
};
// onSignUpPress={onSignUpPress}
// onBackPress={onBackPress}