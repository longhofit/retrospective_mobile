import Toast from 'react-native-root-toast';
import { fontSize } from './utils';
import { isTablet } from 'react-native-device-info';
import { textStyle } from '@src/components';

const backgroundColorSuccess: string = '#5cb85c';
const backgroundColorWarning: string = '#f0ad4e';
const backgroundColorDanger: string = '#ed1c25';
const backgroundColorNormal: string = '#888888';

const success = (message: string): void => {
  toastConfig(message, backgroundColorSuccess);
};

const warning = (message: string): void => {
  toastConfig(message, backgroundColorWarning);
};

const danger = (message: string): void => {
  toastConfig(message, backgroundColorDanger);
};

const normal = (message: string): void => {
  toastConfig(message, backgroundColorNormal);
};

const toastConfig = (message: string, backgroundColor: string): void => {
  Toast.show(message, {
    duration: 5000,
    position: Toast.positions.BOTTOM,
    shadow: false,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor,
    containerStyle: {
      width: '90%',
    },
    textStyle: {
      fontSize: isTablet() ? fontSize(1.75) : fontSize(2.5),
      textAlign: 'left',
      ...textStyle.semibold,
    },
    opacity: 0.9,
    onShow: () => {
      // calls on toast\`s appear animation start
    },
    onShown: () => {
      // calls on toast\`s appear animation end.
    },
    onHide: () => {
      // calls on toast\`s hide animation start.
    },
    onHidden: () => {
      // calls on toast\`s hide animation end.
    },
  });
};

export const toasts = {
  success,
  warning,
  danger,
  normal,
};
