import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { View, Text, TouchableOpacity, Picker, TextInput, ScrollView, Image, Alert, AppState, RefreshControl } from 'react-native';
import { EvaArrowIcon, AddIcon, TrashIcon } from '@src/assets/icons';
import { textStyle } from '@src/components/textStyle';
import { pxPhone, pxToPercentage } from '@src/core/utils/utils';
import { BoardRepository } from 'react-native-draganddrop-board';
import { Board } from 'react-native-draganddrop-board';
import Modal from 'react-native-modal';
import io from 'socket.io-client';
import { Actions } from '@src/core/utils/constants';
import { User } from '@src/core/models/user/user.model';
import { Post, Session } from '@src/core/models/type';
import { viewStyle } from '@src/components/viewStyle';
import { BoardMetaData } from '@src/core/models/board/board.model';
import { UserState } from '@src/core/store/reducer/user';
import { useDispatch, useSelector } from 'react-redux';
import { onThunkDeleteBoardReq } from './store/thunk';
import { Dispatch } from 'redux';
import { onThunkGetPrePublicBoardsReq } from '../board/store/thunk';
interface ComponentProps {
  onBoardPress: (sessionId: string) => void;
  onCreateBoard: () => void;
  boards: BoardMetaData[];
  session: Session;
  onReceivePost: (post: Post) => void;
  onReceiveBoard: (board: Session) => void;
  user: User;
  name: string;
  onBackPress: () => void;
  sessionId: string;
}

export type HomeProps = ComponentProps & ThemedComponentProps;

const fakeData = [
  {
    id: 1,
    name: 'TO DO',
    rows: [
      {
        id: '1',
        name: 'Analyze your audience',
        description:
          'Learn more about the audience to whom you will be speaking',
      },
      {
        id: '2',
        name: 'Select a topic',
        description:
          'Select a topic that is of interest to the audience and to you',
      },
      {
        id: '3',
        name: 'Define the objective',
        description:
          'Write the objective of the presentation in a single concise statement',
      },
    ],
  },
  {
    id: 2,
    name: 'IN PROGRESS',
    rows: [
      {
        id: '4',
        name: 'Look at drawings',
        description: 'How did they use line and shape? How did they shade?',
      },
      {
        id: '5',
        name: 'Draw from drawings',
        description: 'Learn from the masters by copying them',
      },
      {
        id: '6',
        name: 'Draw from photographs',
        description:
          'For most people, it’s easier to reproduce an image that’s already two-dimensional',
      },
    ],
  },
  {
    id: 3,
    name: 'DONE',
    rows: [
      {
        id: '7',
        name: 'Draw from life',
        description: 'Do you enjoy coffee? Draw your coffee cup',
      },
      {
        id: '8',
        name: 'Take a class',
        description: 'Check your local university extension',
      },
    ],
  },
];

const boardRepositoryFake = new BoardRepository(fakeData);

