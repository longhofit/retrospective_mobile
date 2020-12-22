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

const HomeNavigator: NavigationContainer = createStackNavigator(
  {
    ['SignIn']: SignIn,
    ['Home']: HomeContainer,
    ['SignUp']:SignUpContainer,
    ['Board']:BoardContainer,
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
      ['Test']: TestContainer,
      ['App']: container,
    },
    {
      initialRouteName: 'App',
    },
  ));
};

export const Router: NavigationContainer = createAppRouter(HomeNavigator);
