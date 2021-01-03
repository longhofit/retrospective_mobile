import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { View, Text, TouchableOpacity, Picker, TextInput, ScrollView, FlatList } from 'react-native';
import { EvaArrowIcon, AddIcon, SendIcon } from '@src/assets/icons';
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
import { alerts } from '@src/core/utils/alerts';

interface ComponentProps {
  session: Session;
  onAddPost: (columnIndex: number, content: string, rank: string) => void;
  onEditPost: (post: Post) => void;
  onDeletePostPress: (post: Post) => void;
}

export type BoardProps = ComponentProps & ThemedComponentProps;

const BoardComponent: React.FunctionComponent<BoardProps> = (props) => {
  const { themedStyle } = props;
  const [post, setPost] = useState<string>('');
  const [isShowAdd, setIsShowAdd] = useState<boolean>(false);
  const [postSelected, setPostSelected] = useState<Post>(undefined);
  const [postSelectedContent, setPostSelectedContent] = useState<string>('');

  const onAddPost = (columnIndex: number): void => {
    props.onAddPost(columnIndex, post, `ranh ${post}`);
    setPost('');
  };

  const onCancelAddPress = (): void => {
    setIsShowAdd(false);
  };

  const onEditPress = (post: Post): void => {
    setPostSelected(post);
    setPostSelectedContent(post.content);
    setIsShowAdd(true);
  };

  const onOkPress = (): void => {
    const newPost: Post = {
      ...postSelected,
      content: postSelectedContent,
    }

    console.log(newPost);
    props.onEditPost(newPost);
    setIsShowAdd(false);
  };

  const onDeleteConfirm = (post: Post): void => {
    props.onDeletePostPress(post);
  };

  const onDeletePress = (post: Post): void => {
    setPostSelected(post);
    alerts.confirm({
      message: 'Are you sure?',
      onResult: (result) => {
        if (result) {
          onDeleteConfirm(post);
        }
      },
    })
  };

  const renderEditCard = (): React.ReactElement => {
    return (
      <Modal
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationInTiming={500}
        isVisible={isShowAdd}
        style={{ margin: 0, paddingHorizontal: pxToPercentage(37) }}>
        <View style={themedStyle.sectionAddNotifications}>
          <Text style={themedStyle.txtAddNotificationsModal}>
            {'Enter post'}
          </Text>
          <TextInput
            textAlignVertical="top"
            style={themedStyle.inputNote}
            autoFocus
            multiline
            value={postSelectedContent}
            onChangeText={(text) => setPostSelectedContent(text)}
          />
          <View style={themedStyle.viewAddNotificationsBottom2}>
            <TouchableOpacity activeOpacity={0.75} onPress={onCancelAddPress}>
              <Text style={themedStyle.txtCloseAddNotificationsModal}>
                {'CANCEL'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.75} onPress={onOkPress}>
              <Text style={themedStyle.txtCloseAddNotificationsModal}>
                {'OK'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderColumn = (columnIndex: number): React.ReactElement => {
    return (
      <View style={{ padding: pxPhone(12) }}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={themedStyle.viewButton}
          onPress={() => onAddPost(columnIndex)}>
          <Text style={themedStyle.txtSignUp}>
            {columnIndex === 0 ? 'TO DO' : columnIndex === 1 ? 'IN PROGRESS' : 'DONE'}
          </Text>
        </TouchableOpacity>
        <InputItem
          onIconPress={() => onAddPost(columnIndex)}
          icon={SendIcon}
          placeholder={'Add new post'}
          value={post}
          title={'Post'}
          inputContainerStyle={themedStyle.viewInput}
          onInputTextChange={setPost} />
        {props.session.posts.map((item, index) => {
          if (item.column === columnIndex) {
            return (
              <View style={themedStyle.card2}>
                <Text key={index}>
                  {item.content}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => onDeletePress(item)}
                    activeOpacity={0.75}>
                    <Text style={[themedStyle.txtAction, { color: 'red' }]}>
                      {'Delete'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onEditPress(item)}
                    activeOpacity={0.75}>
                    <Text style={themedStyle.txtAction}>
                      {'Edit'}
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
            );
          }
        })}
      </View>
    );
  };

  return (
    <React.Fragment>
      <FlatList
        data={props.session.columns}
        extraData={props.session.columns}
        renderItem={item => {
          return renderColumn(item.index);
        }}>
      </FlatList>
      {renderEditCard()}
    </React.Fragment>
  );
};

export const Board = withStyles(BoardComponent, (theme: ThemeType) => ({
  iconSend: {
    width: pxPhone(30),
    height: pxPhone(30),
  },
  txtAction: {
    marginLeft: pxPhone(10),
    ...textStyle.proTextBold,
  },
  txtSignUp: {
    lineHeight: pxToPercentage(25),
    ...textStyle.proTextBold,
  },
  viewButton: {
    borderRadius: pxToPercentage(9),
    marginTop: pxToPercentage(20),
    height: pxToPercentage(40),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme['color-green-1'],
  },
  txtPlaceholder: {
    color: theme['color-basic-dark-100'],
    fontSize: 30,
    ...textStyle.proDisplayRegular,
  },
  viewInput: {
    marginTop: pxPhone(15),
    height: pxToPercentage(40),
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
    padding: pxPhone(12),
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
  card2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: pxToPercentage(5),
    paddingHorizontal: pxToPercentage(15),
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
