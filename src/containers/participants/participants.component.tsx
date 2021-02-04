import React, { useState } from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { View, Text, TouchableOpacity, FlatList, Clipboard , Image} from 'react-native';
import { ShareIcon, DeleteParticipantsIcon } from '@src/assets/icons';
import { textStyle } from '@src/components/textStyle';
import { pxPhone, pxToPercentage } from '@src/core/utils/utils';
import { Session, User } from '@src/core/models/type';

interface ComponentProps {
  session: Session,
  user: User
}

export type ParticipantsProps = ComponentProps & ThemedComponentProps;

const ParticipantsComponent: React.FunctionComponent<ParticipantsProps> = (props) => {
  const { themedStyle } = props;
  const [number, setNumber] = useState(1);
  const renderColumn = (): React.ReactElement => {
    console.log("props.session:",props.session);
    if(props.session.members != undefined){
    console.log("props.session.members:",props.session.members);
    return (
      <View>
        {props.session.members.map((item, index) => {
          <View style={themedStyle.viewItemParticipants}>
            <Text style={{width: '15%', textAlign:'center', alignSelf: 'center'}}>{number}</Text>
            <View style={{flexDirection: 'row',width:'45%', alignItems:'center', justifyContent:'space-evenly'}}>
              <Image
                source={{ uri: `https://www.gravatar.com/avatar/$%7Bmd5(${item.id})%7D?d=retro` }}
                style={themedStyle.image}
              />
              <Text style={{marginHorizontal:pxPhone(5)}}>{item.name}</Text>
            </View>
            <Text style={{width: '30%', textAlign:'center', alignSelf: 'center'}}>{item.accountType}</Text>
            <TouchableOpacity style={{width: '10%', alignItems:'center', alignSelf: 'center'}}>
              {DeleteParticipantsIcon(themedStyle.iconDelete)}
            </TouchableOpacity>
          </View>
        })}
      </View>
    );
    }
  };

  const renderOwnerBoard = () : React.ReactElement => {
    //console.log("props.session.posts:",props.session.options);
    console.log("props.user:",props.user);
    if(props.session.options != undefined)
    {
      //setNumber(number + 1);
      if(props.session.options.isPublic === true){
        
          return <View style={themedStyle.viewItemParticipants}>
              <Text style={{width: '15%', textAlign:'center', alignSelf: 'center'}}>{number}</Text>
              <View style={{flexDirection: 'row',width:'45%', alignItems:'center', justifyContent:'space-evenly'}}>
                <Image
                  source={{ uri: `https://www.gravatar.com/avatar/$%7Bmd5(${props.user.id})%7D?d=retro` }}
                  style={themedStyle.image}
                />
                <Text style={{marginHorizontal:pxPhone(5)}}>{props.user.name}</Text>
              </View>
              <Text style={{width: '30%', textAlign:'center', alignSelf: 'center'}}>{props.user.accountType}</Text>
              
              <TouchableOpacity style={{width: '10%', alignItems:'center', alignSelf: 'center'}}>
                {DeleteParticipantsIcon(themedStyle.iconDelete)}
              </TouchableOpacity>
          </View>
      }
    }
    return <View></View>
  }
  return (
    <React.Fragment>
      <View style={{marginHorizontal: pxPhone(10), marginTop: pxPhone(20)}}>
          <View style={themedStyle.viewHeaderItemParticipants}>
              <Text style={{width: '15%', textAlign:'center'}}>Number</Text>
              <Text style={{width: '45%', textAlign:'center'}}>Participants</Text>
              <Text style={{width: '30%', textAlign:'center'}}>Account Type</Text>
              <Text style={{width: '10%', textAlign:'center'}}></Text>
          </View>
          {renderOwnerBoard()}
          {renderColumn()}
      </View>
    </React.Fragment >
  );
};

export const Participants = withStyles(ParticipantsComponent, (theme: ThemeType) => ({
    iconDelete:{
      width: pxToPercentage(20),
      height: pxToPercentage(20),
    },
    viewItemParticipants:{
        flexDirection: 'row',
        borderWidth: 1, 
        borderTopColor:'white',
    },
    viewHeaderItemParticipants:{
        flexDirection:'row', 
        borderWidth: 1, 
        paddingHorizontal: pxPhone(5), 
        justifyContent:'center'
    },
    image: {
      marginRight: pxPhone(5),
      width: pxPhone(35),
      height: pxPhone(35),
      borderRadius: pxPhone(25),
      backgroundColor: theme['color-purple'],
    },
    
}));
