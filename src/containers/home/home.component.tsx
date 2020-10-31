import React from 'react';
import {
  withStyles,
  ThemeType,
  ThemedComponentProps,
} from '@kitten/theme';
import {
  View,
  Text,
  ImageBackground,
} from 'react-native';
import { OtherFaceIDIcon, OtherFingerprintIcon } from '@src/assets/icons';
import { imageBackground1 } from '@src/assets/images';
import { textStyle } from '@src/components/textStyle';

interface ComponentProps {
  example?: any;
}

export type HomeProps = ComponentProps & ThemedComponentProps;

const HomeComponent: React.FunctionComponent<HomeProps> = (props) => {
  const { themedStyle } = props;

  return (
    <ImageBackground
      style={themedStyle.container}
      source={imageBackground1.imageSource}>
      <Text style={themedStyle.txtHome}>
        {'Welcome to Retro App!!!!'}
      </Text>
      <Text style={themedStyle.txtSignIn}>
        {'Sign in with Touch ID'}
      </Text>
      {OtherFingerprintIcon(themedStyle.icon)}
    </ImageBackground>
  );
};

export const Home = withStyles(HomeComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtHome: {
    color: theme['color-basic-dark-100'],
    fontSize: 30,
    ...textStyle.proDisplayBold,
  },
  txtSignIn: {
    color: theme['color-basic-dark-100'],
    fontSize: 20,
    ...textStyle.proTextSemibold,
  },
  icon: {
    height: 50,
    width: 50,
    marginTop: 15,
  },
}));