const HomeComponent: React.FunctionComponent<HomeProps> = (props) => {
  const dispatch: Dispatch<any> = useDispatch();
  const { themedStyle, boards } = props;
  const [isShowPicker, setIsShowPicker] = useState<boolean>(false);
  const [isShowAdd, setIsShowAdd] = useState<boolean>(false);
  const [idColumnAddSelected, setColumnAddSelected] = useState<number>(0);
  const [cardName, setCardName] = useState<string>('');
  const [boardRepository, setBoardRepository] = useState(fakeData);
  const [lastId, setLastId] = useState<number>(8);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [cardID, setCardID] = useState<string>('');
  const [socket, setSocket] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const user = props.user;

  const onCancle = (): void => {
    setIsShowPicker(false);
  };

  const onOkPress = (): void => {
    if (!isEdit) {
      onAddCard(idColumnAddSelected);
      setIsShowAdd(false);
    } else {
      const newData = boardRepository;

      boardRepository.forEach((item, itemIndex) => {
        item.rows.forEach((row, rowIndex) => {
          if (row.id === cardID) {
            newData[itemIndex].rows[rowIndex].name = cardName;
          }
        });
      });

      boardRepositoryFake.updateData(newData);
      setBoardRepository(newData);
      setIsShowAdd(false);
      setIsEdit(false);
    }
  };

  const onRemoveCard = (idCard: string): void => {
    const newData = boardRepository;

    boardRepository.forEach((item, index) => {
      item.rows.forEach((card) => {
        if (card.id === cardID) {
          newData[index].rows = newData[index].rows.filter((row) => {
            return row.id !== idCard;
          });
        }
      });
    });

    boardRepositoryFake.updateData(newData);
    setBoardRepository(newData);
  };

  const onAddCard = (idColumn: number, card?: any): void => {
    const newData = boardRepository;

    boardRepository.forEach((item, index) => {
      if (item.id === idColumn) {
        let newItem: any;
        if (card) {
          newItem = card;
        } else {
          newItem = {
            id: `${lastId + 1}`,
            name: cardName,
            description: '',
          };
        }
        newData[index].rows.push(newItem);
        setLastId(lastId + 1);
      }
    });

    boardRepositoryFake.updateData(newData);
    setBoardRepository(newData);
  };

  const onDeletePress = (): void => {
    onRemoveCard(cardID);
    setIsShowAdd(false);
    setIsEdit(false);
  };

  const onDragEnd = (): void => { };

  const onCancelAddPress = (): void => {
  };

  const onIconAddPress = (): void => {
    // setIsShowPicker(true);
    props.onCreateBoard();
  };

  const onColumnPress = (id: number): void => {
    setCardName('');
    setIsShowPicker(false);
    setColumnAddSelected(id);
    setTimeout(() => {
      setIsShowAdd(true);
    }, 500);
  };

  const renderAddCard = (): React.ReactElement => {
    return (
      <Modal
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationInTiming={500}
        isVisible={isShowAdd}
        style={{ margin: 0, paddingHorizontal: pxToPercentage(37) }}>
        <View style={themedStyle.sectionAddNotifications}>
          <Text style={themedStyle.txtAddNotificationsModal}>
            {'Enter card'}
          </Text>
          <TextInput
            textAlignVertical="top"
            style={themedStyle.inputNote}
            autoFocus
            multiline
            value={cardName}
            onChangeText={(text) => setCardName(text)}
          />
          <View style={themedStyle.viewAddNotificationsBottom2}>
            {isEdit && (
              <TouchableOpacity activeOpacity={0.75} onPress={onDeletePress}>
                <Text style={themedStyle.txtCloseAddNotificationsModal}>
                  {'DELETE'}
                </Text>
              </TouchableOpacity>
            )}
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

  const renderPicker = (): React.ReactElement => {
    return (
      <Modal
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationInTiming={500}
        isVisible={isShowPicker}
        style={{ margin: 0, paddingHorizontal: pxToPercentage(37) }}>
        <View style={themedStyle.sectionAddNotifications}>
          <Text style={themedStyle.txtAddNotificationsModal}>
            {'Select column'}
          </Text>
          {fakeData.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <View style={themedStyle.card}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => onColumnPress(item.id)}>
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            );
          })}
          <View style={themedStyle.viewAddNotificationsBottom}>
            <TouchableOpacity activeOpacity={0.75} onPress={onCancle}>
              <Text style={themedStyle.txtCloseAddNotificationsModal}>
                {'CANCEL'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCard = (item): React.ReactElement => {
    return (
      <View style={themedStyle.card}>
        <Text>{item.name}</Text>
      </View>
    );
  };

  const onItemPress = (item): void => {
    setCardID(item.id);
    setCardName(item.name);
    setIsShowAdd(true);
    setIsEdit(true);
  };

  const onBoardPress = (sessionId: string) => {
    props.onBoardPress(sessionId);
  };

  const convertDateTime = (boardCreated: String): String => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours(); 
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();


    var boardCreatedDateTime = new Date(String(boardCreated));
    var timeZone = boardCreatedDateTime.getTimezoneOffset();
    // console.log("boardCreatedDateTime:", boardCreatedDateTime);
    // console.log("datetime:", date + " " + month + " " + year + " " + hours + " " + min + " " + sec);

    const convertYear = year - boardCreatedDateTime.getFullYear();
    if(convertYear > 1){
      return convertYear + " years ago";
    }
    if(convertYear > 0){
      return convertYear + " year ago";
    }
    
    const convertMonth = month - (boardCreatedDateTime.getMonth() + 1);
    if(convertMonth > 1){
      return convertMonth + " months ago";
    }
    if(convertMonth > 0){
      return convertMonth + " month ago";
    }
    
    const convertDate = date - boardCreatedDateTime.getDate();
    if(convertDate > 1){
      return convertDate + " days ago";
    }
    if(convertDate > 0){
      return convertDate + " day ago";
    }
    const convertHour = hours - boardCreatedDateTime.getHours();
    if(convertHour > 1){
      return convertHour + " hours ago";
    }
    if(convertHour > 0){
      return convertHour + " hour ago";
    }
    
    const convertMin = min - boardCreatedDateTime.getMinutes();
    if(convertMin > 1){
      return convertMin + " minutes ago";
    }
    if(convertMin > 0){
      return convertMin + " minute ago";
    }
    return "less than a minute ago";
  }
  const onSuccess = (): void => {
  };
  const onError = (): void => {
  };
  const onPressDeleteBoard = (idBoard: String): void => {
    console.log("id board:", idBoard);
    Alert.alert(
      'Deleting "My Retrospective" ?',
      'Deleting a session is irreversible. It will delete all posts, votes, groups, and the session itself. The data cannot be restored.Are you sure you want to delete this session and all its content?',
      [
        {
          text: "YES, I'M SURE",
          onPress: () => {
            dispatch(onThunkDeleteBoardReq(idBoard, onSuccess, onError));
            onRefresh();
          },
          style: "destructive"
        },
        {
          text: "NO, I'M SORRY, I MADE A MISTAKE",
          onPress: () => {

          },
          style: "cancel"
        },

      ],
      { cancelable: true },
    );
  }
  const renderBoard = (board: BoardMetaData): React.ReactElement => {
    return (
      <TouchableOpacity
        onPress={() => onBoardPress(board.id)}
        activeOpacity={0.75}
        style={themedStyle.viewBoard}>
        <View style={themedStyle.sectionText}>
          <View style={themedStyle.viewBoardDelete}>
            <Text style={themedStyle.txtBoardTitle}>{convertDateTime(String(board.created))}</Text>
            <TouchableOpacity onPress={() => onPressDeleteBoard(board.id)}>
             {TrashIcon(themedStyle.buttonDelete)}
            </TouchableOpacity>
          </View>
          <Text style={themedStyle.txtRetrospective}>{'My Retrospective'}</Text>
          <Text style={themedStyle.txtBoardTitle}>
            {`Create by ${board.createdBy.name}`}
          </Text>
        </View>
        <View style={themedStyle.viewBoardInfomation}>
          <View style={themedStyle.viewBoardInfoItem}>
            <Text style={{ color: "green", fontSize: pxToPercentage(18) }}>{board.numberOfPosts}</Text>
            <Text>{'Post'}</Text>
          </View>
          <View style={themedStyle.viewBoardInfoItem}>
            <Text style={{ color: "blue", fontSize: pxToPercentage(18) }}>{board.participants.length}</Text>
            <Text>{'Participants'}</Text>
          </View>
          <View style={themedStyle.viewBoardInfoItem}>
            <Text style={{ color: "red", fontSize: pxToPercentage(18) }}>
              {board.numberOfPositiveVotes + board.numberOfNegativeVotes}
            </Text>
            <Text>{'Votes'}</Text>
          </View>
          <View style={themedStyle.viewBoardInfoItem}>
            <Text style={{ color: "orange", fontSize: pxToPercentage(18) }}>{board.numberOfActions}</Text>
            <Text>{'Actions'}</Text>
          </View>
        </View>
        <View style={themedStyle.viewParticipants}>
          {board.participants.map((item) => {
            return (<View style={themedStyle.viewviewParticipantPhoto}>
              <Image
                source={{ uri: `https://www.gravatar.com/avatar/$%7Bmd5(${user.id})%7D?d=retro` }}
                style={themedStyle.image}
              />
            </View>);
          })}
        </View>
      </TouchableOpacity>
    );
  };

  const onGetBoardSuccess = (): void => {
  };

  const onGetBoardError = (): void => {
  };
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = (): void => {
    setRefreshing(true);
    dispatch(onThunkGetPrePublicBoardsReq(
      onGetBoardSuccess,
      onGetBoardError,
    ));
    wait(500).then(() => setRefreshing(false));
  };
  return (
    <View style={themedStyle.container}>
      <Text style={themedStyle.txtHeader}>Public board</Text>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: pxPhone(20) }}>
        {boards.map((item) => {
          return renderBoard(item);
        })}
      </ScrollView>
      <TouchableOpacity
        onPress={onIconAddPress}
        activeOpacity={0.75}
        style={themedStyle.viewAdd}>
        {AddIcon(themedStyle.iconAdd)}
      </TouchableOpacity>

      {/* <View style={themedStyle.viewHeader}>
        <View style={{
          marginTop: pxToPercentage(40), justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
          <TouchableOpacity
            style={themedStyle.viewIcon}
            onPress={props.onBackPress}
            activeOpacity={0.75}>
            {EvaArrowIcon(themedStyle.icon)}
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={themedStyle.txtHeader}>
              {'Home'}
            </Text>
          </View>
        </View>
      </View>
      {/* <Text style={themedStyle.txtHome}>
      </Text> */}
      {/* <Board
        boardRepository={boardRepositoryFake}
        open={onItemPress}
        onDragEnd={(srcColumnId, destColumnId, draggedItem) => { }}
        cardContent={(item) => renderCard(item)}
      />
      <TouchableOpacity
        onPress={onIconAddPress}
        activeOpacity={0.75}
        style={themedStyle.viewAdd}>
        {AddIcon(themedStyle.iconAdd)}
      </TouchableOpacity>
      {renderPicker()}
      {renderAddCard()}  */}
    </View>
  );
};

