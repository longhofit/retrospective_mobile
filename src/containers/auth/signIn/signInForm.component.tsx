import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert, TextInput} from 'react-native';

const SignInFormComponent = (props) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const hasErrorEmail = () => {
    return userName.includes('@');
  };
  const hasErrorPassword = () => {
    return password.trim() == '';
  };
  const onPressButton = () => {
    if (hasErrorEmail() || hasErrorPassword()) {
      Alert.alert('Fail');
    } else {
      Alert.alert('Success');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <TextInput
          value={userName}
          onChangeText={(userName) => setUserName(userName)}
          style={[styles.textinput, styles.inputUs]}
        />
        <TextInput
          value={password}
          onChangeText={(password) => setPassword(password)}
          style={styles.textinput}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttontext} onPress={onPressButton}>
            SIGN IN
          </Text>
        </TouchableOpacity>
        <Text style={styles.text} onPress={() => console.log('1st')}>
          FORGOT PASSWORD?
        </Text>
        <Text
          style={[styles.text, styles.text1]}
          onPress={() => console.log('1st')}>
          USE SINGLE SIGN-ON (SSO)
        </Text>
        <Text style={styles.text} onPress={() => console.log('1st')}>
          SIGN UP FREE
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0f13',
  },
  container1: {
    marginLeft: 30,
    marginRight: 30,
  },
  inputUs: {
    marginTop: 40,
  },
  textinput: {
    height: 60,
    width: '98%',
    borderBottomColor: '#676a6f',
    backgroundColor: '#1f242a',
    borderWidth: 1,
  },
  button: {
    marginTop: 20,
    width: '98%',
    backgroundColor: '#2b2c30',
    borderRadius: 10,
  },
  buttontext: {
    fontSize: 18,
    margin: 10,
    textAlign: 'center',
    color: 'white',
  },
  text: {
    fontSize: 18,
    marginTop: 20,
    color: '#09577b',
    textAlign: 'center',
  },
  text1: {
    width: '98%',
    borderColor: '#09577b',
    borderWidth: 1,
    borderRadius: 6,
  },
});
export default SignInFormComponent;
