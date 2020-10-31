import AsyncStorage from '@react-native-community/async-storage';

export const PERSIST_CONFIG = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'session',
  ], // save specific reducers
  blacklist: [], // don't save specific reducers
};
