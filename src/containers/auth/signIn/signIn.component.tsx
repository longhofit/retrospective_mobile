import React from 'react';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import {
  textStyle,
} from '@src/components';
import {
  pxPhone,
  pxToPercentage,
} from '@src/core/utils/utils';


export type SignInProps = ThemedComponentProps

const SignInComponent: React.FunctionComponent<SignInProps> = (props) => {

  const { themedStyle } = props;

  return (
    <ScrollView contentContainerStyle={themedStyle.container}>
      <View style={themedStyle.sectionLogo}>
        <View style={[themedStyle.viewLogo, { overflow: 'hidden' }]}>
          <Text style={themedStyle.txtLogo}>
            {'F'}
          </Text>
          <View style={[{
            backgroundColor: 'orange',
            width: pxToPercentage(35),
            height: pxToPercentage(35),
            position: 'absolute',
            alignSelf: 'flex-start',
            left: pxToPercentage(-20),
            top: pxToPercentage(-20),
          },
          {
            transform: [{ rotate: "-45deg" }]
          }
          ]} />
        </View>
        <Text style={[
          themedStyle.txtLogo,
          themedStyle.txtLogo2,
        ]}>
          {'Retro'}
        </Text>
      </View>
    </ScrollView>
  );
};

export const SignInLogo = withStyles(SignInComponent, (theme: ThemeType) => ({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  sectionLogo: {
    flexDirection: 'row',
  },
  viewLogo: {
    flexDirection: 'row',
    width: pxToPercentage(60),
    backgroundColor: theme['color-green-1'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtLogo: {
    ...textStyle.proDisplayBlackItalic,
    color: '#324F6F',
    fontSize: pxToPercentage(60),
  },
  txtLogo2: {
    marginLeft: pxToPercentage(2),
    color: theme['color-green-1'],
    fontSize: pxToPercentage(55),
  },
  viewHeader: {
    flexDirection: 'row',
    width: '100%',
    height: pxPhone(70),
    backgroundColor: theme['color-green-1'],
    // shadow ios
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    // shadow android
    elevation: 8,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: pxPhone(12),
  },
  sectionContainer: {
    flex: 1,
    paddingHorizontal: pxToPercentage(16),
  },
  sectionUserInfo: {
    marginTop: pxToPercentage(5),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  txtHeader: {
    color: theme['color-basic-dark-100'],
    ...textStyle.proTextBold,
    fontSize: pxPhone(20),
    marginLeft: pxPhone(12),
  },
  txtPhoneNumber: {
    marginTop: pxToPercentage(9.2),
    fontSize: pxToPercentage(20),
    lineHeight: pxToPercentage(24),
    color: theme['color-basic-light-200'],
    ...textStyle.proTextSemibold,
  },
  sectionNotification: {
    marginTop: pxToPercentage(20),
    justifyContent: 'flex-end',
    paddingHorizontal: pxToPercentage(18.5),
  },
  txtNotification: {
    fontSize: pxToPercentage(15),
    lineHeight: pxToPercentage(18),
    color: theme['color-basic-light-200'],
    ...textStyle.proTextMedium,
  },
  sectionForm: {
    alignSelf: 'center',
    paddingTop: pxToPercentage(11),
    // paddingHorizontal: pxToPercentage(18.5),
  },
  btnChangePassword: {
    alignSelf: 'center',
    width: pxToPercentage(296),
    marginTop: pxToPercentage(35),
  },
  txtSignUp: {
    lineHeight: pxToPercentage(25),
    ...textStyle.proTextBold,
    color: theme['color-basic-light-100'],
  },
  txtNote: {
    textAlign: 'center',
    marginTop: pxToPercentage(25),
    fontSize: pxToPercentage(14),
    lineHeight: pxToPercentage(18),
    color: theme['color-basic-light-200'],
    ...textStyle.proTextLightItalic,
  },
  iconArrowsBack: {
    width: pxToPercentage(10),
    height: pxToPercentage(10) * (20.5 / 12),
    tintColor: theme['color-basic-light-100'],
  },
  txtHeaderLeft: {
    color: theme['color-basic-light-100'],
  },
  viewButton: {
    borderRadius: pxToPercentage(9),
    marginTop: pxToPercentage(20),
    backgroundColor: theme['color-green-1'],
    height: pxToPercentage(40),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
