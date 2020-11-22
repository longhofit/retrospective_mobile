import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import {
  isEmpty,
  pxToPercentage,
} from '@src/core/utils/utils';
import I18n from '@src/assets/i18n';
import { EmailValidator } from '@src/core/validators';
import { SendOTPData, ForgotPwFormData } from '@src/core/models/signUp/forgotpwReq.model';
import OtpInputs from 'react-native-otp-inputs';
interface ComponentProps {
  onSendOTPPress: (formData: SendOTPData) => void;
  onNewPasswordPress: (formData: ForgotPwFormData) => void;
  onBackPress: () => void;
}

export type ForgotPasswordProps = ThemedComponentProps & ComponentProps;

const ForgotPassword: React.FunctionComponent<ForgotPasswordProps> = (props) => {
  const [forgotPwFormData, setForgotPwFormData] = useState<ForgotPwFormData>({
    email: '',
    otp: '',
    newPassword: '',
  });
  const [sendOTPData, setSendOTPData] = useState<SendOTPData>({
    email: '',
  });
  const [displayButton, setDisplayButton] = useState('flex');

  const onSendOTPButton = (): void => {
    if (!EmailValidator(sendOTPData.email)) {
      Alert.alert('Invalid email!');
    } else {
      props.onSendOTPPress(sendOTPData);
      setDisplayButton('none');
    }
  };

  const onNewPasswordButton = (): void => {
    if (!EmailValidator(sendOTPData.email)) {
      Alert.alert('Invalid email!');
    } else {
      props.onSendOTPPress(sendOTPData);
      setDisplayButton('none');
    }
    if (!EmailValidator(sendOTPData.email)) {
      Alert.alert('Invalid email!');
    } else if (forgotPwFormData.otp.length < 6) {
      Alert.alert('OTP has 6 characters.')
    } else if (forgotPwFormData.newPassword.length < 6) {
      Alert.alert('Password at least 6 characters.')
    } else {
      props.onNewPasswordPress(forgotPwFormData);
    }
  };

  const onBackPress = (): void => {
    props.onBackPress();
  };

  const onEmailInputTextChange = (email: string): void => {
    setForgotPwFormData({ ...forgotPwFormData, email });
    setSendOTPData({ ...sendOTPData, email });
  };

  const onOtpInputTextChange = (otp: string): void => {
    setForgotPwFormData({ ...forgotPwFormData, otp });
  };

  const onPasswordInputTextChange = (newPassword: string): void => {
    setForgotPwFormData({ ...forgotPwFormData, newPassword });
  };


  
  return (
    <View style={styles.container}>
      <View style={styles.viewHeader}>
        <Text style={styles.txtHeader}>
          Forgot password
        </Text>
      </View>
      <View style={styles.container1}>
          <Text style={styles.text}>Email</Text>
          <TextInput
          onChangeText={onEmailInputTextChange}
          style={styles.textinput}/>
          <TouchableOpacity style={[styles.buttonSignIn, {display:'flex'}]}>
            <Text style={styles.buttontext} onPress={onSendOTPButton}>
                SEND OTP
            </Text>
          </TouchableOpacity>
          <Text style={styles.text}>OTP</Text>
          <View style={styles.inputOTP}>
              <OtpInputs
              handleChange={onOtpInputTextChange}
              numberOfInputs={6}
              />
            </View>
          <Text style={styles.text}>New Password</Text>
          <TextInput
          onChangeText={onPasswordInputTextChange}
          style={styles.textinput}
          secureTextEntry={true}
          />
          <TouchableOpacity style={styles.buttonSignIn}>
            <Text style={styles.buttontext} onPress={onNewPasswordButton}>
              NEW PASSWORD
            </Text>
          </TouchableOpacity>
      </View>
    </View>

  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    container1: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 40,
      },
    viewHeader: {
      backgroundColor: '#673ab7',
      height: pxToPercentage(70),
      width: '100%',
    },
    txtHeader: {
      marginTop: pxToPercentage(25),
      fontSize: pxToPercentage(18),
      color: 'white',
      textAlign: 'center',
    },
    textinput: {
      height: 50,
      width: '100%',
      borderBottomColor: '#676a6f',
      padding: 15,
      borderWidth: 1,
      borderRadius: 20,
      flexDirection: 'row-reverse'
    },
    inputOTP:{
        flexDirection:'row',
        borderBottomColor: '#676a6f',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    buttonSignIn: {
      marginTop: 20,
      width: '60%',
      backgroundColor: '#673ab7',
      borderRadius: 10,
      alignSelf: 'center',
    },
    text: {
      fontSize: 18,
      marginTop: 5,
      color: '#09577b',
    },
    buttontext: {
        fontSize: 18,
        margin: 10,
        textAlign: 'center',
        color: 'white',
      },
  });
  export default ForgotPassword;