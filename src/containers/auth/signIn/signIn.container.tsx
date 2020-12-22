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
  pxToPercentage,
} from '@src/core/utils/utils';
import { SignInFormData } from '@src/core/models/signUp/signInReq.model';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { onThunkSignInReq } from './store/thunk';
import { NavigationInjectedProps } from 'react-navigation';
import { onSetUser } from '@src/core/store/reducer/user/actions';
export const SignIn: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const navigationKey: string = 'SignInContainer';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signInFormData, setSignInFormData] = useState<SignInFormData>({
    username: 'longhoimt3',
    password: '123456',
  });
  const dispatch: Dispatch<any> = useDispatch();

  const hasErrorEmail = () => {
    return username.trim() == '';
  };
  const hasErrorPassword = () => {
    return password.trim() == '';
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

  dispatch(onThunkSignInReq(signInFormData, onSuccess, onError));

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.viewHeader}>
        <Text style={styles.txtHeader}>
          Sign into your account
        </Text>
      </View>
      <ScrollView style={styles.container1}>
        <Text style={styles.text}>Username</Text>
        <TextInput
          value={username}
          onChangeText={(username) => {
            setUsername(username);
            setSignInFormData({ ...signInFormData, username });
          }}
          style={styles.textinput}
        />
        <Text style={styles.text}>Password</Text>
        <TextInput
          value={password}
          onChangeText={(password) => {
            setPassword(password);
            setSignInFormData({ ...signInFormData, password });
          }}
          style={styles.textinput}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.buttonSignIn}>
          <Text style={styles.buttontext} onPress={onPressButton}>
            SIGN IN
          </Text>
        </TouchableOpacity>
        <Text style={styles.text1} onPress={() => console.log('1st')}>
          FORGOT PASSWORD?
        </Text>
        <Text style={styles.text1} onPress={() => console.log('1st')}>
          SIGN UP FREE
        </Text>
        <Text style={styles.header}>Or</Text>
        <View style={styles.containerAnonymous}>
          <Text style={styles.header1}>Anonymous Login</Text>
          <Text style={styles.notify}>This will create an anonymous account. Some features won't be available.</Text>
          <TextInput
            style={styles.textinputAno}
            placeholder='please enter a name or nickname here'
            value={name}
            onChangeText={(name) => setName(name)}
          />
          <TouchableOpacity style={styles.buttonAno} disabled={hasName()}>
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
    marginLeft: 30,
    marginRight: 30,
    marginTop: 40,
  },
  containerAnonymous: {
    borderWidth: 1,
    marginBottom: 15,
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
  },
  textinputAno: {
    height: 50,
    padding: 15,
    margin: 15,
    borderWidth: 1,
    borderColor: 'white',
    borderBottomColor: '#673ab7',
  },
  buttonSignIn: {
    marginTop: 20,
    width: '60%',
    backgroundColor: '#673ab7',
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonAno: {
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignSelf: 'flex-end',
    backgroundColor: '#673ab7',
    marginBottom: 15,
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
    marginTop: 15,
    color: 'black',
    marginLeft: 10,
  },
  text: {
    fontSize: 18,
    marginTop: 5,
    color: '#09577b',
  },
  text1: {
    fontSize: 18,
    marginTop: 20,
    color: '#09577b',
    textAlign: 'center',
  },
  notify: {
    backgroundColor: '#e8f4fd',
    margin: 10,
  }
});
export default SignIn;
