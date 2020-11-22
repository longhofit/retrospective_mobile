import React, { useState, useEffect } from 'react';
import {
  withStyles,
  ThemeType,
  ThemedComponentProps,
} from '@kitten/theme';
import {
  View,
  Text,
  TouchableOpacity,
  Picker,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { EvaArrowIcon, AddIcon, UncheckIcon } from '@src/assets/icons';
import { textStyle } from '@src/components/textStyle';
import { pxToPercentage } from '@src/core/utils/utils';
import { BoardRepository } from 'react-native-draganddrop-board'
import { Board } from 'react-native-draganddrop-board'
import Modal from 'react-native-modal';


interface ComponentProps {
  name: string;
  onBackPress: () => void;
}

export type HomeProps = ComponentProps & ThemedComponentProps;

// const fakeData = [
//   {
//     id: 1,
//     name: 'TO DO',
//     rows: [
//       {
//         id: '1',
//         name: 'Analyze your audience',
//         description: 'Learn more about the audience to whom you will be speaking'
//       },
//       {
//         id: '2',
//         name: 'Select a topic',
//         description: 'Select a topic that is of interest to the audience and to you'
//       },
//       {
//         id: '3',
//         name: 'Define the objective',
//         description: 'Write the objective of the presentation in a single concise statement'
//       }
//     ]
//   },
//   {
//     id: 2,
//     name: 'IN PROGRESS',
//     rows: [
//       {
//         id: '4',
//         name: 'Look at drawings',
//         description: 'How did they use line and shape? How did they shade?'
//       },
//       {
//         id: '5',
//         name: 'Draw from drawings',
//         description: 'Learn from the masters by copying them'
//       },
//       {
//         id: '6',
//         name: 'Draw from photographs',
//         description: 'For most people, it’s easier to reproduce an image that’s already two-dimensional'
//       }
//     ]
//   },
//   {
//     id: 3,
//     name: 'DONE',
//     rows: [
//       {
//         id: '7',
//         name: 'Draw from life',
//         description: 'Do you enjoy coffee? Draw your coffee cup'
//       },
//       {
//         id: '8',
//         name: 'Take a class',
//         description: 'Check your local university extension'
//       }
//     ]
//   }
// ]

// const boardRepositoryFake = new BoardRepository(fakeData);

const HomeComponent: React.FunctionComponent<HomeProps> = (props) => {
  const { themedStyle } = props;

  // const [isShowPicker, setIsShowPicker] = useState<boolean>(false);
  // const [isShowAdd, setIsShowAdd] = useState<boolean>(false);
  // const [idColumnAddSelected, setColumnAddSelected] = useState<number>(0);
  // const [cardName, setCardName] = useState<string>('');
  // const [boardRepository, setBoardRepository] = useState(fakeData);
  // const [lastId, setLastId] = useState<number>(8);
  // const [isEdit, setIsEdit] = useState<boolean>(false);
  // const [cardID, setCardID] = useState<string>('');

  // const onCancle = (): void => {
  //   setIsShowPicker(false);
  // };

  // const onOkPress = (): void => {
  //   if (!isEdit) {
  //     onAddCard(idColumnAddSelected);
  //     setIsShowAdd(false);
  //   } else {
  //     const newData = boardRepository;

  //     boardRepository.forEach((item, itemIndex) => {
  //       item.rows.forEach((row, rowIndex) => {
  //         if (row.id === cardID) {
  //           newData[itemIndex].rows[rowIndex]['name'] = cardName;
  //         }
  //       });
  //     });

  //     boardRepositoryFake.updateData(newData);
  //     setBoardRepository(newData);
  //     setIsShowAdd(false);
  //     setIsEdit(false);
  //   }
  // };

  // const onRemoveCard = (idCard: string): void => {
  //   const newData = boardRepository;

  //   boardRepository.forEach((item, index) => {
  //     item.rows.forEach((card) => {
  //       if (card.id === cardID) {
  //         newData[index].rows = newData[index].rows.filter(row => { return row.id !== idCard });
  //       }
  //     });
  //   });

  //   boardRepositoryFake.updateData(newData);
  //   setBoardRepository(newData);
  // }

  // const onAddCard = (idColumn: number, card?: any): void => {
  //   const newData = boardRepository;

  //   boardRepository.forEach((item, index) => {
  //     if (item.id === idColumn) {
  //       let newItem: any;
  //       if (card) {
  //         newItem = card;
  //       } else {
  //         newItem = {
  //           id: `${lastId + 1}`,
  //           name: cardName,
  //           description: ''
  //         };
  //       }
  //       newData[index].rows.push(newItem)
  //       setLastId(lastId + 1)
  //     };
  //   });

  //   boardRepositoryFake.updateData(newData);
  //   setBoardRepository(newData);
  // };

  // const onDeletePress = (): void => {
  //   onRemoveCard(cardID);
  //   setIsShowAdd(false);
  //   setIsEdit(false);
  // };

  // const onDragEnd = (): void => {

  // };

  // const onCancelAddPress = (): void => {
  //   setIsShowAdd(false);
  // };

  // const onIconAddPress = (): void => {
  //   setIsShowPicker(true);
  // };

  // const onColumnPress = (id: number): void => {
  //   setCardName('');
  //   setIsShowPicker(false);
  //   setColumnAddSelected(id);
  //   setTimeout(() => {
  //     setIsShowAdd(true);
  //   }, 500);
  // }

  // const renderAddCard = (): React.ReactElement => {
  //   return (
  //     <Modal
  //       animationIn={'fadeIn'}
  //       animationOut={'fadeOut'}
  //       animationInTiming={500}
  //       isVisible={isShowAdd}
  //       style={{ margin: 0, paddingHorizontal: pxToPercentage(37) }}>
  //       <View style={themedStyle.sectionAddNotifications}>
  //         <Text style={themedStyle.txtAddNotificationsModal}>
  //           {'Enter card'}
  //         </Text>
  //         <TextInput
  //           textAlignVertical='top'
  //           style={themedStyle.inputNote}
  //           autoFocus
  //           multiline
  //           value={cardName}
  //           onChangeText={text => setCardName(text)}
  //         />
  //         <View style={themedStyle.viewAddNotificationsBottom2}>
  //           {isEdit && (
  //             <TouchableOpacity
  //               activeOpacity={0.75}
  //               onPress={onDeletePress}>
  //               <Text style={themedStyle.txtCloseAddNotificationsModal}>
  //                 {'DELETE'}
  //               </Text>
  //             </TouchableOpacity>
  //           )}
  //           <TouchableOpacity
  //             activeOpacity={0.75}
  //             onPress={onCancelAddPress}>
  //             <Text style={themedStyle.txtCloseAddNotificationsModal}>
  //               {'CANCEL'}
  //             </Text>
  //           </TouchableOpacity>
  //           <TouchableOpacity
  //             activeOpacity={0.75}
  //             onPress={onOkPress}>
  //             <Text style={themedStyle.txtCloseAddNotificationsModal}>
  //               {'OK'}
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     </Modal>
  //   )
  // }

  // const renderPicker = (): React.ReactElement => {
  //   return (
  //     <Modal
  //       animationIn={'fadeIn'}
  //       animationOut={'fadeOut'}
  //       animationInTiming={500}
  //       isVisible={isShowPicker}
  //       style={{ margin: 0, paddingHorizontal: pxToPercentage(37) }}>
  //       <View style={themedStyle.sectionAddNotifications}>
  //         <Text style={themedStyle.txtAddNotificationsModal}>
  //           {'Select column'}
  //         </Text>
  //         {fakeData.map((item, index) => {
  //           return (
  //             <React.Fragment key={index}>
  //               <View style={themedStyle.card}>
  //                 <TouchableOpacity
  //                   activeOpacity={0.75}
  //                   onPress={() => onColumnPress(item.id)}>
  //                   <Text>
  //                     {item.name}
  //                   </Text>
  //                 </TouchableOpacity>
  //               </View>
  //             </React.Fragment>
  //           )
  //         })}
  //         <View style={themedStyle.viewAddNotificationsBottom}>
  //           <TouchableOpacity
  //             activeOpacity={0.75}
  //             onPress={onCancle}>
  //             <Text style={themedStyle.txtCloseAddNotificationsModal}>
  //               {'CANCEL'}
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     </Modal>
  //   )
  // }

  // const renderCard = (item): React.ReactElement => {
  //   return (

  //     <View style={themedStyle.card}>
  //       <Text>
  //         {item.name}
  //       </Text>
  //     </View>
  //   )
  // }

  // const onItemPress = (item): void => {
  //   setCardID(item.id)
  //   setCardName(item.name);
  //   setIsShowAdd(true);
  //   setIsEdit(true);
  // }

  return (
    <SafeAreaView style={themedStyle.container}>
      <WebView source={{ uri: 'http://retrospective.ai/' }} />
    </SafeAreaView>
    // <View
    //   style={themedStyle.container}>
    //   <View style={themedStyle.viewHeader}>
    //     <View style={{
    //       marginTop: pxToPercentage(40), justifyContent: 'center',
    //       alignItems: 'center',
    //       flexDirection: 'row',
    //     }}>
    //       <TouchableOpacity
    //         style={themedStyle.viewIcon}
    //         onPress={props.onBackPress}
    //         activeOpacity={0.75}>
    //         {EvaArrowIcon(themedStyle.icon)}
    //       </TouchableOpacity>
    //       <View style={{ flex: 1, alignItems: 'center' }}>
    //         <Text style={themedStyle.txtHeader}>
    //           {'Home'}
    //         </Text>
    //       </View>
    //     </View>
    //   </View>
    //   {/* <Text style={themedStyle.txtHome}>
    //   </Text> */}
    //   <Board
    //     boardRepository={boardRepositoryFake}
    //     open={onItemPress}
    //     onDragEnd={(srcColumnId, destColumnId, draggedItem) => { }}
    //     cardContent={(item) => renderCard(item)}
    //   />
    //   <TouchableOpacity
    //     onPress={onIconAddPress}
    //     activeOpacity={0.75}
    //     style={themedStyle.viewAdd}>
    //     {AddIcon(themedStyle.iconAdd)}
    //   </TouchableOpacity>
    //   {renderPicker()}
    //   {renderAddCard()}
    // </View>
  );
};

export const Home = withStyles(HomeComponent, (theme: ThemeType) => ({
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
    top: pxToPercentage(25),
    right: pxToPercentage(25),
    width: pxToPercentage(50),
    height: pxToPercentage(50),
    borderRadius: pxToPercentage(25),
    backgroundColor: theme['color-app'],
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
