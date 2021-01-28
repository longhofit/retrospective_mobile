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

export const EvaArrowIcon = (style: StyleProp<ImageStyle>): IconElement => {
  const source: IconSource = {
    imageSource: require('./eva/arrow-ios-back.png'),
  };

  return Icon(source, style);
};

export const AddIcon = (style: StyleProp<ImageStyle>): IconElement => {
  const source: IconSource = {
    imageSource: require('./other/add.png'),
  };

  return Icon(source, style);
};

export const UncheckIcon = (style: StyleProp<ImageStyle>): IconElement => {
  const source: IconSource = {
    imageSource: require('./other/check_box_outline.png'),
  };

  return Icon(source, style);
};

export const CheckIcon = (style: StyleProp<ImageStyle>): IconElement => {
  const source: IconSource = {
    imageSource: require('./other/check_box.png'),
  };

  return Icon(source, style);
};

export const SendIcon = (style: StyleProp<ImageStyle>): IconElement => {
  const source: IconSource = {
    imageSource: require('./other/send.png'),
  };

  return Icon(source, style);
};

export const EditIcon = (style: StyleProp<ImageStyle>): IconElement => {
  const source: IconSource = {
    imageSource: require('./other/edit.png'),
  };

  return Icon(source, style);
};

export const MoveIcon = (style: StyleProp<ImageStyle>): IconElement => {
  const source: IconSource = {
    imageSource: require('./other/move.png'),
  };

  return Icon(source, style);
};

export const TrashIcon = (style: StyleProp<ImageStyle>): IconElement => {
  const source: IconSource = {
    imageSource: require('./other/delete.png'),
  };

  return Icon(source, style);
};

export const InformationIcon = (style: StyleProp<ImageStyle>): IconElement => {
  const source: IconSource = {
    imageSource: require('./other/information.png'),
  };

  return Icon(source, style);
};

export const CheckedIcon = (style: StyleProp<ImageStyle>): IconElement => {
  const source: IconSource = {
    imageSource: require('./other/checked.png'),
  };

  return Icon(source, style);
};

