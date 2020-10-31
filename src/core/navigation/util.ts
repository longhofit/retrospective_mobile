export interface NavigationRouteState {
  index: number;
  routes: any[];
  routeName?: string;

  params: { [key: string]: any };
}

export const onGetCurrentStateName = (state: NavigationRouteState): string => {
  return findCurrentRoute(state).routeName;
};

export const onGetCurrentRouteState = (navigation: any): NavigationRouteState => {
  return findCurrentRoute(navigation.state);
};

export const onGetCurrentRouteIndex = (navigation: any): number => {
  return navigation.state.index;
};

const findCurrentRoute = (state: NavigationRouteState): NavigationRouteState => {
  if (state.routes && state.routes.length !== 0) {
    return findCurrentRoute(state.routes[state.index]);
  }

  return state;
};

export const isRootRoute = (index: number): boolean => {
  return index !== 0;
};
