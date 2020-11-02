import React, {
  useState,
  useEffect,
} from 'react';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import {
  View,
  Text,
  ViewProps,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { textStyle } from '@src/components';
import {
  isEmpty,
  pxToPercentage,
} from '@src/core/utils/utils';
import { usePrevious } from '@src/core/utils/hookHelper';
import I18n from '@src/assets/i18n';
import { SignUpFormData } from '@src/core/models/signUp/signUp.model';
import { InputItem } from '@src/components/input/inputItem.component';

interface ComponentProps {
  formData: SignUpFormData;
  onDataChange: (value: SignUpFormData | undefined) => void;
}

export type SignupFormProps = ThemedComponentProps & ViewProps & ComponentProps;

const SignupFormComponent: React.FunctionComponent<SignupFormProps> = (props) => {
  const [signUpFormData, setSignUpFormData] = useState<SignUpFormData>({
    username: '',
    password: '',
  });

  let prevState: SignUpFormData = usePrevious(signUpFormData);

  if (!prevState) {
    prevState = { ...signUpFormData };
  }

  useEffect(() => {
    if (props.formData && props.formData !== signUpFormData) {
      setSignUpFormData({ ...props.formData });
    }
  }, [props.formData]);

  useEffect(() => {
    const oldFormValid: boolean = isValid(prevState);
    const newFormValid: boolean = isValid(signUpFormData);

    const isStateChanged: boolean = prevState !== signUpFormData;
    const becomeValid: boolean = !oldFormValid && newFormValid;
    const becomeInvalid: boolean = oldFormValid && !newFormValid;
    const remainValid: boolean = oldFormValid && newFormValid;

    if (becomeValid) {
      props.onDataChange(signUpFormData);
    } else if (becomeInvalid) {
      props.onDataChange(undefined);
    } else if (isStateChanged && remainValid) {
      props.onDataChange(signUpFormData);
    }
  });

  const onUsernameInputTextChange = (username: string): void => {
    setSignUpFormData({ ...signUpFormData, username });
  };

  const onPasswordnputTextChange = (password: string): void => {
    setSignUpFormData({ ...signUpFormData, password });
  };

  const isValid = (value: SignUpFormData): boolean => {
    return !isEmpty(value.username) &&
      !isEmpty(value.password);
  };

  const { style, themedStyle, ...restProps } = props;

  return (

    <View
      style={[
        themedStyle.container,
        style,
      ]}
      {...restProps}>
      <InputItem
        keyboardType={'email-address'}
        autoFocus={true}
        placeholder={'Enter email'}
        title={'Email'}
        inputContainerStyle={themedStyle.viewInput}
        onInputTextChange={onUsernameInputTextChange} />
      <InputItem
        secureTextEntry={true}
        placeholder={'Enter password'}
        title={'Password'}
        inputContainerStyle={[themedStyle.viewInput, { marginTop: pxToPercentage(12) }]}
        onInputTextChange={onPasswordnputTextChange} />
    </View>
  );
};

export const SignupForm = withStyles(SignupFormComponent, (theme: ThemeType) => ({
  container: {

  },
  txtPlaceholder: {
    color: theme['color-basic-dark-100'],
    fontSize: 30,
    ...textStyle.proDisplayRegular,
  },
  viewInput: {
    height: pxToPercentage(40),
  }
}));
