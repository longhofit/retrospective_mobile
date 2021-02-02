import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { View, Text, TouchableOpacity, Picker, TextInput, ScrollView, Image, Alert, AppState, RefreshControl, FlatList, Switch } from 'react-native';
import { EvaArrowIcon, AddIcon, TrashIcon, InformationIcon, CheckedIcon } from '@src/assets/icons';
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
import uuid from 'react-native-uuid';
import Slider from '@react-native-community/slider'
import { TabView, SceneMap } from 'react-native-tab-view';
import { color } from 'react-native-reanimated';
interface ComponentProps {
  onBoardPress: (sessionId: string) => void;
  onCreateBoard: (data) => void;
  boards: BoardMetaData[];
  session: Session;
  onReceivePost: (post: Post) => void;
  onReceiveBoard: (board: Session) => void;
  user: User;
  name: string;
  onBackPress: () => void;
  sessionId: string;
}
interface FormSettingState {
  isPrivateBoard: boolean,
  isBlurCards: boolean,
  isAllowActions: boolean,
  isShowAuthor: boolean,
  isAllowReordering: boolean,
  isAllowGrouping: boolean,
  isAllowGiphy: boolean,
}
interface FormVotingState {
  MaxUpVotes: number,
  MaxDownVotes: number,
  isAllowSelfVoting: boolean,
  isAllowMultiple: boolean,
}
const initSettingState: FormSettingState = {
  isPrivateBoard: false,
  isBlurCards: false,
  isAllowActions: true,
  isShowAuthor: false,
  isAllowReordering: true,
  isAllowGrouping: true,
  isAllowGiphy: true,
}
const initVotingState: FormVotingState = {
  MaxUpVotes: 6,
  MaxDownVotes: 6,
  isAllowSelfVoting: false,
  isAllowMultiple: false,
}

export type HomeProps = ComponentProps & ThemedComponentProps;

const templateColumn = [
  {
    options: {
      "allowActions": true,
      "allowMultipleVotes": false,
      "allowSelfVoting": false,
      "allowAuthorVisible": false,
      "maxDownVotes": null,
      "maxUpVotes": null,
      "allowGiphy": true,
      "allowGrouping": true,
      "allowReordering": true,
      "blurCards": false,
      "isPublic": true
    },
    type: 'Default',
    columns: [
      {
        "color": "#E8F5E9",
        "icon": "satisfied",
        "label": "What went well?",
        "id": uuid.v4(),
        "index": 0,
        "type": "well"
      },
      {
        "color": "#FFEBEE",
        "icon": "disatisfied",
        "label": "What could be improved?",
        "id": uuid.v4(),
        "index": 1,
        "type": "notWell"
      },
      {
        "color": "#FFFDE7",
        "icon": "sunny",
        "label": "A brilliant idea to share?",
        "id": uuid.v4(),
        "index": 2,
        "type": "ideas"
      }
    ]
  },
  {
    options: {
      "allowActions": true,
      "allowMultipleVotes": false,
      "allowSelfVoting": false,
      "allowAuthorVisible": false,
      "maxDownVotes": null,
      "maxUpVotes": null,
      "allowGiphy": true,
      "allowGrouping": true,
      "allowReordering": true,
      "blurCards": false,
      "isPublic": true
    },
    type: 'Well / Not Well',
    columns: []
  },
  {
    options: {
      "allowActions": true,
      "allowMultipleVotes": false,
      "allowSelfVoting": false,
      "allowAuthorVisible": false,
      "maxDownVotes": null,
      "maxUpVotes": null,
      "allowGiphy": true,
      "allowGrouping": true,
      "allowReordering": true,
      "blurCards": false,
      "isPublic": false
    },
    type: 'Start / Stop / Continue',
    columns: [
      {
        "color": "#E8F5E9",
        "icon": "play",
        "label": "Start",
        "id": uuid.v4(),
        "index": 0,
        "type": "start"
      },
      {
        "color": "#FFEBEE",
        "icon": "pause",
        "label": "Stop",
        "id": uuid.v4(),
        "index": 1,
        "type": "stop"
      },
      {
        "color": "#BBDEFB",
        "icon": "fast-forward",
        "label": "Continue",
        "id": uuid.v4(),
        "index": 2,
        "type": "continue"
      }
    ]
  },
  { type: 'Four Ls', columns: [] },
  { type: 'Sailboat', columns: [] },
]

