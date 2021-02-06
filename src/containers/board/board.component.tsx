import React, { useState, useEffect, useMemo, useCallback, useRef, createRef } from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { View, Text, TouchableOpacity, Picker, TextInput, ScrollView, FlatList, Clipboard, Group } from 'react-native';
import { EvaArrowIcon, AddIcon, SendIcon, TrashIcon, MoveIcon, EditIcon, ShareIcon, LikeIcon, DislikeIcon, EditIcon2, ActionIcon } from '@src/assets/icons';
import { textStyle } from '@src/components/textStyle';
import { getBetween, getMiddle, getNext, getPrevious, pxPhone, pxToPercentage } from '@src/core/utils/utils';
import { BoardRepository } from 'react-native-draganddrop-board';
import Modal from 'react-native-modal';
import io from 'socket.io-client';
import { Actions } from '@src/core/utils/constants';
import { User } from '@src/core/models/user/user.model';
import { ColumnContent, ColumnDefinition, Post, PostGroup, Session } from '@src/core/models/type';
import { viewStyle } from '@src/components/viewStyle';
import { BoardMetaData } from '@src/core/models/board/board.model';
import { InputItem } from '@src/components/input/inputItem.component';
import { alerts } from '@src/core/utils/alerts';
import { calculateRank, getMovingEntities } from './moving-logic';

interface ComponentProps {
  columns: ColumnContent[];
  session: Session;
  onAddPost: (columnIndex: number, content: string, rank: string) => void;
  onEditPost: (post: Post) => void;
  onDeletePostPress: (post: Post) => void;
  onLike: (post: Post, like: boolean) => void;
  onDeletePostGroup: (group: PostGroup) => void;
  onEditPostGroup: (group: PostGroup) => void;
  onMovePost: (post: Post,
    destinationGroup: PostGroup | null,
    destinationColumn: number,
    newRank: string) => void;
}

export type BoardProps = ComponentProps & ThemedComponentProps;

