import {
  getApplicationName,
  getVersion,
  getBuildNumber,
  getBundleId,
  getDeviceName,
  getFingerprint,
  getUniqueId,
  getDeviceToken,
  getDeviceType,
} from 'react-native-device-info';

export const appName: string = getApplicationName();

export const appVersion: string = getVersion();

export const buildNumber: string = getBuildNumber();

export const bundleId: string = getBundleId();

export const uniqueId: string = getUniqueId();

export const deviceType: string = getDeviceType();

export const deviceName = async (): Promise<string> => {
  return await getDeviceName();
};

export const identifier = async (): Promise<string> => {
  return await getFingerprint();
};

export const deviceToken = async (): Promise<string> => {
  return await getDeviceToken();
};
