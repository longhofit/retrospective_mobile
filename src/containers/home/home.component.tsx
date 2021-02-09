import React, { useState } from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { View, Text, TouchableOpacity, Picker, TextInput, ScrollView, Image, Alert, RefreshControl, FlatList, Switch, KeyboardAvoidingView } from 'react-native';
import { EvaArrowIcon, AddIcon, TrashIcon, InformationIcon, CheckedIcon, EditIcon2, SendIcon } from '@src/assets/icons';
import { textStyle } from '@src/components/textStyle';
import { pxPhone, pxToPercentage } from '@src/core/utils/utils';
import Modal from 'react-native-modal';
import { templateColumn } from '@src/core/utils/constants';
import { User } from '@src/core/models/user/user.model';
import { Post, Session } from '@src/core/models/type';
import { viewStyle } from '@src/components/viewStyle';
import { BoardMetaData } from '@src/core/models/board/board.model';
import { useDispatch, useSelector } from 'react-redux';
import { onThunkDeleteBoardReq, onThunkGetPrePrivateBoardsReq } from './store/thunk';
import { Dispatch } from 'redux';
import { onThunkGetPrePublicBoardsReq } from '../board/store/thunk';
import uuid from 'react-native-uuid';
import Slider from '@react-native-community/slider'
import { TabBar, TabView } from 'react-native-tab-view';
import { themes } from '@src/core/themes';
import { InputItem } from '@src/components/input/inputItem.component';
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

