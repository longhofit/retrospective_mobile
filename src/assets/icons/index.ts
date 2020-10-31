import {
  ImageStyle,
  StyleProp,
} from 'react-native';
import {
  Icon,
  IconElement,
  IconSource,
} from './icon.component';
export {
  Icon,
  IconSource,
  RemoteIcon,
} from './icon.component';

export const OtherFingerprintIcon = (style: StyleProp<ImageStyle>): IconElement => {
  const source: IconSource = {
    imageSource: require('./other/fingerprint.png'),
  };

  return Icon(source, style);
};

export const OtherFaceIDIcon = (style: StyleProp<ImageStyle>): IconElement => {
  const source: IconSource = {
    imageSource: require('./other/face-id.png'),
  };

  return Icon(source, style);
};

