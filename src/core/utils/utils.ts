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
