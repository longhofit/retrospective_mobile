import React from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { EvaArrowIcon, ShareIcon } from '@src/assets/icons';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { textStyle } from '@src/components/textStyle';
import { Session } from '@src/core/models/type';
import { pxPhone, pxToPercentage } from '@src/core/utils/utils';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { BoardContainer } from '../board/board.container';
import { SummaryContainer } from '../summary/summary.container';
import { ParticipantsContainer } from '../participants/participants.container';
import { themes } from '@src/core/themes';
import Clipboard from '@react-native-community/clipboard'
import { toasts } from '@src/core/utils/toasts';
interface ComponentProps {
  sessionId: string
  session: Session;
  onBack: () => void;
}

export type DetailBoardProps = ComponentProps & ThemedComponentProps;

const DetailBoardComponent: React.FunctionComponent<DetailBoardProps> = (props) => {
  const sessionId: string = props.sessionId;
  const { themedStyle } = props;
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'BOARD', params: { sessionId } },
    { key: 'second', title: 'SUMMARY', params: { sessionId } },
    { key: 'three', title: 'PARTICIPANT', params: { sessionId } },
  ]);

  const renderScene = SceneMap({
    first: BoardContainer,
    second: SummaryContainer,
    three: ParticipantsContainer,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#324F6F' }}
      style={{ backgroundColor: themes["App Theme"]['color-green-1'] }}
      activeColor={'#324F6F'}
    />
  );

  const onShareIconPress = (): void => {
    toasts.success('Copied board url!!!');
    Clipboard.setString(`http://retrospective.ai/game/${props.session.id}`)
  }

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={themedStyle.viewHeader}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => props.onBack()}
          style={{ position: 'absolute', left: pxPhone(12) }}>
          {EvaArrowIcon({ width: pxPhone(30), height: pxPhone(30), tintColor: '#324F6F' })}
        </TouchableOpacity>
        <Text style={themedStyle.txtHeader}>
          {props.session.name || 'My Retrospective'}
        </Text>
        <TouchableOpacity
          style={{ position: 'absolute', right: pxPhone(12) }}
          onPress={onShareIconPress}
          activeOpacity={0.75}>
          {ShareIcon(themedStyle.iconShare)}
        </TouchableOpacity>
      </View>
      <TabView
        renderTabBar={renderTabBar}
        style={{ width: '100%', height: '100%' }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(value) => setIndex(value)}
        lazy={true}
        swipeEnabled={false}
      />
    </SafeAreaView>
  );
};

export const DetailBoard = withStyles(DetailBoardComponent, (theme: ThemeType) => ({
  viewHeader: {
    flexDirection: 'row',
    width: '100%',
    height: pxPhone(70),
    backgroundColor: theme['color-green-1'],
    // shadow ios
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    // shadow android
    elevation: 8,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: pxPhone(12),
  },
  txtHeader: {
    color: '#324F6F',
    ...textStyle.proTextBold,
    fontSize: pxPhone(20),
  },
  iconShare: {
    width: pxToPercentage(20),
    height: pxToPercentage(20),
    tintColor: '#324F6F',
  },
}));
