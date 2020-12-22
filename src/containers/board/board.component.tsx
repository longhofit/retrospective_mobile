import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { View, Text, TouchableOpacity, Picker, TextInput, ScrollView } from 'react-native';
import { EvaArrowIcon, AddIcon } from '@src/assets/icons';
import { textStyle } from '@src/components/textStyle';
import { pxPhone, pxToPercentage } from '@src/core/utils/utils';
import { BoardRepository } from 'react-native-draganddrop-board';
import Modal from 'react-native-modal';
import io from 'socket.io-client';
import { Actions } from '@src/core/utils/constants';
import { User } from '@src/core/models/user/user.model';
import { Post, Session } from '@src/core/models/type';
import { viewStyle } from '@src/components/viewStyle';
import { BoardMetaData } from '@src/core/models/board/board.model';
import { InputItem } from '@src/components/input/inputItem.component';

interface ComponentProps {
  session: Session;
  onAddPost: (columnIndex: number, content: string, rank: string) => void;
}

export type BoardProps = ComponentProps & ThemedComponentProps;

const BoardComponent: React.FunctionComponent<BoardProps> = (props) => {
  const { themedStyle } = props;
  const [post, setPost] = useState<string>('');

  const onAddPost = (): void => {
    props.onAddPost(2,post,`ranh ${post}`);
  };

  return (
    <View style={themedStyle.container}>
      {props.session.posts.map((item, index) => {
        return (
          <Text key={index}>
            {item.id}
          </Text>
        );
      })}
      <InputItem
        title={'Post'}
        autoFocus={true}
        inputContainerStyle={themedStyle.viewInput}
        onInputTextChange={setPost} />
      <TouchableOpacity
        activeOpacity={0.75}
        style={themedStyle.viewButton}
        onPress={onAddPost}>
        <Text style={themedStyle.txtSignUp}>
          {'Add post'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const Board = withStyles(BoardComponent, (theme: ThemeType) => ({
  txtSignUp: {
    lineHeight: pxToPercentage(25),
    ...textStyle.proTextBold,
    color: theme['color-basic-light-100'],
  },
  viewButton: {
    borderRadius: pxToPercentage(9),
    marginTop: pxToPercentage(20),
    backgroundColor: theme['color-app'],
    height: pxToPercentage(40),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtPlaceholder: {
    color: theme['color-basic-dark-100'],
    fontSize: 30,
    ...textStyle.proDisplayRegular,
  },
  viewInput: {
    marginTop: pxPhone(50),
    height: pxToPercentage(40),
    paddingHorizontal: pxPhone(25),
  },
  viewAddButton: {
    width: pxPhone(50),
    height: pxPhone(50),
    borderRadius: pxPhone(25),
    backgroundColor: theme['color-grey-1'],
    position: 'absolute',
    bottom: pxPhone(6),
    right: pxPhone(6),
  },
  viewParticipants: {
    marginLeft: pxPhone(15),
    flexDirection: 'row',
    width: '100%',
  },
  viewviewParticipantPhoto: {
    marginRight: pxPhone(5),
    width: pxPhone(35),
    height: pxPhone(35),
    borderRadius: pxPhone(25),
    backgroundColor: theme['color-purple'],
    ...viewStyle.shadow2,
  },
  viewBoardInfoItem: {
    alignItems: 'center',
  },
  viewBoardInfomation: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  sectionText: {
    marginLeft: pxPhone(15),
  },
  viewBoard: {
    marginTop: pxPhone(15),
    justifyContent: 'center',
    backgroundColor: theme['color-basic-light-100'],
    width: pxToPercentage(300),
    height: pxToPercentage(150),
    borderRadius: pxToPercentage(10),
    ...viewStyle.shadow2,
  },
  iconUncheck: {
    height: pxToPercentage(20),
    width: pxToPercentage(20),
  },
  container: {
    alignItems: 'center',
    flex: 1,
  },
  card: {
    width: '95%',
    marginLeft: pxToPercentage(5),
    marginTop: pxToPercentage(5),
    paddingLeft: pxToPercentage(15),
    paddingVertical: pxToPercentage(15),
    borderRadius: pxToPercentage(3),
    backgroundColor: theme['color-basic-light-100'],
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
  },
  viewIcon: {
    position: 'absolute',
    left: 0,
  },
  icon: {
    width: pxToPercentage(25),
    height: pxToPercentage(25),
    tintColor: theme['color-basic-light-100'],
  },
  txtHome: {
    marginTop: pxToPercentage(20),
    marginLeft: pxToPercentage(15),
    color: theme['color-basic-dark-100'],
    fontSize: 25,
    ...textStyle.proDisplayBold,
  },
  txtHeader: {
    fontSize: pxToPercentage(18),
    color: theme['color-basic-light-100'],
    ...textStyle.proDisplayRegular,
  },
  txtSignIn: {
    color: theme['color-basic-dark-100'],
    fontSize: 20,
    ...textStyle.proTextSemibold,
  },
  viewHeader: {
    backgroundColor: theme['color-app'],
    height: pxToPercentage(70),
    width: '100%',
  },
  viewAdd: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: pxPhone(30),
    right: pxPhone(30),
    width: pxToPercentage(50),
    height: pxToPercentage(50),
    borderRadius: pxToPercentage(25),
    backgroundColor: theme['color-green-1'],
  },
  iconAdd: {
    width: pxToPercentage(30),
    height: pxToPercentage(30),
    tintColor: theme['color-basic-light-100'],
  },
  sectionAddNotifications: {
    width: '100%',
    backgroundColor: theme['color-basic-light-100'],
    paddingHorizontal: pxToPercentage(16),
    paddingVertical: pxToPercentage(28),
  },
  txtAddNotificationsModal: {
    fontSize: pxToPercentage(18),
    lineHeight: pxToPercentage(20),
    marginBottom: pxToPercentage(8),
    ...textStyle.robotoMedium,
  },
  txtCloseAddNotificationsModal: {
    fontSize: pxToPercentage(14),
    lineHeight: pxToPercentage(20),
    ...textStyle.robotoMedium,
    color: theme['color-app'],
  },
  viewAddNotificationsBottom: {
    alignSelf: 'flex-end',
    width: pxToPercentage(112),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: pxToPercentage(10),
  },
  viewAddNotificationsBottom2: {
    alignSelf: 'flex-end',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: pxToPercentage(10),
  },
  inputNote: {
    backgroundColor: theme['color-gray-1600'],
    width: '100%',
    height: pxToPercentage(200),
    paddingVertical: 0,
    borderRadius: pxToPercentage(5),
    color: theme['color-basic-dark-100'],
  },
}));
