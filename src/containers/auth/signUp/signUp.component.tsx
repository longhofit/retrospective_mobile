import React, { useState } from 'react';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  textStyle,
} from '@src/components';
import {
  isEmpty,
  pxToPercentage,
} from '@src/core/utils/utils';
import { WebView } from 'react-native-webview';
import { alerts } from '@src/core/utils/alerts';
import { SignUpFormData } from '@src/core/models/signUp/signUp.model';
import { SignupForm as SignUpForm } from './signUpForm.component';
import { EmailValidator } from '@src/core/validators';
interface ComponentProps {
  onSignUpPress: (formData: SignUpFormData) => void;
  onBackPress: () => void;
}

export type SignUpProps = ThemedComponentProps & ComponentProps;

const SignUpComponent: React.FunctionComponent<SignUpProps> = (props) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    password: '',
  });

  const onSignUpButtonPress = (): void => {
    Keyboard.dismiss();

    if (!formData || isEmpty(formData.password) || isEmpty(formData.username)) {
      alerts.alert({ message: 'Please enter Username and Password.' })
    } else if (formData.username.length < 6 || formData.password.length < 6) {
      alerts.alert({ message: 'Password and Username at least 6 characters.' })
    } else if (!EmailValidator(formData.username)) {
      alerts.alert({ message: 'Invalid email!' })
    } else {
      props.onSignUpPress(formData);
    }
  };

  const onFormDataChange = (formDataParam: SignUpFormData): void => {
    setFormData(formDataParam);
  };

  const onBackPress = (): void => {
    props.onBackPress();
  };

  const { themedStyle } = props;

  return (
    <SafeAreaView style={themedStyle.container}>
      <WebView source={{ uri: 'http://115.78.232.219:3000/' }} />
    </SafeAreaView>
  );
};

export const SignUp = withStyles(SignUpComponent, (theme: ThemeType) => ({
  container: {
  //  alignItems: 'center',
    flex: 1,
  },
  sectionLogo: {
    marginTop: pxToPercentage(150),
    flexDirection: 'row',
  },
  viewLogo: {
    flexDirection: 'row',
    width: pxToPercentage(60),
    backgroundColor: theme['color-app'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtLogo: {
    ...textStyle.proDisplayBlackItalic,
    color: theme['color-basic-light-100'],
    fontSize: pxToPercentage(60),
  },
  txtLogo2: {
    marginLeft: pxToPercentage(2),
    color: theme['color-app'],
    fontSize: pxToPercentage(55),
  },
  viewHeader: {
    backgroundColor: theme['color-app'],
    height: pxToPercentage(70),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: pxToPercentage(25),
    fontSize: pxToPercentage(18),
    color: theme['color-basic-light-100'],
    ...textStyle.proDisplayRegular,
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
    backgroundColor: theme['color-app'],
    height: pxToPercentage(40),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
