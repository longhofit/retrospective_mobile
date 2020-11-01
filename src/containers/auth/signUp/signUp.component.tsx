import React, { useState } from 'react';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import {
  View,
  ImageBackground,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {
  textStyle,
} from '@src/components';
import {
  isEmpty,
  pxToPercentage,
} from '@src/core/utils/utils';
import { ImageSource, imageBackground1 } from '@src/assets/images';
import { IconElement } from '@src/assets/icons/icon.component';
import { alerts } from '@src/core/utils/alerts';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import I18n from '@src/assets/i18n';
import { SignUpFormData } from '@src/core/models/signUp/signUp.model';
import { SignupForm as SignUpForm } from './signUpForm.component';
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

  const onSingUpButtonPress = (): void => {
    console.log(formData);
    Keyboard.dismiss();

    if(!formData || isEmpty(formData.password) || isEmpty(formData.username)){
      alerts.alert({ message: 'Please enter Username and Password.' })
    } else{
      props.onSignUpPress(formData);
    }

    // if (isEmpty(formData.username)) {
    //   alerts.alert({ message: 'Please enter Username' })
    // } else if (isEmpty(formData.password)) {
    //   alerts.alert({ message: 'Please enter Password' });
    // } else {
    //   props.onSignUpPress(formData);
    // }
  };

  const onFormDataChange = (formDataParam: SignUpFormData): void => {
    console.log(formDataParam, 'check')
    setFormData(formDataParam);
  };

  const onBackPress = (): void => {
    props.onBackPress();
  };

  const { themedStyle } = props;

  return (
    <View
      style={themedStyle.container}>
      <View style={themedStyle.viewHeader}>
        <Text style={themedStyle.txtHeader}>
          {'Sign up for your acccount'}
        </Text>
      </View>
      <View style={{ paddingHorizontal: pxToPercentage(20), width: '100%' }}>
        <SignUpForm
          style={{ marginTop: pxToPercentage(200) }}
          formData={formData}
          onDataChange={onFormDataChange} />
        <TouchableOpacity
        activeOpacity={0.75}
          style={themedStyle.viewButton}
          onPress={onSingUpButtonPress}>
          <Text style={themedStyle.txtSignUp}>
            {'SIGN UP'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

export const SignUp = withStyles(SignUpComponent, (theme: ThemeType) => ({
  container: {
    alignItems: 'center',
    flex: 1,
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
