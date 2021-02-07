import React, { ReactElement, useState } from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { View, Text, TouchableOpacity, FlatList, Clipboard, Group } from 'react-native';
import { ShareIcon } from '@src/assets/icons';
import { textStyle } from '@src/components/textStyle';
import { pxPhone, pxToPercentage } from '@src/core/utils/utils';
import { ColumnContent, ColumnDefinition, Session } from '@src/core/models/type';

interface ComponentProps {
  columns: ColumnContent[];
  session: Session;
}

export type SummaryProps = ComponentProps & ThemedComponentProps;

const SummaryComponent: React.FunctionComponent<SummaryProps> = (props) => {
  const { themedStyle } = props;
  console.log("props.session.columns:", props.session.columns);
  console.log("props.session.groups:", props.columns[0].posts);
  console.log("props.session.columns:", props.columns[0].color);
  const renderViewEmptyColumn = (group, post): React.ReactElement => {
    if(group.length === 0 && post.length === 0){
      return <View>
      <Text style={themedStyle.contentCard}>
          There are no posts to display
      </Text>
    </View>
    }
  }
  const renderGroupCard = (column): React.ReactElement => {
    var ArrayCountLikeDislikeGroup = [];
    column.groups.map(itemGroup =>{
      var getCountLikeDislike = 0;
      var getCountLike = 0;
      var getCountDislike = 0;
      itemGroup.posts.map(itemPost => {
        getCountLikeDislike = getCountLikeDislike + itemPost.votes.length;
        itemPost.votes.map(itemVote =>{
          if(itemVote.type === 'like'){
            getCountLike = getCountLike + 1;
          }else{
            getCountDislike = getCountDislike + 1;
          }
        })
      })
      ArrayCountLikeDislikeGroup.push({group: itemGroup, count: getCountLikeDislike, countLike: getCountLike, countDislike: getCountDislike})
    })
    ArrayCountLikeDislikeGroup.sort(function(a, b){return b.count - a.count});
    if(ArrayCountLikeDislikeGroup.length > 0)
    {
      return <FlatList
              data={ArrayCountLikeDislikeGroup}
              extraData={ArrayCountLikeDislikeGroup}
              renderItem={item => {
                return renderHeaderGroup(item.item)
              }}>
              </FlatList>
    }else{
      return <View></View>
    }
  }
  const renderHeaderGroup = (item): React.ReactElement => {
    var ArrayCountLikeDislike = [];
    item.group.posts.map(itemPost => {
      var getCountLike = 0;
      var getCountDislike = 0;
      var getCountLikeDislike = itemPost.votes.length;
      itemPost.votes.map((itemVote) => {
        if(itemVote.type === 'like'){
          getCountLike = getCountLike + 1;
        }else{
          getCountDislike = getCountDislike + 1;
        }
      });
      ArrayCountLikeDislike.push({content: itemPost.content, count: getCountLikeDislike, countLike: getCountLike, countDislike: getCountDislike});
    })
    ArrayCountLikeDislike.sort(function(a, b){return b.count - a.count});
    return <View>
      <View style={themedStyle.viewGroup}>
        <Text style={themedStyle.likeGroup}>+ {item.countLike}</Text>
        <Text style={themedStyle.dislikeGroup}>- {item.countDislike}</Text>
        <Text style={themedStyle.contentGroup}>{item.group.label}</Text>
      </View>
      <FlatList
      data={ArrayCountLikeDislike}
      extraData={ArrayCountLikeDislike}
      renderItem={item => {
        return renderItemGroup(item.item)
      }}>
      </FlatList>
    </View>
  }
  const renderItemGroup = (item): React.ReactElement => {
    return <View style={{flexDirection: 'row', marginLeft: pxPhone(10)}}>
      <Text style={themedStyle.likeCard}>+ {item.countLike}</Text>
      <Text style={themedStyle.dislikeCard}>- {item.countDislike}</Text>
      <Text style={themedStyle.contentCard}>{item.content}</Text>
    </View>
  }
  const renderPostCard = (item):React.ReactElement => {
    var ArrayCountLikeDislikeCard = [];
    item.map(itemPost =>{
      var getCountLike = 0;
      var getCountDislike = 0;
      var getCountLikeDislike = itemPost.votes.length;
        itemPost.votes.map(itemVote =>{
          if(itemVote.type === 'like'){
            getCountLike = getCountLike + 1;
          }else{
            getCountDislike = getCountDislike + 1;
          }
        })
      ArrayCountLikeDislikeCard.push({content: itemPost.content, count: getCountLikeDislike, countLike: getCountLike, countDislike: getCountDislike})
    })
    ArrayCountLikeDislikeCard.sort(function(a, b){return b.count - a.count});
    if(ArrayCountLikeDislikeCard.length > 0)
    {
      return <FlatList
              data={ArrayCountLikeDislikeCard}
              extraData={ArrayCountLikeDislikeCard}
              renderItem={item => {
                return renderCard(item.item)
              }}>
              </FlatList>
    }else{
      return <View></View>
    }
  }
  const renderCard = (item):React.ReactElement => {
    return <View style={{flexDirection: 'row'}}>
        <Text style={themedStyle.likeCard}>+ {item.countLike}</Text>
        <Text style={themedStyle.dislikeCard}>- {item.countDislike}</Text>
        <Text style={themedStyle.contentCard}>{item.content}</Text>
      </View>
  }
  const renderColumn = (column): React.ReactElement => {
    return (
      <View style={themedStyle.viewContainer}>
        <View style={[themedStyle.viewHeaderCard, {backgroundColor: column.item.color}]}>
          <Text style={themedStyle.txtHeader}>
            {column.item.label}
          </Text>
        </View>
        <View style={themedStyle.viewColumn}>
        {renderGroupCard(props.columns[column.index])}
        {renderPostCard(props.columns[column.index].posts)}
        {renderViewEmptyColumn(props.columns[column.index].groups,props.columns[column.index].posts)}
        </View>
      </View>
    );
  };

  return (
    <React.Fragment>
      <FlatList
        data={props.session.columns}
        extraData={props.session.columns}
        renderItem={(item) => {
          return renderColumn(item);
        }}>
      </FlatList>
    </React.Fragment >
  );
};

export const Summary = withStyles(SummaryComponent, (theme: ThemeType) => ({
  viewContainer:{
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
  txtHeader: {
    lineHeight: pxToPercentage(25),
    ...textStyle.proTextBold,
  },

  viewHeaderCard: {
    borderTopLeftRadius:pxToPercentage(9),
    borderTopRightRadius:pxToPercentage(9),
    height: pxToPercentage(40),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  viewColumn:{
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
    paddingLeft:pxPhone(10),
    width:'80%',
  },
  likeCard: {
    paddingLeft:pxPhone(10),
    color:'green',
  },
  dislikeCard: {
    paddingLeft:pxPhone(10),
    color:'red',
  },
  viewGroup:{
    flexDirection:'row',
  },
  contentGroup: {
    paddingLeft:pxPhone(10),
    width:'80%',
    color:'darkgray'
  },
  likeGroup: {
    paddingLeft:pxPhone(10),
    color:'#b2cfb4',
  },
  dislikeGroup: {
    paddingLeft:pxPhone(10),
    color:'#f9bbba',
  },
}));