const BoardComponent: React.FunctionComponent<BoardProps> = (props) => {
  const { themedStyle } = props;
  const [post, setPost] = useState<string>('');
  const [isShowAdd, setIsShowAdd] = useState<boolean>(false);
  const [isShowMove, setIsShowMove] = useState<boolean>(false);
  const [postSelected, setPostSelected] = useState<Post>(undefined);
  const [groupSelected, setGroupSelected] = useState<PostGroup>(undefined);
  const [postGroupSelectedContent, setPostGroupSelectedContent] = useState<string>('');
  const [actionIndex, setActionIndex] = useState<string>(undefined);
  const [postSelectedContent, setPostSelectedContent] = useState<string>('');
  const [postActionSelectedContent, setPostActionSelectedContent] = useState<string>('');
  const [desColumnSelected, setDesColumnSelected] = useState<ColumnDefinition>(undefined);


  const calculateRankForNewPost = (column: ColumnContent): string => {
    if (column.posts.length) {
      return getNext(column.posts[column.posts.length - 1].rank);
    }
    return getMiddle();
  };

  const onAddPost = (column: ColumnContent): void => {
    props.onAddPost(column.index, post, calculateRankForNewPost(column));
    setPost('');
    inputEl2.current.clear();
  };

  const onCancelAddPress = (): void => {
    setIsShowAdd(false);
  };

  const onOkPress = (): void => {
    const newPost: Post = {
      ...postSelected,
      content: postSelectedContent,
      action: postActionSelectedContent,
    }

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

  const onActionIconPress = (post: Post): void => {
    setPostSelected(post);
    setPostSelectedContent(post.content);
    if (post.action) {
      setPostActionSelectedContent(post.action);
    } else {
      setPostActionSelectedContent('');
    }
    setIsShowAdd(true);
  };

  const renderEditCard = (): React.ReactElement => {
    return (
      <Modal
        animationIn='slideInUp'
        animationOut='slideOutDown'
        animationInTiming={1}
        animationOutTiming={1}
        backdropTransitionInTiming={1}
        backdropTransitionOutTiming={1}
        isVisible={isShowAdd}
        style={{ margin: 0, paddingHorizontal: pxToPercentage(37) }}>
        <View style={themedStyle.sectionAddNotifications}>
          <Text style={themedStyle.txtAddNotificationsModal}>
            {'Enter action'}
          </Text>
          <TextInput
            textAlignVertical="top"
            style={themedStyle.inputNote}
            autoFocus
            multiline
            value={postActionSelectedContent}
            onChangeText={(text) => setPostActionSelectedContent(text)}
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

  const onDesColumnSelected = (column: ColumnContent): void => {
    const newRank = calculateRankForNewPost(column);
    props.onMovePost(postSelected, null, column.index, newRank);
    setIsShowMove(false);
  };

  const renderSelectComlumnModal = (): React.ReactElement => {
    return (
      <Modal
        isVisible={isShowMove}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        animationInTiming={1}
        animationOutTiming={1}
        backdropTransitionInTiming={1}
        backdropTransitionOutTiming={1}
        style={{ alignItems: 'center' }}>
        <View style={themedStyle.box}>
          <Text style={themedStyle.txtNote}>
            {'Move to column: '}
          </Text>
          {onRenderColumnName()}
          <TouchableOpacity
            style={themedStyle.btnCancel}
            activeOpacity={0.75}
            onPress={() => setIsShowMove(false)}>
            <Text style={themedStyle.txtCancel}>
              {'Cancel'}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  };

  const onVotePress = (post: Post, like: boolean): void => {
    props.onLike(post, like);
  };

  const onPostFocus = (post: Post): void => {
    setPostSelected(post);
    setPostSelectedContent(post.content);
    setPostActionSelectedContent(post.action);
  };

  const onGroupFocus = (group: PostGroup): void => {
    setGroupSelected(group);
    setPostSelectedContent(group.label);
  };

  const onEditIconPress = (post: Post): void => {
    setPostSelected(post);
    setPostSelectedContent(post.content);
  };

  const onPostUnFocus = (): void => {
    const newPost: Post = {
      ...postSelected,
      content: postSelectedContent,
      action: postActionSelectedContent,
    }


    props.onEditPost(newPost);
  }

  const onPostGroupUnFocus = (): void => {
    const newPostGroup: PostGroup = {
      ...groupSelected,
      label: postGroupSelectedContent,
    }


    props.onEditPostGroup(newPostGroup);
  }

  const inputEl2 = useRef(null);

  // const renderPost = (group: PostGroup): React.ReactElement => {
  //   // console.log(group.posts, 'postttt', props.columns[group.column].color)
  //   group.posts.map((post) => {
  //     return (
  //       <React.Fragment>

  //       </React.Fragment>
  //     );
  //   })
  // };

  const renderColumn = (column: ColumnContent): React.ReactElement => {
    return (
      <View style={themedStyle.sectionColumn}>
        <InputItem
          customRef={inputEl2}
          iconStyle={themedStyle.iconSend}
          onIconPress={() => onAddPost(column)}
          icon={SendIcon}
          placeholder={column.label}
          // value={post}
          title={'Post'}
          inputContainerStyle={themedStyle.viewInput}
          onInputTextChange={setPost} />
        {
          column.groups.map(group => {
            return (
              <View style={themedStyle.viewGroup}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: pxPhone(12), marginTop: pxPhone(12), paddingHorizontal: pxPhone(12) }}>
                  <TextInput
                    multiline
                    style={{ maxWidth: '85%', fontSize: pxPhone(20), padding: 0, color: 'gray' }}
                    onChangeText={setPostGroupSelectedContent}
                    onEndEditing={onPostGroupUnFocus}
                    onFocus={() => onGroupFocus(group)}>
                    {group.label}
                  </TextInput>
                  <TouchableOpacity
                    onPress={() => { }}
                    activeOpacity={0.75}>
                    {EditIcon2({ height: pxPhone(10), width: pxPhone(10), marginLeft: pxPhone(5) })}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, alignItems: 'flex-end' }}
                    onPress={() => { props.onDeletePostGroup(group) }}
                    activeOpacity={0.75}>
                    {TrashIcon({ height: pxPhone(20), width: pxPhone(20) })}
                  </TouchableOpacity>
                </View>
                {group.posts.length === 0
                  ? <View style={{ backgroundColor: '#EBF3FD', padding: pxPhone(20), margin: pxPhone(20), borderRadius: pxPhone(8) }}>
                    <Text style={themedStyle.txtEmpty}>
                      {'This is an empty group'}
                    </Text>
                    <Text style={themedStyle.txtEmpty2}>
                      {'Move a post here to fill this group'}
                    </Text>
                  </View>
                  : group.posts.map(item => {
                    return (
                      <View style={themedStyle.sectionCard}>
                        <View style={themedStyle.viewContent}>
                          <TextInput
                            multiline
                            style={{ maxWidth: '90%' }}
                            onChangeText={setPostSelectedContent}
                            onEndEditing={onPostUnFocus}
                            onFocus={() => onPostFocus(item)}>
                            {item.content}
                          </TextInput>
                          <TouchableOpacity
                            onPress={() => onEditIconPress(item)}
                            activeOpacity={0.75}>
                            {EditIcon2({ height: pxPhone(10), width: pxPhone(10) })}
                          </TouchableOpacity>
                        </View>
                        {(actionIndex === item.id || item.action !== null && item.action.length > 0) && <View style={themedStyle.viewAction}>
                          <Text style={{ fontSize: pxPhone(13) }}>
                            {'Action:'}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                              multiline
                              style={{ maxWidth: '90%', padding: 0 }}
                              onChangeText={setPostActionSelectedContent}
                              onEndEditing={onPostUnFocus}
                              onFocus={() => onPostFocus(item)}>
                              {item.action}
                            </TextInput>
                            <TouchableOpacity
                              onPress={() => onEditIconPress(item)}
                              activeOpacity={0.75}>
                              {EditIcon2({ height: pxPhone(10), width: pxPhone(10), marginLeft: pxPhone(2) })}
                            </TouchableOpacity>
                          </View>
                        </View>}
                        <View style={[themedStyle.card2, { backgroundColor: column.color }]}>
                          <View style={themedStyle.viewVotes}>
                            <TouchableOpacity
                              onPress={() => onVotePress(item, true)}
                              activeOpacity={0.75}
                              style={themedStyle.viewVote}>
                              {LikeIcon(themedStyle.iconLike)}
                            </TouchableOpacity>
                            <Text style={themedStyle.txtVote}>
                              {item.votes.filter(vote => vote.type === 'like').length}
                            </Text>
                            <TouchableOpacity
                              onPress={() => onVotePress(item, false)}
                              activeOpacity={0.75}
                              style={themedStyle.viewVote}>
                              {DislikeIcon([themedStyle.actionIcon, themedStyle.iconDisLike])}
                            </TouchableOpacity>
                            <Text style={themedStyle.txtVote}>
                              {item.votes.filter(vote => vote.type === 'dislike').length}
                            </Text>
                          </View>
                          <View style={[themedStyle.viewActions]}>
                            <TouchableOpacity
                              onPress={() => onDeletePress(item)}
                              activeOpacity={0.75}>
                              {TrashIcon([themedStyle.actionIcon, themedStyle.iconTrash])}
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => onActionIconPress(item)}
                              activeOpacity={0.75}>
                              {ActionIcon([themedStyle.actionIcon])}
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => onMoveIconPress(item)}
                              activeOpacity={0.75}>
                              {MoveIcon(themedStyle.actionIcon)}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )
                  })}
              </View>
            )
          })}
        {column.posts.map((item) => {
          return (
            <View style={themedStyle.sectionCard}>
              <View style={themedStyle.viewContent}>
                <TextInput
                  multiline
                  style={{ maxWidth: '90%' }}
                  onChangeText={setPostSelectedContent}
                  onEndEditing={onPostUnFocus}
                  onFocus={() => onPostFocus(item)}>
                  {item.content}
                </TextInput>
                <TouchableOpacity
                  onPress={() => onEditIconPress(item)}
                  activeOpacity={0.75}>
                  {EditIcon2({ height: pxPhone(10), width: pxPhone(10) })}
                </TouchableOpacity>
              </View>
              {(actionIndex === item.id || item.action !== null && item.action.length > 0) && <View style={themedStyle.viewAction}>
                <Text style={{ fontSize: pxPhone(13) }}>
                  {'Action:'}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    multiline
                    style={{ maxWidth: '90%', padding: 0 }}
                    onChangeText={setPostActionSelectedContent}
                    onEndEditing={onPostUnFocus}
                    onFocus={() => onPostFocus(item)}>
                    {item.action}
                  </TextInput>
                  <TouchableOpacity
                    onPress={() => onEditIconPress(item)}
                    activeOpacity={0.75}>
                    {EditIcon2({ height: pxPhone(10), width: pxPhone(10), marginLeft: pxPhone(2) })}
                  </TouchableOpacity>
                </View>
              </View>}
              <View style={[themedStyle.card2, { backgroundColor: column.color }]}>
                <View style={themedStyle.viewVotes}>
                  <TouchableOpacity
                    onPress={() => onVotePress(item, true)}
                    activeOpacity={0.75}
                    style={themedStyle.viewVote}>
                    {LikeIcon(themedStyle.iconLike)}
                  </TouchableOpacity>
                  <Text style={themedStyle.txtVote}>
                    {item.votes.filter(vote => vote.type === 'like').length}
                  </Text>
                  <TouchableOpacity
                    onPress={() => onVotePress(item, false)}
                    activeOpacity={0.75}
                    style={themedStyle.viewVote}>
                    {DislikeIcon([themedStyle.actionIcon, themedStyle.iconDisLike])}
                  </TouchableOpacity>
                  <Text style={themedStyle.txtVote}>
                    {item.votes.filter(vote => vote.type === 'dislike').length}
                  </Text>
                </View>
                <View style={[themedStyle.viewActions]}>
                  <TouchableOpacity
                    onPress={() => onDeletePress(item)}
                    activeOpacity={0.75}>
                    {TrashIcon([themedStyle.actionIcon, themedStyle.iconTrash])}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onActionIconPress(item)}
                    activeOpacity={0.75}>
                    {ActionIcon([themedStyle.actionIcon])}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onMoveIconPress(item)}
                    activeOpacity={0.75}>
                    {MoveIcon(themedStyle.actionIcon)}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        })}
      </View>
    );
  };

  const onMoveIconPress = (post: Post): void => {
    setIsShowMove(true);
    setPostSelected(post);
  };

  const onRenderColumnName = (): React.ReactElement => {
    return <FlatList
      data={props.columns}
      extraData={props.columns}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <React.Fragment>
          <View style={themedStyle.hr} />
          <TouchableOpacity
            style={{ marginTop: pxPhone(5) }}
            activeOpacity={0.75}
            onPress={() => onDesColumnSelected(item)}>
            <Text style={{ textAlign: 'center' }}>
              {item.type}
            </Text>
          </TouchableOpacity>
        </React.Fragment>
      )}
    />;
  };

  return (
    <React.Fragment>
      <FlatList
        data={props.columns}
        extraData={props.columns}
        renderItem={({ item, index }) => {
          return renderColumn(item);
        }}>
      </FlatList>
      {renderEditCard()}
      {renderSelectComlumnModal()}
    </React.Fragment >
  );
};

