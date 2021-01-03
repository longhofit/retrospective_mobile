/*
  Alerts.confirm({
    title: 'Title',
    message: 'Message',
    onResult(result) {
      console.log(result);
    },
  });
*/
import { Alert } from 'react-native';
import I18n from '@src/assets/i18n';

export interface AlertParams {
  title?: string;
  message: string;
  onResult?: (result?: boolean) => void;
}

const confirm = (params: AlertParams) => {
  Alert.alert(
    params.title,
    params.message,
    [
      {
        text: 'Cancel',
        onPress: () => params.onResult ? params.onResult(false) : {},
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: () => params.onResult ? params.onResult(true) : {},
      },
    ],
    {
      cancelable: false,
    },
  );
};

const alert = (params: AlertParams) => {
  Alert.alert(
    params.title,
    params.message,
    [
      {
        text: 'OK',
        onPress: () => params.onResult ? params.onResult() : {},
      },
    ],
    {
      cancelable: false,
    },
  );
};

export const alerts = {
  confirm,
  alert,
};
