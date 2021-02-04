import React from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { ShareIcon } from '@src/assets/icons';
import { View, Text, TouchableOpacity, Clipboard , Image} from 'react-native';
import { textStyle } from '@src/components/textStyle';
import { Session } from '@src/core/models/type';
import { pxPhone, pxToPercentage } from '@src/core/utils/utils';
import { TabView, SceneMap } from 'react-native-tab-view';
import { BoardContainer } from '../board/board.container';
import { SummaryContainer } from '../summary/summary.container';
import { ParticipantsContainer } from '../participants/participants.container';
interface ComponentProps {
    sessionId: string
    session: Session;
}

export type DetailBoardProps = ComponentProps & ThemedComponentProps;

const DetailBoardComponent: React.FunctionComponent<DetailBoardProps> = (props) => {
  const sessionId: string = props.sessionId;
  const { themedStyle } = props;
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'BOARD' , params: {sessionId}},
    { key: 'second', title: 'SUMMARY' , params: {sessionId}},
    { key: 'three', title: 'PARTICIPANTS' , params: {sessionId}},
  ]);

  const renderScene = SceneMap({
    first: BoardContainer,
    second: SummaryContainer,
    three: ParticipantsContainer,
  });
  return (
    <React.Fragment>
      <View style={themedStyle.viewHeader}>
        <Text style={themedStyle.txtHeader}>
          {'My retrospective'}
        </Text>
        <TouchableOpacity
          onPress={() => Clipboard.setString(`http://localhost:3000/game/${props.session.id}`)}
          activeOpacity={0.75}>
          {ShareIcon(themedStyle.iconShare)}
        </TouchableOpacity>
      </View>
      <TabView
          style={{ width: '100%', height: '100%' }}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(value) => setIndex(value)}
          lazy={true}
          swipeEnabled={false}
        />
    </React.Fragment>
  );
};

export const DetailBoard = withStyles(DetailBoardComponent, (theme: ThemeType) => ({
  viewHeader: {
    flexDirection: 'row',
    width: '100%',
    height: pxPhone(50),
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
    justifyContent: 'space-between',
    paddingHorizontal: pxPhone(12),
  },
  txtHeader: {
    color: theme['color-basic-dark-100'],
    ...textStyle.proTextBold,
    fontSize: pxPhone(20),
  },
  iconShare: {
    width: pxToPercentage(20),
    height: pxToPercentage(20),
    tintColor: theme['color-basic-light-100'],
  },
}));
