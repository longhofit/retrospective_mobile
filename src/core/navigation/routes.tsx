import {
  createAppContainer,
  NavigationContainer,
  createSwitchNavigator,
} from 'react-navigation';
import {
  createStackNavigator,
  StackViewTransitionConfigs,
} from 'react-navigation-stack';
import { HomeContainer } from '@src/containers/home/home.container';
import { TestContainer } from '@src/containers/test/test.container';
import { SignUpContainer } from '@src/containers/auth/signUp/signUp.container';
import SignIn from '@src/containers/auth/signIn/signIn.container';
import { BoardContainer } from '@src/containers/board/board.container';
import { ForgotPasswordContainer } from '@src/containers/auth/forgotPassword/forgotPassword.container';
import { DetailBoardContainer } from '@src/containers/DetailBoard/detail-board.container';
import { ApplicationLoaderContainer } from '@src/containers/appLoader/appLoader.container';

const HomeNavigator: NavigationContainer = createStackNavigator(
  {
    ['SignIn']: SignIn,
    ['Home']: HomeContainer,
    ['SignUp']:SignUpContainer,
    ['ForgotPassword']: ForgotPasswordContainer,
    ['Board']:BoardContainer,
    ['DetailBoard']: DetailBoardContainer,
    
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const createAppRouter = (container: NavigationContainer): NavigationContainer => {
  return createAppContainer(createSwitchNavigator(
    {
      ['AppLoader']: ApplicationLoaderContainer,
      ['App']: container,
    },
    {
      initialRouteName: 'AppLoader',
    },
  ));
};

export const Router: NavigationContainer = createAppRouter(HomeNavigator);
