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

export type SummaryProps = ComponentProps & ThemedComponentProps;

const SummaryComponent: React.FunctionComponent<SummaryProps> = (props) => {
  const { themedStyle } = props;
  const [checkEmpty, setCheckEmpty] = useState(true);
  const renderViewItemCard = (): React.ReactElement => {
      if(checkEmpty === true){
          return <View>
            <Text style={themedStyle.contentCard}>
                There are no posts to display
            </Text>
          </View>
      }
  }
  const renderColumn = (column: ColumnDefinition): React.ReactElement => {
    //setCheckEmpty(true);
    return (
      <View style={themedStyle.viewCard}>
        <View style={themedStyle.viewHeaderCard}>
          <Text style={themedStyle.txtHeader}>
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

  return (
    <React.Fragment>
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

export const Summary = withStyles(SummaryComponent, (theme: ThemeType) => ({
    
    txtHeader: {
      color: theme['color-basic-light-100'],
      lineHeight: pxToPercentage(25),
      ...textStyle.proTextBold,
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

}));
