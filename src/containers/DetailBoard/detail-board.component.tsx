import React from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { EvaArrowIcon, AddIcon, SendIcon, TrashIcon, MoveIcon, EditIcon, ShareIcon } from '@src/assets/icons';
import { textStyle } from '@src/components/textStyle';
import { pxPhone, pxToPercentage } from '@src/core/utils/utils';
import { TabView, SceneMap } from 'react-native-tab-view';
import { BoardContainer } from '../board/board.container';
import { SummaryContainer } from '../summary/summary.container';
import { ParticipantsContainer } from '../participants/participants.container';
interface ComponentProps {
    sessionId: string
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
    first: ParticipantsContainer,
    second: SummaryContainer,
    three: BoardContainer,
  });
  return (
    <TabView
          style={{ width: '100%', height: '100%' }}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(value) => setIndex(value)}
          lazy={true}
          swipeEnabled={false}
        />
  );
};

export const DetailBoard = withStyles(DetailBoardComponent, (theme: ThemeType) => ({
  txtHeader2: {
    color: theme['color-basic-dark-100'],
    ...textStyle.proTextBold,
    fontSize: pxPhone(20),
  },
}));
