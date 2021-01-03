import React, { useState , useEffect, useCallback} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, TextInput, Pressable, AppState } from 'react-native';
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
import { useDispatch, useSelector } from 'react-redux';
import { onThunkSignInGGReq, onThunkSignInReq } from './store/thunk';
import { NavigationInjectedProps } from 'react-navigation';

import {
  GoogleSigninButton,
  GoogleSignin,
  statusCodes
} from '@react-native-community/google-signin'
import io from 'socket.io-client';
import { User } from '@src/core/models/user/user.model';
import { onSetUser } from '@src/core/store/reducer/user/actions';
import { SignInGGFormData } from '@src/core/models/signUp/signInGGReq.model';
import { UserState } from '@src/core/store/reducer/user';
export const SignIn: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const navigationKey: string = 'SignInContainer';
  const [name, setName] = useState('');
  const [signInFormData, setSignInFormData] = useState<SignInFormData>({
    username: 'minhhien',
    password: '123456',
  });
  const [signInGGFormData, setSignInGGFormData] = useState<SignInGGFormData>({
    email: '',
    googleId: '',
  });
  console.log("123",signInGGFormData.email);
  console.log("1234",signInGGFormData.googleId);
  const API_URL = 'http://10.0.2.2:8082/api/auth';
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const dispatch: Dispatch<any> = useDispatch();
  useEffect(()=>{
    const s = io("http://localhost:8082");
    setSocket(s);
    s.on('auth', async (_user: User) => {
      if(userInfo!=null){
        
        if(error!=null){
          setError(null);
        }
        
      }
    });
  return () => {
      if (s && s.connected) {
          s.disconnect();
      }
  };
  },[userInfo])
  const handleOAuth = useCallback(
    (provider: string) => {
      const url = `${API_URL}/${provider}?socketId=${socket!.id}`;
      signInWithGoogle();
    },
    [socket]
  );
  const handleGoogle = useCallback(() => handleOAuth('google'), [handleOAuth]);  
  // login google
  const configureGoogleSign = () => {
    GoogleSignin.configure({
      webClientId: "739033396860-5pm7afu96ha409v742u6p35msv5ipe42.apps.googleusercontent.com",
      offlineAccess: true
    })
  };
  useEffect(() => {
    configureGoogleSign()
  }, []);
  const signInWithGoogle = async() => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      setUserInfo(userInfo)
      setError(null)
      setIsLoggedIn(true)
      console.log("userInfo:", userInfo);
      setSignInGGFormData(pre => ({ email: userInfo.user.email, googleId: userInfo.user.id}))
      dispatch(onThunkSignInGGReq(signInGGFormData,onSuccess, onError));
      const user : UserState = useSelector((state: AppState) => state.user);
      console.log("userInfoAfterLogin:", user);
    } catch (error) {
      setError(error)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // when user cancels sign in process,
       
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // when in progress already
        
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // when play services not available
        
      } else {
        // some other error
        console.log(error.code)
        
      }
      
    }
  };
  const getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently()
      setUserInfo(userInfo)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // when user hasn't signed in yet
        Alert.alert('Please Sign in')
        setIsLoggedIn(false)
      } else {
        Alert.alert('Something else went wrong... ', error.toString())
        setIsLoggedIn(false)
      }
    }
  };
  const signOut = async() => {
    try {
      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()
      setIsLoggedIn(false)
    } catch (error) {
      Alert.alert('Something else went wrong... ', error.toString())
    }
  }
  //

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

  //dispatch(onThunkSignInReq(signInFormData, onSuccess, onError));

  const onSignInPress = (): void => {
    dispatch(onThunkSignInReq(signInFormData, onSuccess, onError));
    
  };
  const user : UserState = useSelector((state: AppState) => state.user);
  console.log("userInfoAfterLogin:", user);
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
          value={signInFormData.username}
          onChangeText={(username) => {
            setSignInFormData({ ...signInFormData, username });
          }}
          style={styles.textinput}
        />
        <Text style={styles.text}>Password</Text>
        <TextInput
          value={signInFormData.password}
          onChangeText={(password) => {
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
        <Text
          style={{
            fontSize: 18,
            marginTop: 10,
            color: '#09577b',
            textAlign: 'center',
          }}>
          OR
        </Text>
        <GoogleSigninButton
          style={styles.buttonGoogle}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={() => handleGoogle()}
        />
        <TouchableOpacity style={styles.buttonSignIn}>
          <Text style={styles.buttontext} onPress={signOut}>
            SIGN OUT
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
  buttonGoogle: {
    marginTop: 10,
    alignSelf: 'center',
    width: 192, 
    height: 48
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
