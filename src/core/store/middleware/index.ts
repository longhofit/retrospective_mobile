import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from './logger';

// define store middlewares as an array
export default [
  thunkMiddleware,
  loggerMiddleware,
];
