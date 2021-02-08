import React from 'react';
import {
  withStyles,
  ThemeType,
  ThemedComponentProps,
} from '@kitten/theme';
import { View } from 'react-native';
import { SignInLogo } from '../auth/signIn/signIn.component';
import { pxPhone } from '@src/core/utils/utils';

export type ApplicationLoaderProps = ThemedComponentProps;

const ApplicationLoaderComponent: React.FunctionComponent<ApplicationLoaderProps> = ({ themedStyle }) => {
  return (
    <View style={themedStyle.container}>
      <SignInLogo customStyle={{ alignSelf: 'center' }} />
    </View>
  );
};

export const ApplicationLoader = withStyles(ApplicationLoaderComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