const HomeComponent: React.FunctionComponent<HomeProps> = (props) => {
  const dispatch: Dispatch<any> = useDispatch();
  const { themedStyle, boards } = props;
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateBoard, setIsShowCreateBoard] = useState<boolean>(false);
  const [templateSelected, setTemplateSelected] = useState(templateColumn[0]);
  const [isShowBoardTemplate, setIsShowBoardTemplate] = useState<boolean>(false);
  const [settingState, setSettingState] = useState<FormSettingState>(initSettingState);
  const [votingState, setVotingState] = useState<FormVotingState>(initVotingState);
  const [url, setUrl] = useState<string>('');
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

  const onIconAddPress = (): void => {
    // setIsShowPicker(true);
    setIsShowCreateBoard(true);
  };

  const onBoardPress = (sessionId: string) => {
    props.onBoardPress(sessionId);
  };

  const convertDateTime = (boardCreated: String): String => {
    var currentDate = new Date();
    var boardCreatedDateTime = new Date(String(boardCreated));

    var timeDiff = Math.abs(currentDate.getTime() - boardCreatedDateTime.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    var convertYear: number = parseInt(String((diffDays - 1) / 365));
    var monthRemainder: number = (diffDays - 1) - 365*convertYear;
    var convertMonth: number = parseInt(String(monthRemainder / 30));
    var convertDate: number = monthRemainder - 30*convertMonth;


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

    const convertHour: number = timeDiff / (1000 * 3600 * 24) * 24;
    if (convertHour >= 2) {
      return parseInt(String(convertHour)) + " hours ago";
    }
    if (convertHour >= 1) {
      return parseInt(String(convertHour)) + " hour ago";
    }

    const convertMin: number = convertHour * 60;
    if (convertMin >= 2) {
      return parseInt(String(convertMin)) + " minutes ago";
    }
    if (convertMin >= 1) {
      return parseInt(String(convertMin)) + " minute ago";
    }
    return "less than a minute ago";
  }
  const onSuccess = (): void => {
  };
  const onError = (): void => {
  };
  const onPressDeleteBoard = (idBoard: String): void => {
    Alert.alert(
      'Deleting "My Retrospective" ?',
      'Deleting a session is irreversible. It will delete all posts, votes, groups, and the session itself. The data cannot be restored.Are you sure you want to delete this session and all its content?',
      [
        {
          text: "YES, I'M SURE",
          onPress: async () => {
            await dispatch(onThunkDeleteBoardReq(idBoard, onSuccess, onError));
            await onRefresh();
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
  const renderDeleteIcon = (idBoard): React.ReactElement => {
    if(props.user.accountType !== 'anonymous'){
      return <TouchableOpacity onPress={() => onPressDeleteBoard(idBoard)}>
      {TrashIcon(themedStyle.buttonDelete)}
    </TouchableOpacity>
    }
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
            {renderDeleteIcon(board.id)}
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
    let newColumns = templateSelected.columns;
    newColumns[columnIndex].label = text;

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

  const renderTemplatePicker = (): React.ReactElement => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAFAFA', borderRadius: pxPhone(8), marginVertical: pxPhone(30) }}>
        <Text>
          {'Template'}
        </Text>
        <View style={{ height: pxPhone(30), width: '70%', borderBottomWidth: pxPhone(1), borderColor: '#BDBDBD', marginLeft: pxPhone(5) }}>
          <Picker
            selectedValue={templateSelected.type}
            style={{ flex: 1 }}
            onValueChange={(itemValue, index) => { setTemplateSelected(templateColumn[index]) }}>
            {templateColumn.map((template, index) => {
              return (
                <Picker.Item label={template.type} value={template.type} />
              )
            })}
          </Picker>
        </View>
      </View>
    )
  };

  const onIconAdd2Press = (): void => {
    setTemplateSelected({
      ...templateSelected, columns: [...templateSelected.columns, {
        color: '#D1C4E9',
        icon: 'help',
        label: 'Custom Column',
        id: uuid.v4(),
        index: templateSelected.columns.length,
        type: 'custom'
      }]
    })
  };

  const onRenderColumnTemplate = (): React.ReactElement => {
    return (
      <ScrollView
        keyboardDismissMode={'interactive'}
        showsVerticalScrollIndicator={false}>
        {templateSelected.columns && templateSelected.columns.map((item, index) => {
          return (
            <React.Fragment>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  multiline
                  onChangeText={text => onColumnNameChange(text, item.index)}
                  value={item.label}
                  style={{ marginTop: pxPhone(5), maxWidth: '90%' }}>
                </TextInput>
                {EditIcon2({ width: pxPhone(12), height: pxPhone(12) })}
              </View>
              <View style={themedStyle.hr} />
              {index === (templateSelected.columns.length - 1) && (
                <TouchableOpacity
                  onPress={onIconAdd2Press}
                  activeOpacity={0.75}
                  style={themedStyle.viewAdd2}>
                  {AddIcon({ width: pxPhone(30), height: pxPhone(30), tintColor: 'gray' })}
                </TouchableOpacity>
              )}
            </React.Fragment>
          )
        })}
      </ScrollView>
    )
  };

  const renderCreateCustomBoard = (): React.ReactElement => {
    return (
      <View style={themedStyle.boxSetting}>
        <View style={{ width: '95%', paddingLeft: pxPhone(15), paddingVertical: pxPhone(15), backgroundColor: '#EFF7ED', borderRadius: pxPhone(5), flexDirection: 'row' }}>
          {CheckedIcon(themedStyle.iconCheckedIcon)}
          <Text style={themedStyle.txtTemplateNote}>
            {'Set the number of columns and their characteristics'}
          </Text>
        </View>
        {/* {onRenderColumnName()} */}
        {renderTemplatePicker()}
        {onRenderColumnTemplate()}
        <View style={{ flexDirection: 'row', padding: pxPhone(12) }}>
          <TouchableOpacity
            style={[{ borderRadius: pxPhone(8), padding: pxPhone(10) }]}
            activeOpacity={0.75}
            onPress={() => {
              setIsShowCreateBoard(false);
              setTemplateSelected(templateColumn[0]);
              setSettingState(initSettingState);
              setVotingState(initVotingState);
            }}>
            <Text style={themedStyle.txtStart}>
              {'CANCEL'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDoneCreateBoard}
            activeOpacity={0.75}
            style={{
              backgroundColor: themes["App Theme"]['color-green-1'],
              borderRadius: pxPhone(8),
              padding: pxPhone(10),
              marginLeft: pxPhone(5),
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
            }}>
            <Text style={themedStyle.txtStart}>
              {'START THE SESSION'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }


  // render setting
  const onTemplateSettingPress = (index: number): void => {
    switch (index) {
      case 0:
        setSettingState({ ...settingState, isPrivateBoard: !settingState.isPrivateBoard });
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
        setSettingState({ ...settingState, isAllowGiphy: !settingState.isAllowGiphy });
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
  const renderCreateSettingCustomBoard = (): React.ReactElement => {
    return (
      <View style={themedStyle.boxSetting}>
        <View style={{ width: '90%', paddingLeft: pxPhone(12), paddingVertical: pxPhone(15), backgroundColor: '#EFF7ED', borderRadius: pxPhone(5), justifyContent: 'center', flexDirection: 'row' }}>
          {CheckedIcon(themedStyle.iconCheckedIcon)}
          <Text style={themedStyle.txtTemplateNote}>
            {'Set the rules about what a user can do when creating or viewing a post'}
          </Text>
        </View>
        {onRenderSettingColumnName()}
        <View style={{ flexDirection: 'row', padding: pxPhone(12) }}>
          <TouchableOpacity
            style={[{ borderRadius: pxPhone(8), padding: pxPhone(10) }]}
            activeOpacity={0.75}
            onPress={() => {
              setIsShowCreateBoard(false);
              setTemplateSelected(templateColumn[0]);
              setSettingState(initSettingState);
              setVotingState(initVotingState);
            }}>
            <Text style={themedStyle.txtStart}>
              {'CANCEL'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDoneCreateBoard}
            activeOpacity={0.75}
            style={{
              backgroundColor: themes["App Theme"]['color-green-1'],
              borderRadius: pxPhone(8),
              padding: pxPhone(10),
              marginLeft: pxPhone(5),
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
            }}>
            <Text style={themedStyle.txtStart}>
              {'START THE SESSION'}
            </Text>
          </TouchableOpacity>
        </View>
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
  const renderCreateVotingCustomBoard = (): React.ReactElement => {
    return (
      <View style={themedStyle.boxSetting}>
        <View style={{ width: '95%', paddingLeft: pxPhone(15), paddingVertical: pxPhone(15), backgroundColor: '#EFF7ED', borderRadius: pxPhone(5), flexDirection: 'row' }}>
          {CheckedIcon(themedStyle.iconCheckedIcon)}
          <Text style={themedStyle.txtTemplateNote}>
            {'Set the rules about likes and dislikes'}
          </Text>
        </View>
        {onRenderVotingColumnName()}
        <View style={{ flexDirection: 'row', padding: pxPhone(12) }}>
          <TouchableOpacity
            style={[{ borderRadius: pxPhone(8), padding: pxPhone(10) }]}
            activeOpacity={0.75}
            onPress={() => {
              setIsShowCreateBoard(false);
              setTemplateSelected(templateColumn[0]);
              setSettingState(initSettingState);
              setVotingState(initVotingState);
            }}>
            <Text style={themedStyle.txtStart}>
              {'CANCEL'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDoneCreateBoard}
            activeOpacity={0.75}
            style={{
              backgroundColor: themes["App Theme"]['color-green-1'],
              borderRadius: pxPhone(8),
              padding: pxPhone(10),
              marginLeft: pxPhone(5),
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
            }}>
            <Text style={themedStyle.txtStart}>
              {'START THE SESSION'}
            </Text>
          </TouchableOpacity>
        </View>
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

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return renderCreateCustomBoard();
      case 'second':
        return renderCreateSettingCustomBoard();
      case 'three':
        return renderCreateVotingCustomBoard();
      default:
        return null;
    }
  }

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'black' }}
      style={{ backgroundColor: themes["App Theme"]['color-green-1'] }}
      activeColor={'#324F6F'}
    />
  );

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

        style={{ alignItems: 'center', justifyContent: 'center', height: '100%', margin: 0 }}>
        <TabView
          renderTabBar={renderTabBar}
          style={{ width: '100%', height: '100%' }}
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
    const templateData = {
      ...templateSelected,
      options: {
        isPublic: !settingState.isPrivateBoard,
        allowActions: settingState.isAllowActions,
        allowMultipleVotes: votingState.isAllowMultiple,
        allowSelfVoting: votingState.isAllowSelfVoting,
        allowAuthorVisible: settingState.isShowAuthor,
        maxDownVotes: null,
        maxUpVotes: null,
        allowGiphy: true,
        allowGrouping: settingState.isAllowGrouping,
        allowReordering: true,
        blurCards: settingState.isBlurCards,
      }
    };
    props.onCreateBoard(templateData);
    setTemplateSelected(templateColumn[0]);
    setSettingState(initSettingState);
    setVotingState(initVotingState);
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
    dispatch(onThunkGetPrePrivateBoardsReq(
      onGetBoardSuccess,
      onGetBoardError,
    ));
    wait(500).then(() => setRefreshing(false));
  };

  const onGoToSession = (): void => {
    const id: string = url.split('/')[url.split('/').length - 1];
    props.onBoardPress(id);
  };


  return (
    <View style={themedStyle.container}>
      <View style={themedStyle.viewHeader2}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => props.onBackPress()}
          style={{ position: 'absolute', left: pxPhone(12) }}>
          {EvaArrowIcon({ width: pxPhone(30), height: pxPhone(30), tintColor: '#324F6F' })}
        </TouchableOpacity>
        <Text style={[themedStyle.txtHeader2, { textAlign: 'center', color: '#324F6F' }]}>
          {'My boards'}
        </Text>
      </View>
      <InputItem
        iconStyle={themedStyle.iconSend}
        onIconPress={onGoToSession}
        icon={SendIcon}
        placeholder={'Enter url or board id...'}
        // value={post}
        title={'URL'}
        titleColor={{ backgroundColor: 'white' }}
        inputContainerStyle={themedStyle.viewInput}
        onInputTextChange={setUrl} />
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
      {renderTabCreateCustomBoard()}
      {renderBoardTemplate()}
    </View>
  );
};

export const Home = withStyles(HomeComponent, (theme: ThemeType) => ({
  viewInput: {
    marginVertical: pxPhone(15),
    height: pxToPercentage(40),
    width: pxToPercentage(340),
    alignSelf: 'center',
  },
  iconSend: {
    width: pxPhone(22),
    height: pxPhone(22),
  },
  txtStart: {
    ...textStyle.proTextBold,
    fontSize: pxPhone(13),
  },
  viewAdd2: {
    marginTop: pxPhone(5),
  },
  txtTemplateNote: {
    marginLeft: pxPhone(5),
    color: '#324828',
    ...textStyle.proTextRegular,
    fontSize: pxPhone(12),
    textAlign: 'center',
  },
  txtHeader2: {
    color: theme['color-basic-dark-100'],
    ...textStyle.proTextBold,
    fontSize: pxPhone(20),
  },
  viewHeader2: {
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
    width: '100%',
    height: '100%',
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
    backgroundColor: "#F4F4F4",
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
    backgroundColor: theme['color-green-1'],
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
    color: theme['color-green-1'],
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
