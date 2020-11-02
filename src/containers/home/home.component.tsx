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
import { OtherFaceIDIcon, OtherFingerprintIcon, EvaArrowIcon } from '@src/assets/icons';
import { imageBackground1 } from '@src/assets/images';
import { textStyle } from '@src/components/textStyle';
import { pxToPercentage } from '@src/core/utils/utils';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface ComponentProps {
  name: string;
  onBackPress: () => void;
}

export type HomeProps = ComponentProps & ThemedComponentProps;

const HomeComponent: React.FunctionComponent<HomeProps> = (props) => {
  const { themedStyle } = props;

  return (
    <ImageBackground
      style={themedStyle.container}
      source={imageBackground1.imageSource}>
      <View style={themedStyle.viewHeader}>
        <View style={{
          marginTop: pxToPercentage(40), justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
          <TouchableOpacity
            onPress={props.onBackPress}
            activeOpacity={0.75}>
            {EvaArrowIcon(themedStyle.icon)}
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={themedStyle.txtHeader}>
              {'Home'}
            </Text>
          </View>
        </View>
      </View>
      <Text style={themedStyle.txtHome}>
        {`Hello ${props.name}`}
      </Text>
    </ImageBackground>
  );
};

export const Home = withStyles(HomeComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
  },
  icon: {
    width: pxToPercentage(25),
    height: pxToPercentage(25),
    tintColor: theme['color-basic-light-100'],
  },
  txtHome: {
    marginTop: pxToPercentage(20),
    marginLeft: pxToPercentage(15),
    color: theme['color-basic-dark-100'],
    fontSize: 30,
    ...textStyle.proDisplayBold,
  },
  txtHeader: {
    fontSize: pxToPercentage(18),
    color: theme['color-basic-light-100'],
    ...textStyle.proDisplayRegular,
  },
  txtSignIn: {
    color: theme['color-basic-dark-100'],
    fontSize: 20,
    ...textStyle.proTextSemibold,
  },
  viewHeader: {
    backgroundColor: theme['color-app'],
    height: pxToPercentage(70),
    width: '100%',
  },
}));
