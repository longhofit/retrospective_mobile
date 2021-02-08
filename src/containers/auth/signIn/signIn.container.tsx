import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import {
  textStyle,
} from '@src/components';
import {
  isEmpty,
  pxPhone,
  pxToPercentage,
} from '@src/core/utils/utils';
import { SignInFormData } from '@src/core/models/signUp/signInReq.model';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { onThunkAnoSignInReq, onThunkSignInReq } from './store/thunk';
import { NavigationInjectedProps } from 'react-navigation';
import { onSetUser } from '@src/core/store/reducer/user/actions';
import { SignInLogo } from './signIn.component';
import { InputItem } from '@src/components/input/inputItem.component';
export const SignIn: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const navigationKey: string = 'SignInContainer';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signInFormData, setSignInFormData] = useState<SignInFormData>({
    username: '',
    password: '',
  });
  const dispatch: Dispatch<any> = useDispatch();

  const hasErrorEmail = () => {
    return signInFormData.username.trim() == '';
  };
  const hasErrorPassword = () => {
    return signInFormData.password.trim() == '';
  };
  const hasName = () => {
    return name.trim() == '';
  };
  const onSuccess = (): void => {
    props.navigation.navigate({
      routeName: 'Home',
      key: navigationKey,
      params: {
        sessionId: '124',
      }
    })
  };
  const onError = (): void => {
    Alert.alert('Username or password incorrect');
  };

  // dispatch(onThunkSignInReq(signInFormData, onSuccess, onError));

  const onSignInPress = (): void => {
    dispatch(onThunkSignInReq(signInFormData, onSuccess, onError));
  };

  const onPressButton = () => {
    if (hasErrorEmail()) {
      Alert.alert('Username is empty');
    }
    else if (hasErrorPassword()) {
      Alert.alert('Password is empty');
    }
    else {
      onSignInPress();
    }
  };
  const onSingUpPress = (): void => {
    props.navigation.navigate({
      routeName: 'SignUp',
    })
  }
  const onForgotPasswordPress = (): void => {
    props.navigation.navigate({
      routeName: 'ForgotPassword',
    })
  }

  const onAnoSignInPress = (): void => {
    dispatch(onThunkAnoSignInReq({ username: name, password: 'none' }, onSuccess, onError))
  }

  return (
    <ScrollView style={styles.container}>
      <ScrollView style={styles.container1}>
        <SignInLogo />
        <InputItem
          style={{ ...textStyle.proTextRegular }}
          titleColor={{ backgroundColor: 'white' }}
          title={'Username'}
          placeholder={'Username'}
          inputContainerStyle={{ height: pxToPercentage(40), marginTop: pxPhone(60), }}
          value={signInFormData.username}
          onInputTextChange={(username) => {
            setSignInFormData({ ...signInFormData, username });
          }} />
        <InputItem
          secureTextEntry={true}
          style={{ ...textStyle.proTextRegular }}
          titleColor={{ backgroundColor: 'white' }}
          title={'Password'}
          placeholder={'Password'}
          inputContainerStyle={{ height: pxToPercentage(40), marginTop: pxPhone(25) }}
          value={signInFormData.password}
          onInputTextChange={(password) => {
            setSignInFormData({ ...signInFormData, password });
          }} />
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onPressButton}
          style={styles.buttonSignIn}>
          <Text style={styles.buttontext}>
            SIGN IN
          </Text>
        </TouchableOpacity>
        <Text style={styles.text1} onPress={onForgotPasswordPress}>
          FORGOT PASSWORD?
        </Text>
        <Text style={styles.text1} onPress={onSingUpPress}>
          SIGN UP FREE
        </Text>
        <View style={styles.containerAnonymous}>
          <Text style={styles.header1}>Anonymous Login</Text>
          <View style={{ padding: pxPhone(12), borderRadius: pxPhone(5), backgroundColor: '#e8f4fd',marginTop:pxPhone(12) }}>
            <Text >This will create an anonymous account. Some features won't be available.</Text>
          </View>
          <TextInput
            style={styles.textinputAno}
            placeholder='please enter a name or nickname here'
            value={name}
            onChangeText={(name) => setName(name)}
          />
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onAnoSignInPress}
            style={styles.buttonAno} disabled={hasName()}>
            <Text>
              LET'S START
          </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    paddingVertical: pxPhone(60),
    paddingHorizontal: pxPhone(30),
  },
  containerAnonymous: {
    marginTop: pxPhone(8),
  },
  viewHeader: {
    flexDirection: 'row',
    width: '100%',
    height: pxPhone(70),
    backgroundColor: '#8FDA97',
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
  txtHeader: {
    color: '#324F6F',
    textAlign: 'center',
    fontStyle: 'normal',
    fontSize: pxPhone(20),
  },
  textinput: {
    height: 50,
    width: '100%',
    borderBottomColor: '#676a6f',
    padding: 15,
    borderColor: 'gray',
    borderWidth: pxPhone(1),
    borderRadius: 20,
  },
  textinputAno: {
    height: 50,
    padding: 15,
    margin: pxPhone(3),
    borderWidth: 1,
    borderColor: 'white',
    borderBottomColor: '#8FDA97',
  },
  buttonSignIn: {
    marginTop: pxPhone(20),
    width: '60%',
    backgroundColor: '#8FDA97',
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonAno: {
    marginRight: 10,
    padding: pxPhone(12),
    alignSelf: 'flex-end',
    backgroundColor: '#8FDA97',
    marginBottom: 15,
    borderRadius: pxPhone(8),
  },
  buttontext: {
    fontSize: 18,
    margin: 10,
    textAlign: 'center',
    color: 'white',
  },
  header: {
    fontSize: 25,
    marginTop: 15,
    marginBottom: 15,
    color: 'black',
    textAlign: 'center',
  },
  header1: {
    fontSize: 22,
    marginTop: pxPhone(4),
    color: 'black',
    marginLeft: 10,
    textAlign:'center',
  },
  text: {
    fontSize: 18,
    marginTop: 5,
    color: '#324F6F',
  },
  text1: {
    fontSize: 18,
    marginTop: pxPhone(10),
    color: '#324F6F',
    textAlign: 'center',
  },
});
export default SignIn;