export const Board = withStyles(BoardComponent, (theme: ThemeType) => ({
  txtEmpty: {
    ...textStyle.proDisplayBold,
  },
  txtEmpty2: {
    ...textStyle.proDisplayRegular,
  },
  txtGroupName: {
    fontSize: pxPhone(20),
    color: 'red',
  },
  viewGroup: {
    marginTop: pxPhone(10),
    borderColor: 'gray',
    borderWidth: pxPhone(1),
    borderStyle: 'dashed',
    borderRadius: pxPhone(5),
    padding: pxPhone(3),
  },
  sectionColumn: {
    paddingVertical: pxPhone(12),
    paddingHorizontal: pxPhone(25),
    margin: pxPhone(12),
    borderRadius: pxPhone(8),
    backgroundColor: '#F4F4F7',
  },
  viewContent: {
    flexDirection: 'row',
    paddingLeft: pxPhone(13),
    alignItems: 'center',
  },
  viewAction: {
    padding: pxPhone(16),
    backgroundColor: theme['color-gray-1600'],
  },
  txtVote: {
    ...textStyle.proDisplayRegular,
    left: pxPhone(-5),
  },
  viewVote: {
  },
  iconLike: {
    width: pxPhone(22),
    height: pxPhone(22),
    tintColor: theme['color-green-3'],
    top: pxPhone(-3),
  },
  iconDisLike: {
    tintColor: 'red',
  },
  viewVotes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: pxPhone(80),
    height: pxPhone(25),
    alignItems: 'center',
  },
  iconSend: {
    tintColor: theme['color-green-1'],
    width: pxPhone(22),
    height: pxPhone(22),
  },
  txtCancel: {
    color: '#FF708D',
    ...textStyle.proTextBold,
    fontSize: pxPhone(15),
  },
  btnCancel: {
    width: pxPhone(285),
    height: pxPhone(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtNote: {
    fontSize: pxPhone(15),
    ...textStyle.proTextBold,
    textAlign: 'center',
  },
  box: {
    borderRadius: pxPhone(10),
    alignItems: 'center',
    width: pxPhone(285),
    height: pxPhone(170),
    paddingTop: pxPhone(15),
    backgroundColor: theme['color-basic-light-100'],
  },
  boxCreateBoard: {
    borderRadius: pxPhone(10),
    alignItems: 'center',
    width: '80%',
    height: '80%',
    paddingTop: pxPhone(15),
    backgroundColor: theme['color-basic-light-100'],
  },
  sectionSite: {
    marginTop: pxPhone(10),
  },
  hr: {
    marginTop: pxPhone(10),
    height: pxPhone(1),
    width: pxPhone(285),
    backgroundColor: '#BDBDBD',
  },
  viewActions: {
    flexDirection: 'row',
    width: pxPhone(80),
    justifyContent: 'space-between',
  },
  actionIcon: {
    width: pxPhone(18),
    height: pxPhone(18),
  },
  iconTrash: {
    tintColor: 'red',
  },
  txtAction: {
    marginLeft: pxPhone(10),
    ...textStyle.proTextBold,
  },
  txtSignUp: {
    color: theme['color-basic-light-100'],
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
  sectionCard: {
    marginTop: pxToPercentage(15),
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
    height: pxPhone(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: pxToPercentage(3),
    backgroundColor: theme['color-green-2'],
    alignItems: 'center',
    padding: pxPhone(15),
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
    backgroundColor: theme['color-app'],
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
  viewShare: {
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
}));
