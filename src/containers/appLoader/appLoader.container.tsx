import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationActions, NavigationInjectedProps, StackActions } from 'react-navigation';
import { AppState, store } from '@src/core/store';
import { ApplicationLoader } from './appLoader.component';
import { SessionState } from '@src/core/store/reducer/session/types';
import I18n from '@src/assets/i18n';
import { Linking } from 'react-native';
import { Dispatch } from 'redux';

export const ApplicationLoaderContainer: React.FunctionComponent<NavigationInjectedProps> = props => {
  const navigationKey: string = 'ApplicationLoaderContainer';
  const dispatch: Dispatch<any> = useDispatch();
  const sessionReducer: SessionState = useSelector((state: AppState) => state.session);
  const fromLogout: boolean | undefined = props.navigation.getParam('fromLogout');


  useEffect(() => {
    const loadingTime: NodeJS.Timeout = setTimeout(() => {
      onNavigateToSignInScreen();

    }, 2000);

    return () => {
      clearTimeout(loadingTime);
    };
  }, []);

  const onLoadSuccess = (): void => {
    const routeName: string = 'SignIn';

    props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName })],
      }),
    );
  };



  const onNavigateToSignInScreen = (): void => {
    props.navigation.navigate({
      key: navigationKey,
      routeName: 'SignIn',
    });
  };

  const onLoadError = (error: Error): void => {
    // code...
  };

  return <ApplicationLoader />;
};