const HomeComponent: React.FunctionComponent<HomeProps> = (props) => {
  const dispatch: Dispatch<any> = useDispatch();
  const { themedStyle, boards } = props;
  const [isShowPicker, setIsShowPicker] = useState<boolean>(false);
  const [isShowAdd, setIsShowAdd] = useState<boolean>(false);
  const [idColumnAddSelected, setColumnAddSelected] = useState<number>(0);
  const [cardName, setCardName] = useState<string>('');
  const [lastId, setLastId] = useState<number>(8);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [cardID, setCardID] = useState<string>('');
  const [socket, setSocket] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateBoard, setIsShowCreateBoard] = useState<boolean>(false);
  const [templateSelected, setTemplateSelected] = useState(templateColumn[0]);
  const [isShowBoardTemplate, setIsShowBoardTemplate] = useState<boolean>(false);
  const [settingState, setSettingState] = useState<FormSettingState>(initSettingState);
  const [votingState, setVotingState] = useState<FormVotingState>(initVotingState);
  const templateColumnSetting = [
    {
      header: 'Private Board',
      description: 'Only author and team member can modify this board',
      state: settingState.isPrivateBoard,
    },
    {
      header: 'Blur Cards',
      description: 'Cards content is blurred until the moderator reveals the content',
      state: settingState.isBlurCards,
    },
    {
      header: 'Allow Actions',
      description: `Whether to allow the 'Action' (follow-up) field on each post`,
      state: settingState.isAllowActions,
    },
    {
      header: 'Show Author',
      description: 'Display the author of the post, on the post itself.',
      state: settingState.isShowAuthor,
    },
    {
      header: 'Allow Re-ordering',
      description: 'Allow re-ordering posts by drag-and-drop',
      state: settingState.isAllowReordering,
    },
    {
      header: 'Allow Grouping',
      description: 'Allow the creation of groups to group posts together',
      state: settingState.isAllowGrouping,
    },
    {
      header: 'Allow Giphy',
      description: 'Allow users to set a Giphy image against a post',
      state: settingState.isAllowGiphy,
    },
  ]


  const user = props.user;

  const onCancle = (): void => {
    setIsShowPicker(false);
  };

  const onDragEnd = (): void => { };

  const onCancelAddPress = (): void => {
  };

  const onIconAddPress = (): void => {
    // setIsShowPicker(true);
    setIsShowCreateBoard(true);
  };

  const onColumnPress = (id: number): void => {
    setCardName('');
    setIsShowPicker(false);
    setColumnAddSelected(id);
    setTimeout(() => {
      setIsShowAdd(true);
    }, 500);
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
    var currentDate = new Date();
    var boardCreatedDateTime = new Date(String(boardCreated));

    var timeDiff = Math.abs(currentDate.getTime() - boardCreatedDateTime.getTime());
    var diffDays = Math.ceil(timeDiff/(1000*3600*24));
    var convertYear : number = (diffDays - 1) / 365;
    var monthRemainder : number = (diffDays - 1) % 365;
    var convertMonth : number = monthRemainder / 30;
    var convertDate : number = monthRemainder % 30;


    if (convertYear == 1) {
      return convertYear + " year ago";
    }
    if (convertYear > 1) {
      return convertYear + " years ago";
    }

    
    if (convertMonth == 1) {
      return convertMonth + " month ago";
    }
    if (convertMonth > 1) {
      return convertMonth + " months ago";
    }

    if (convertDate == 1) {
      return convertDate + " day ago";
    }
    if (convertDate > 1) {
      return convertDate + " days ago";
    }

    const convertHour : number = timeDiff/(1000*3600*24) * 24;
    if(convertHour >= 2){
      return parseInt(String(convertHour)) + " hours ago";
    }
    if(convertHour >= 1){
      return parseInt(String(convertHour)) + " hour ago";
    }

    const convertMin : number = convertHour * 60;
    if(convertMin >= 2){
      return parseInt(String(convertMin)) + " minutes ago";
    }
    if(convertMin >= 1){
      return parseInt(String(convertMin)) + " minute ago";
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

  const onTemplatePress = (index: number): void => {
    setTemplateSelected(templateColumn[index]);
    setIsShowCreateBoard(false);
    setIsShowBoardTemplate(true);
  };

  const onColumnNameChange = (text: string, columnIndex: number): void => {
    // setSignInFormData({ ...signInFormData, password });
    let newColumns = templateSelected.columns;
    newColumns[columnIndex].label = text;

    console.log(newColumns)

    setTemplateSelected({ ...templateSelected, columns: newColumns })

  }

  const onRenderColumnName = (): React.ReactElement => {
    return <FlatList
      data={templateColumn}
      extraData={templateColumn}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <React.Fragment>
          <View style={themedStyle.hr} />
          <TouchableOpacity
            style={{ marginTop: pxPhone(5) }}
            activeOpacity={0.75}
            onPress={() => onTemplatePress(index)}>
            <Text style={{ textAlign: 'center' }}>
              {item.type}
            </Text>
          </TouchableOpacity>
        </React.Fragment>
      )}
    />;
  };

  const onRenderColumnTemplate = (): React.ReactElement => {
    return <FlatList
      data={templateSelected.columns}
      extraData={templateSelected.columns}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <React.Fragment>
          <View style={themedStyle.hr} />
          <TextInput
            onChangeText={text => onColumnNameChange(text, item.index)}
            value={item.label}
            style={{ marginTop: pxPhone(5) }}>
          </TextInput>
        </React.Fragment>
      )}
    />;
  };

  const renderCreateCustomBoard = (): React.ReactElement => {
    return (
      <View style={themedStyle.boxSetting}>
        <Text style={themedStyle.txtNote}>
          {'Create custom board'}
        </Text>
        {onRenderColumnName()}
        <TouchableOpacity
          style={themedStyle.btnCancel}
          activeOpacity={0.75}
          onPress={onDoneCreateBoard}>
          <Text style={themedStyle.txtCancel}>
            {'OK'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }


  // render setting
  const onTemplateSettingPress = (index: number): void => {
    console.log("index:", index);
    switch (index) {
      case 0:
        setSettingState({ ...settingState, isPrivateBoard: !settingState.isPrivateBoard });
        setTemplateSelected({ ...templateSelected, options: { ...templateSelected.options, isPublic: !settingState.isPrivateBoard } });
        break;
      case 1:
        setSettingState({ ...settingState, isBlurCards: !settingState.isBlurCards });
        break;
      case 2:
        setSettingState({ ...settingState, isAllowActions: !settingState.isAllowActions });
        break;
      case 3:
        setSettingState({ ...settingState, isShowAuthor: !settingState.isShowAuthor });
        break;
      case 4:
        setSettingState({ ...settingState, isAllowReordering: !settingState.isAllowReordering });
        break;
      case 5:
        setSettingState({ ...settingState, isAllowGrouping: !settingState.isAllowGrouping });
        break;
      case 6:
        setSettingState({ ...settingState, isAllowGiphy: true });
        break;
    }
  };
  const onRenderSettingColumnName = (): React.ReactElement => {
    return <FlatList
      data={templateColumnSetting}
      extraData={templateColumnSetting}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <React.Fragment>
          <View style={themedStyle.containerSetting}>
            <View style={themedStyle.containerHeaderSetting}>
              <Text>{item.header}</Text>
              <Switch
                trackColor={{ false: "#9c9c9c", true: "#7f99b2" }}
                thumbColor={item.state ? "#05386b" : "#fafafa"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => onTemplateSettingPress(index)}
                value={item.state}
              />
            </View>
            <View style={themedStyle.containerInfoSetting}>
              {InformationIcon(themedStyle.iconInformation)}
              <Text style={{ width: '90%', height: '100%' }}>{item.description}</Text>
            </View>
          </View>
        </React.Fragment>
      )}
    />;
  };
  // const renderCreateSettingCustomBoard = (): React.ReactElement => {
  //   return (
  //     <Modal
  //       isVisible={isCreateBoard}
  //       animationIn='slideInUp'
  //       animationOut='slideOutDown'
  //       animationInTiming={1}
  //       animationOutTiming={1}
  //       backdropTransitionInTiming={1}
  //       backdropTransitionOutTiming={1}
  //       style={{ alignItems: 'center' }}>
  //       <View style={themedStyle.boxSetting}>
  //         <Text style={themedStyle.txtNote}>
  //           {'Post setting'}
  //         </Text>
  //         {onRenderSettingColumnName()}
  //         <TouchableOpacity
  //           style={themedStyle.btnCancel}
  //           activeOpacity={0.75}
  //           onPress={() => setIsShowCreateBoard(false)}>
  //           <Text style={themedStyle.txtCancel}>
  //             {'Cancel'}
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </Modal>
  //   )
  // }
  const renderCreateSettingCustomBoard = (): React.ReactElement => {
    return (
      <View style={themedStyle.boxSetting}>
        <View style={themedStyle.HeaderSetting}>
          {CheckedIcon(themedStyle.iconCheckedIcon)}
          <Text style={{
            fontSize: pxPhone(15),
            ...textStyle.proTextBold,
          }}>
            Set the rules about what a user can do when creating or viewing a post
            </Text>
        </View>
        {onRenderSettingColumnName()}
        <TouchableOpacity
          style={themedStyle.btnCancel}
          activeOpacity={0.75}
          onPress={onDoneCreateBoard}>
          <Text style={themedStyle.txtCancel}>
            {'OK'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
  // render setting

  // render voting
  const toggleSwitchAllowSelfVoting = () => setVotingState({ ...votingState, isAllowSelfVoting: !votingState.isAllowSelfVoting });
  const toggleSwitchAllowMultiple = () => setVotingState({ ...votingState, isAllowMultiple: !votingState.isAllowMultiple });
  const sliderMaxUpVotes = (value) => setVotingState({ ...votingState, MaxUpVotes: value });
  const sliderMaxDownVotes = (value) => setVotingState({ ...votingState, MaxDownVotes: value });
  const onRenderVotingColumnName = (): React.ReactElement => {
    return <ScrollView>
      <View style={themedStyle.containerSetting}>
        <View style={themedStyle.containerHeaderVoting}>
          <Text style={{ width: '35%' }}>Max Up-Votes</Text>
          <View style={{ width: '65%' }}>
            <Slider
              style={{ width: '77%', height: 40 }}
              minimumValue={0}
              maximumValue={6}
              value={votingState.MaxUpVotes}
              step={1}
              onValueChange={(value) => sliderMaxUpVotes(value)}
              minimumTrackTintColor="#5cdb95"
              maximumTrackTintColor="#5cdb95"
              thumbTintColor="#5cdb95"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '96%', alignSelf: 'flex-end' }}>
              <Text>0</Text>
              <Text>1</Text>
              <Text>2</Text>
              <Text>3</Text>
              <Text>4</Text>
              <Text>5</Text>
              <Text>Unlimited</Text>
            </View>
          </View>
        </View>
        <View style={themedStyle.containerInfoSetting}>
          {InformationIcon(themedStyle.iconInformation)}
          <Text style={{ width: '90%', height: '100%' }}>Maximum number of 'likes' votes a user is allowed to cast</Text>
        </View>
      </View>

      <View style={themedStyle.containerSetting}>
        <View style={themedStyle.containerHeaderVoting}>
          <Text style={{ width: '35%' }}>Max Down-Votes</Text>
          <View style={{ width: '65%' }}>
            <Slider
              style={{ width: '77%', height: 40 }}
              minimumValue={0}
              maximumValue={6}
              value={votingState.MaxDownVotes}
              step={1}
              onValueChange={(value) => sliderMaxDownVotes(value)}
              minimumTrackTintColor="#5cdb95"
              maximumTrackTintColor="#5cdb95"
              thumbTintColor="#5cdb95"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '96%', alignSelf: 'flex-end' }}>
              <Text>0</Text>
              <Text>1</Text>
              <Text>2</Text>
              <Text>3</Text>
              <Text>4</Text>
              <Text>5</Text>
              <Text>Unlimited</Text>
            </View>
          </View>
        </View>
        <View style={themedStyle.containerInfoSetting}>
          {InformationIcon(themedStyle.iconInformation)}
          <Text style={{ width: '90%', height: '100%' }}>Maximum number of 'dislikes' votes a user is allowed to cast</Text>
        </View>
      </View>

      <View style={themedStyle.containerSetting}>
        <View style={themedStyle.containerHeaderSetting}>
          <Text>Allow Self Voting</Text>
          <Switch
            trackColor={{ false: "#9c9c9c", true: "#7f99b2" }}
            thumbColor={votingState.isAllowSelfVoting ? "#05386b" : "#fafafa"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchAllowSelfVoting}
            value={votingState.isAllowSelfVoting}
          />
        </View>
        <View style={themedStyle.containerInfoSetting}>
          {InformationIcon(themedStyle.iconInformation)}
          <Text style={{ width: '90%', height: '100%' }}>Whether to allow a user to vote on their own post</Text>
        </View>
      </View>

      <View style={themedStyle.containerSetting}>
        <View style={themedStyle.containerHeaderSetting}>
          <Text>Allow Multiple Votes</Text>
          <Switch
            trackColor={{ false: "#9c9c9c", true: "#7f99b2" }}
            thumbColor={votingState.isAllowMultiple ? "#05386b" : "#fafafa"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchAllowMultiple}
            value={votingState.isAllowMultiple}
          />
        </View>
        <View style={themedStyle.containerInfoSetting}>
          {InformationIcon(themedStyle.iconInformation)}
          <Text style={{ width: '90%', height: '100%' }}>Whether to allow a user to vote multiple times on the same post</Text>
        </View>
      </View>
    </ScrollView>;
  };
  // const renderCreateVotingCustomBoard = (): React.ReactElement => {
  //   return (
  //     <Modal
  //       isVisible={isCreateBoard}
  //       animationIn='slideInUp'
  //       animationOut='slideOutDown'
  //       animationInTiming={1}
  //       animationOutTiming={1}
  //       backdropTransitionInTiming={1}
  //       backdropTransitionOutTiming={1}
  //       style={{ alignItems: 'center'}}>
  //       <View style={themedStyle.boxSetting}>
  //         <Text style={themedStyle.txtNote}>
  //           {'Voting'}
  //         </Text>
  //         {onRenderVotingColumnName()}
  //         <TouchableOpacity
  //           style={themedStyle.btnCancel}
  //           activeOpacity={0.75}
  //           onPress={() => setIsShowCreateBoard(false)}>
  //           <Text style={themedStyle.txtCancel}>
  //             {'Cancel'}
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </Modal>
  //   )
  // }
  const renderCreateVotingCustomBoard = (): React.ReactElement => {
    return (
      <View style={themedStyle.boxSetting}>
        <View style={themedStyle.HeaderSetting}>
          {CheckedIcon(themedStyle.iconCheckedIcon)}
          <Text style={{
            fontSize: pxPhone(15),
            ...textStyle.proTextBold,
          }}>
            Set the rules about likes and dislikes
            </Text>
        </View>
        {onRenderVotingColumnName()}
        <TouchableOpacity
          style={themedStyle.btnCancel}
          activeOpacity={0.75}
          onPress={onDoneCreateBoard}>
          <Text style={themedStyle.txtCancel}>
            {'OK'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
  // render voting
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Template' },
    { key: 'second', title: 'Setting' },
    { key: 'three', title: 'Voting' },
  ]);

  const renderScene = SceneMap({
    first: renderCreateCustomBoard,
    second: renderCreateSettingCustomBoard,
    three: renderCreateVotingCustomBoard,
  });
  // tab create custom board
  const renderTabCreateCustomBoard = (): React.ReactElement => {
    return (
      <Modal
        onBackdropPress={() => setIsShowCreateBoard(false)}
        isVisible={isCreateBoard}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        animationInTiming={1}
        animationOutTiming={1}
        backdropTransitionInTiming={1}
        backdropTransitionOutTiming={1}
        style={{ alignItems: 'center', justifyContent: 'center', height: '70%' }}>
        <TabView
          style={{ width: '100%', height: '70%' }}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(value) => setIndex(value)}
          lazy={true}
          swipeEnabled={false}
        />
      </Modal>
    )
  }
  // tab create custom board
  const onDoneCreateBoard = (): void => {
    setIsShowCreateBoard(false);
    setIsShowBoardTemplate(false);
    props.onCreateBoard(templateSelected);
  }

  const renderBoardTemplate = (): React.ReactElement => {
    return (
      <Modal
        isVisible={isShowBoardTemplate}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        animationInTiming={1}
        animationOutTiming={1}
        backdropTransitionInTiming={1}
        backdropTransitionOutTiming={1}
        style={{ alignItems: 'center' }}>
        <View style={themedStyle.box2}>
          <Text style={themedStyle.txtNote}>
            {templateSelected.type}
          </Text>
          {onRenderColumnTemplate()}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', left: pxPhone(-15), }}>
            <TouchableOpacity
              style={themedStyle.btnCancel}
              activeOpacity={0.75}
              onPress={() => onDoneCreateBoard()}>
              <Text style={themedStyle.txtCancel}>
                {'OK'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={themedStyle.btnCancel}
              activeOpacity={0.75}
              onPress={() => setIsShowBoardTemplate(false)}>
              <Text style={themedStyle.txtCancel}>
                {'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

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
      <View style={themedStyle.viewHeader2}>
        <Text style={themedStyle.txtHeader2}>
          {'My boards'}
        </Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: pxPhone(20) }}>
        <Text style={[themedStyle.txtHeader2, { fontSize: pxPhone(18) }]}>
          {'Public Boards'}
        </Text>
        {boards.map((item) => {
          return item.isPublic && renderBoard(item);
        })}
        <Text style={[themedStyle.txtHeader2, { fontSize: pxPhone(18), marginTop: pxPhone(40) }]}>
          {'Team Boards'}
        </Text>
        {boards.map((item) => {
          return !item.isPublic && renderBoard(item);
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
      {renderTabCreateCustomBoard()}
      {renderBoardTemplate()}
    </View>
  );
};

export const Home = withStyles(HomeComponent, (theme: ThemeType) => ({
  txtHeader2: {
    color: theme['color-basic-dark-100'],
    ...textStyle.proTextBold,
    fontSize: pxPhone(20),
    marginLeft: pxPhone(12),
  },
  viewHeader2: {
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
  HeaderSetting: {
    flexDirection: 'row',
    width: '95%',
    backgroundColor: '#bbf4c9', borderRadius: pxPhone(10),
    marginHorizontal: pxPhone(15), padding: pxPhone(10)
  },
  containerSetting: {
    marginTop: pxPhone(5),
    borderColor: "#b5bdb6",
    borderWidth: 1,
    borderRadius: pxPhone(10),
    marginHorizontal: pxPhone(10),
    height: pxPhone(120)
  },
  containerHeaderSetting: {
    marginHorizontal: pxPhone(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: pxPhone(10),
    height: '50%'
  },
  containerInfoSetting: {
    flexDirection: "row",
    backgroundColor: "#e8f4fd",
    borderBottomEndRadius: pxPhone(10),
    alignItems: "center",
    padding: pxPhone(10),
    height: '50%'
  },
  iconCheckedIcon: {
    marginRight: pxPhone(5),
    width: pxPhone(20),
    height: pxPhone(20),
    tintColor: "#66b066",
    alignSelf: 'center'
  },
  iconInformation: {
    marginRight: pxPhone(5),
    width: pxPhone(20),
    height: pxPhone(20),
    tintColor: "#35a0f4",
  },
  containerHeaderVoting: {
    marginLeft: pxPhone(10),
    padding: pxPhone(10),
    flexDirection: "row",
    alignItems: "center",
    height: '50%'
  },
  txtCancel: {
    color: '#FF708D',
    ...textStyle.proTextBold,
    fontSize: pxPhone(15),
  },
  hr: {
    marginTop: pxPhone(10),
    height: pxPhone(1),
    width: pxPhone(300),
    backgroundColor: '#BDBDBD',
  },
  btnCancel: {
    width: pxPhone(285),
    height: pxPhone(50),
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnCancel2: {
    width: pxPhone(285),
    height: pxPhone(50),
  },
  txtNote: {
    fontSize: pxPhone(15),
    ...textStyle.proTextBold,
    textAlign: 'center',
  },
  boxSetting: {
    borderRadius: pxPhone(10),
    width: '100%',
    height: '70%',
    paddingTop: pxPhone(15),
    backgroundColor: theme['color-basic-light-100'],
    alignItems: 'center',
  },
  box: {
    borderRadius: pxPhone(10),
    alignItems: 'center',
    width: pxPhone(285),
    height: pxPhone(230),
    paddingTop: pxPhone(15),
    backgroundColor: theme['color-basic-light-100'],
  },
  box2: {
    borderRadius: pxPhone(10),
    alignItems: 'center',
    width: '95%',
    height: '80%',
    paddingTop: pxPhone(15),
    backgroundColor: theme['color-basic-light-100'],
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
