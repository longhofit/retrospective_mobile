import React, { useState } from 'react';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
  StyleType,
} from '@kitten/theme';
import {
  TextInput,
  TextInputProps,
  View,
  StyleProp,
  ViewStyle,
  ImageStyle,
  ImageProps,
  TouchableOpacity,
  Text,
} from 'react-native';
import { textStyle } from '../textStyle';
import { pxToPercentage } from '@src/core/utils/utils';
import { IconElement } from '@src/assets/icons/icon.component';

interface ComponentProps extends TextInputProps {
  inputContainerStyle?: StyleProp<ViewStyle>;
  onInputTextChange: (value: string | undefined) => void;
  icon?: IconProp;
  iconStyle?: StyleProp<ImageStyle>;
  onIconPress?: () => void;
  title?: string;
}

export type InputItemProps = ThemedComponentProps & ComponentProps;

type IconProp = (style: StyleType) => React.ReactElement<ImageProps>;

const InputItemComponent: React.FunctionComponent<InputItemProps> = (props) => {
  const [value, setValue] = useState<string | undefined>(props.value);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isShowTitle, setIsShowTitle] = useState<boolean>(false);

  const onInputTextChange = (text: string): void => {
    if (props.onInputTextChange) {
      setValue(text);
      props.onInputTextChange(text);
    }
  };

  const onIconPress = (): void => {
    props.onIconPress();
  };

  const onFocus = (): void => {
    setIsFocus(true);
    setIsShowTitle(true);
  };

  const { themedStyle, inputContainerStyle, iconStyle, style, ...restProps } = props;

  const renderIcon = (): IconElement => {
    return props.icon([
      themedStyle.icon,
      iconStyle,
    ]);
  };

  return (
    <View
      style={[
        themedStyle.container,
        inputContainerStyle,
        isFocus && themedStyle.focusBorder,
      ]}>
      {isShowTitle && (
        <View style={themedStyle.viewTop}>
          <Text style={[
            themedStyle.txtTitle,
            isFocus && themedStyle.focusTitle,
          ]}>
            {props.title}
          </Text>
        </View>
      )}
      <View style={themedStyle.viewBottom}>
        <TextInput
          onFocus={onFocus}
          onEndEditing={() => setIsFocus(false)}
          autoCapitalize='none'
          maxLength={256}
          value={value}
          {...restProps}
          style={[
            themedStyle.input,
            style,
          ]}
          onChangeText={onInputTextChange}
        />
        <TouchableOpacity
          onPress={onIconPress}
          style={themedStyle.viewRight}>
          {props.icon && renderIcon()}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const InputItem = withStyles(InputItemComponent, (theme: ThemeType) => ({
  container: {
    justifyContent: 'center',
    width: '100%',
    height: pxToPercentage(55),
    borderColor: theme['color-basic-dark-800'],
    borderWidth: pxToPercentage(1),
    borderRadius: pxToPercentage(9),
  },
  viewBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  viewTop: {
    backgroundColor: theme['color-basic-light-100'],
    position: 'absolute',
    top: -pxToPercentage(12),
    left: pxToPercentage(14),
    paddingHorizontal: pxToPercentage(10),
  },
  viewRight: {
    width: pxToPercentage(40),
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    marginLeft: pxToPercentage(17),
    fontSize: pxToPercentage(17),
    color: theme['color-basic-dark-100'],
    ...textStyle.robotoRegular,
  },
  icon: {
    width: pxToPercentage(24),
    height: pxToPercentage(24),
    tintColor: theme['color-basic-dark-800'],
  },
  focusBorder: {
    borderColor: theme['color-app'],
  },
  focusTitle: {
    color: theme['color-app'],
  },
  txtTitle: {
    fontSize: pxToPercentage(13),
    color: theme['color-basic-dark-600'],
    ...textStyle.robotoMedium,
  },
  txtPlaceholder: {
    fontSize: pxToPercentage(17),
    color: theme['color-basic-dark-600'],
    ...textStyle.robotoRegular,
  },
}));
