import React, { useState } from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { ShareIcon, DeleteParticipantsIcon } from '@src/assets/icons';
import { textStyle } from '@src/components/textStyle';
import { pxPhone, pxToPercentage } from '@src/core/utils/utils';
import { Session, User } from '@src/core/models/type';

interface ComponentProps {
  session: Session,
  user: User,
  players: User[];
}

export type ParticipantsProps = ComponentProps & ThemedComponentProps;

const ParticipantsComponent: React.FunctionComponent<ParticipantsProps> = (props) => {
  const { themedStyle } = props;
  const renderColumn = (item: User, index: number): React.ReactElement => {
    return (
      <View style={themedStyle.viewItemParticipants}>
        <Text style={{ width: '20%', textAlign: 'center', alignSelf: 'center' }}>{index + 1}</Text>
        <View style={{ flexDirection: 'row', width: '40%', alignItems: 'center' }}>
          <Image
            source={{ uri: `https://www.gravatar.com/avatar/$%7Bmd5(${item})%7D?d=retro` }}
            style={themedStyle.image}
          />
          <Text style={{ marginHorizontal: pxPhone(5) }}>{item.name}</Text>
        </View>
        <Text style={{ width: '30%', textAlign: 'center', alignSelf: 'center' }}>{item.accountType}</Text>
        <TouchableOpacity style={{ width: '10%', alignItems: 'center', alignSelf: 'center' }}>
          {DeleteParticipantsIcon(themedStyle.iconDelete)}
        </TouchableOpacity>
      </View>
    );
  };
  const renderPublicPrivateColumn = (): React.ReactElement => {
    if (props.session.options != undefined) {
      //setNumber(number + 1);
      if (props.session.options.isPublic === true) {
        return <FlatList
          data={props.players}
          extraData={props.players}
          renderItem={item => {
            return renderColumn(item.item, item.index);
          }}>
        </FlatList>
      }
      else {
        return <FlatList
          data={props.session.members}
          extraData={props.players}
          renderItem={item => {
            return renderColumn(item.item, item.index);
          }}>
        </FlatList>
      }
    }
    return <View></View>
  }

  return (
    <React.Fragment>
      <View style={themedStyle.container}>
        <View style={themedStyle.viewHeaderItemParticipants}>
          <Text style={{ width: '20%', textAlign: 'center' }}>Number</Text>
          <Text style={{ width: '40%' }}>Participants</Text>
          <Text style={{ width: '30%', textAlign: 'center' }}>Account Type</Text>
          <Text style={{ width: '10%', textAlign: 'center' }}></Text>
        </View>

        {renderPublicPrivateColumn()}
      </View>
    </React.Fragment >
  );
};

export const Participants = withStyles(ParticipantsComponent, (theme: ThemeType) => ({
  iconDelete: {
    width: pxToPercentage(20),
    height: pxToPercentage(20),
  },
  container: {
    marginHorizontal: pxPhone(10),
    marginTop: pxPhone(20),
    borderBottomRightRadius: pxToPercentage(9),
    borderBottomLeftRadius: pxToPercentage(9),
    paddingVertical: pxPhone(5),
    backgroundColor: theme['color-basic-light-100'],
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
  viewItemParticipants: {
    flexDirection: 'row',
    borderBottomRightRadius: pxToPercentage(9),
    borderBottomLeftRadius: pxToPercentage(9),
    paddingVertical: pxPhone(5),
    backgroundColor: theme['color-basic-light-100'],
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
  viewHeaderItemParticipants: {
    flexDirection: 'row',
    paddingHorizontal: pxPhone(5),
    justifyContent: 'center'
  },
  image: {
    marginRight: pxPhone(5),
    width: pxPhone(35),
    height: pxPhone(35),
    borderRadius: pxPhone(25),
    backgroundColor: theme['color-purple'],
  },

}));
