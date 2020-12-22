import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Dimensions } from 'react-native';
import { isTablet } from 'react-native-device-info';

// ios height: 768
// ios width: 1024
// 1.33333
const { height, width } = Dimensions.get('window');
export const hw: boolean = height > width;
const w: number = 1.3333333 / (width / height);
const h: number = 1.3333333 / (height / width);

const perWidthPhoneW: number = width / 414;
const perHeightPhoneW: number = height / 414;
const perWidthPhoneH: number = width / 896;
const perHeightPhoneH: number = height / 896;

const perWidthTabletH: number = width / 768;
const perHeightTabletH: number = height / 768;
const perWidthTabletW: number = width / 1024;
const perHeightTabletW: number = height / 1024;

export const pxPhone = (value: number): number => {
  return height > width ? perWidthPhoneW * value : perHeightPhoneW * value;
};

export const pxPhoneH = (value: number): number => {
  return height > width ? perHeightPhoneH * value : perWidthPhoneH * value;
};

export const isEmpty = (value: any): boolean => {
  return (value === undefined || value === '');
};

export const fontSize = (value: number): number => {
  if (!isTablet()) {
    return (hp(value) + wp(value) * 4) / 5;
  }

  if (hw) {
    return (hp(value) * 4 * h + wp(value)) / 5;
  } else {
    return (hp(value) + wp(value) * 4 * w) / 5;
  }
};

export const averageHW = (value: number): number => {
  if (!isTablet()) {
    return (hp(value) + wp(value) * 4) / 5;
  }

  if (hw) {
    return (hp(value) * 4 * h + wp(value)) / 5;
  } else {
    return (hp(value) + wp(value) * 4 * w) / 5;
  }
};

// default: 812 x 375, iPhone 11 Pro
const percentageWidth: number = width / 375;

export const pxToPercentage = (value: number): number => {
  return percentageWidth * value;
};
