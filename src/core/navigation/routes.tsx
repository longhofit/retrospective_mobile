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

const HomeNavigator: NavigationContainer = createStackNavigator(
  {
    ['Home']: HomeContainer,
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