export const Home = withStyles(HomeComponent, (theme: ThemeType) => ({
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
    marginTop: pxPhone(15),
    marginBottom: pxPhone(40),
    flexDirection: 'row',
    width: '100%',
  },
  viewBoardDelete: {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: pxToPercentage(10),
  },
  image: {
    marginRight: pxPhone(5),
    width: pxPhone(35),
    height: pxPhone(35),
    borderRadius: pxPhone(25),
    backgroundColor: theme['color-purple'],
    ...viewStyle.shadow2,
  },
  buttonDelete: {
    marginRight: pxPhone(5),
    width: pxPhone(20),
    height: pxPhone(20),
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
    marginTop: pxPhone(15),
    backgroundColor: "#d6d4d1",
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  sectionText: {
    marginLeft: pxPhone(15),
  },
  viewBoard: {
    marginTop: pxPhone(15),
    alignSelf: 'center',
    backgroundColor: theme['color-basic-light-100'],
    width: pxToPercentage(340),
    borderRadius: pxToPercentage(10),
    ...viewStyle.shadow2,
  },
  iconUncheck: {
    height: pxToPercentage(20),
    width: pxToPercentage(20),
  },
  container: {
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
    fontSize: pxToPercentage(20),
    ...textStyle.proDisplayRegular,
    marginLeft: 20,
    marginTop: 20,
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
  txtBoardTitle: {
    fontSize: pxToPercentage(15),
    color: 'gray'
  },
  txtRetrospective: {
    fontSize: pxToPercentage(16),
    color: 'black'
  },

}));
