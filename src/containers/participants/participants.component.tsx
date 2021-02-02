import React, { useState } from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { View, Text, TouchableOpacity, FlatList, Clipboard } from 'react-native';
import { ShareIcon } from '@src/assets/icons';
import { textStyle } from '@src/components/textStyle';
import { pxPhone, pxToPercentage } from '@src/core/utils/utils';
import { ColumnDefinition, Session } from '@src/core/models/type';

interface ComponentProps {
  session: Session;
}

export type ParticipantsProps = ComponentProps & ThemedComponentProps;

const ParticipantsComponent: React.FunctionComponent<ParticipantsProps> = (props) => {
  const { themedStyle } = props;
  const [checkEmpty, setCheckEmpty] = useState(true);
  const renderViewItemCard = (): React.ReactElement => {
    console.log("props.session:",props.session);
    console.log("props.session.members:",props.session.members);
    console.log("props.session.posts:",props.session.options.isPublic);
      if(checkEmpty === true){
          return <View>
            <Text style={themedStyle.contentCard}>
                There are no posts to display
            </Text>
          </View>
      }
  }
  const renderColumn = (column: ColumnDefinition): React.ReactElement => {
    setCheckEmpty(true);
    return (
      <View style={themedStyle.viewCard}>
        <View style={themedStyle.viewHeaderCard}>
          <Text style={themedStyle.txtHeader2}>
            {column.label}
          </Text>
        </View>
        <View style={themedStyle.viewItemCard}>
        {props.session.posts.map((item, index) => {
          if (item.column === column.index) {
            setCheckEmpty(false);
            return (
                <Text key={index} style={themedStyle.contentCard}>
                  {item.content}
                </Text>
            );
          }
        })}
        {renderViewItemCard()}
        </View>
      </View>
    );
  };

  const renderOwnerBoard = () : React.ReactElement => {
      if(props.session.options.isPublic === false){
          return <View style={{flexDirection: 'row', justifyContent:'space-around'}}>
              <Text>Number</Text>
              <Text>Participants</Text>
              <Text>Account Type</Text>
              <Text></Text>
          </View>
      }
  }
  return (
    <React.Fragment>
      <View style={themedStyle.viewHeader}>
        <Text style={themedStyle.txtHeader}>
          {'My retrospective'}
        </Text>
        <TouchableOpacity
          onPress={() => Clipboard.setString(`http://localhost:3000/game/${props.session.id}`)}
          activeOpacity={0.75}>
          {ShareIcon(themedStyle.iconShare)}
        </TouchableOpacity>
      </View>
      <View style={{marginHorizontal: pxPhone(10), marginTop: pxPhone(20)}}>
          <View style={{flexDirection:'row', justifyContent: 'space-around', borderWidth: 1}}>
              <Text>Number</Text>
              <Text>Participants</Text>
              <Text>Account Type</Text>
              <Text></Text>
          </View>
          {renderOwnerBoard()};
      </View>
      <FlatList
        data={props.session.columns}
        extraData={props.session.columns}
        renderItem={item => {
          return renderColumn(item.item);
        }}>
      </FlatList>
    </React.Fragment >
  );
};

export const Participants = withStyles(ParticipantsComponent, (theme: ThemeType) => ({
    
    txtHeader: {
        color: theme['color-basic-dark-100'],
        ...textStyle.proTextBold,
        fontSize: pxPhone(20),
    },
    txtHeader2: {
        color: theme['color-basic-light-100'],
        lineHeight: pxToPercentage(25),
        ...textStyle.proTextBold,
    },
    iconShare: {
        width: pxToPercentage(20),
        height: pxToPercentage(20),
        tintColor: theme['color-basic-light-100'],
    },
    viewCard:{
        marginVertical: pxPhone(10), 
        marginHorizontal: pxPhone(15),
        borderRadius: pxToPercentage(9),
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
    viewHeaderCard: {
        borderTopLeftRadius:pxToPercentage(9),
        borderTopRightRadius:pxToPercentage(9),
        height: pxToPercentage(40),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme['color-green-1'],
    },
    viewItemCard:{
        borderBottomRightRadius:pxToPercentage(9),
        borderBottomLeftRadius:pxToPercentage(9),
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
    contentCard: {
        paddingLeft:pxPhone(15)
    },
    
    viewHeader: {
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
}));
