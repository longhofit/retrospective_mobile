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

const HomeNavigator: NavigationContainer = createStackNavigator(
  {
    ['SignUp']:SignUpContainer,
    ['Home']: HomeContainer,
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
