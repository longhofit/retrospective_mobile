import React from 'react';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import {
  View,
  ViewProps,
  Text,
  StatusBar,
} from 'react-native';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { AppState } from '@src/core/store';
import {
  fontSize,
  averageHW,
} from '@src/core/utils/utils';
import { textStyle } from '../textStyle';

export const SPINNER_TYPES = {
  BALL: 'BALL',
  BAR: 'BAR',
  DOT: 'DOT',
  MATERIAL: 'MATERIAL',
  PACMAN: 'PACMAN',
  PULSE: 'PULSE',
  SKYPE: 'SKYPE',
  WAVE: 'WAVE',
};

interface ComponentProps extends ViewProps {
  isVisible?: boolean;
  backgroundColor?: string;
  color?: string;
  type?: string;
}

export type SpinnerProps = ThemedComponentProps & ComponentProps;

const SpinnerComponent: React.FunctionComponent<SpinnerProps> = (props) => {
  const appReducer = useSelector((state: AppState) => state.app);

  const renderIndicator = (): React.ReactElement => {
    const { color, type } = props;
    const indicatorColor: string = color || '#ffffff';

    switch (type) {
      case SPINNER_TYPES.BALL: {
        return <BallIndicator size={averageHW(10)} color={indicatorColor} />;
      }
      case SPINNER_TYPES.BAR: {
        return <BarIndicator size={averageHW(10)} color={indicatorColor} />;
      }
      case SPINNER_TYPES.DOT: {
        return <DotIndicator size={averageHW(10)} color={indicatorColor} />;
      }
      case SPINNER_TYPES.MATERIAL: {
        return <MaterialIndicator size={averageHW(10)} color={indicatorColor} />;
      }
      case SPINNER_TYPES.PACMAN: {
        return <PacmanIndicator size={averageHW(10)} color={indicatorColor} />;
      }
      case SPINNER_TYPES.PULSE: {
        return <PulseIndicator size={averageHW(10)} color={indicatorColor} />;
      }
      case SPINNER_TYPES.SKYPE: {
        return <SkypeIndicator size={averageHW(10)} color={indicatorColor} />;
      }
      case SPINNER_TYPES.WAVE: {
        return <WaveIndicator size={averageHW(10)} color={indicatorColor} />;
      }
      default: {
        return <BarIndicator size={averageHW(10)} color={indicatorColor} />;
      }
    }
  };

  const { backgroundColor, themedStyle, isVisible, style } = props;
  const viewBoxStyle: any[] = [
    themedStyle.viewBox,
    { backgroundColor: backgroundColor || themedStyle.viewBox.backgroundColor },
    { height: averageHW(appReducer.textSpinner ? 17.5 : 15) },
    style,
  ];

  return (
    <Modal
      isVisible={isVisible || appReducer.isEnabledSpinner}
      animationIn='zoomIn'
      animationOut='zoomOut'
      style={themedStyle.container}>
      <StatusBar
        backgroundColor='rgba(0,0,0,0.7)'
        barStyle='light-content'
      />
      <View style={viewBoxStyle}>
        {renderIndicator()}
        {appReducer.textSpinner &&
          (<Text
            numberOfLines={1}
            style={themedStyle.txtDescription}>
            {appReducer.textSpinner}
          </Text>)}
      </View>
    </Modal>
  );
};

export const Spinner = withStyles(SpinnerComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBox: {
    minWidth: averageHW(20),
    maxWidth: averageHW(30),
    borderRadius: averageHW(1),
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  txtDescription: {
    fontSize: fontSize(3.25),
    marginTop: averageHW(1),
    color: theme['text-control-color'],
    ...textStyle.proTextRegular,
  },
}));
