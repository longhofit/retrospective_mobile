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

const HomeNavigator: NavigationContainer = createStackNavigator(
  {
    ['SignUp']:SignUpContainer,
    ['Home']: HomeContainer,
    ['SignIn']: SignIn,
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
      initialRouteName: 'Test',
    },
  ));
};

export const Router: NavigationContainer = createAppRouter(HomeNavigator);
