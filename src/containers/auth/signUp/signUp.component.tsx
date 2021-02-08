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
  pxPhone,
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
import { EmailValidator } from '@src/core/validators';
import { EvaArrowIcon } from '@src/assets/icons';
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
    <View
      style={themedStyle.container}>
      <View style={themedStyle.viewHeader}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => props.onBackPress()}
          style={{ position: 'absolute', left: pxPhone(12) }}>
          {EvaArrowIcon({ width: pxPhone(30), height: pxPhone(30), tintColor: '#324F6F' })}
        </TouchableOpacity>
        <Text style={[themedStyle.txtHeader, { color: '#324F6F' }]}>
          {'Sign up for your acccount'}
        </Text>
      </View>
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

      <View style={{ paddingHorizontal: pxToPercentage(20), width: '100%' }}>
        <SignUpForm
          style={{ marginTop: pxToPercentage(80) }}
          formData={formData}
          onDataChange={onFormDataChange} />
        <TouchableOpacity
          activeOpacity={0.75}
          style={themedStyle.viewButton}
          onPress={onSignUpButtonPress}>
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
  sectionLogo: {
    marginTop: pxToPercentage(50),
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
    color: theme['color-basic-light-100'],
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
