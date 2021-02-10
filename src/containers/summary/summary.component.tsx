import React from 'react';
import { withStyles, ThemeType, ThemedComponentProps } from '@kitten/theme';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { textStyle } from '@src/components/textStyle';
import { pxPhone, pxToPercentage } from '@src/core/utils/utils';
import { ColumnContent, Session } from '@src/core/models/type';
import { ActionIcon } from '@src/assets/icons';

interface ComponentProps {
  columns: ColumnContent[];
  session: Session;
}

export type SummaryProps = ComponentProps & ThemedComponentProps;

const SummaryComponent: React.FunctionComponent<SummaryProps> = (props) => {
  const { themedStyle } = props;
  const renderViewEmptyColumn = (group, post): React.ReactElement => {
    if (group.length === 0 && post.length === 0) {
      return <View>
        <Text style={themedStyle.contentCard}>
          There are no posts to display
      </Text>
      </View>
    }
  }
  const renderGroupCard = (column): React.ReactElement => {
    var ArrayCountLikeDislikeGroup = [];
    column.groups.map(itemGroup => {
      var getCountLikeDislike = 0;
      var getCountLike = 0;
      var getCountDislike = 0;
      itemGroup.posts.map(itemPost => {
        getCountLikeDislike = getCountLikeDislike + itemPost.votes.length;
        itemPost.votes.map(itemVote => {
          if (itemVote.type === 'like') {
            getCountLike = getCountLike + 1;
          } else {
            getCountDislike = getCountDislike + 1;
          }
        })
      })
      ArrayCountLikeDislikeGroup.push({ group: itemGroup, count: getCountLikeDislike, countLike: getCountLike, countDislike: getCountDislike })
    })
    ArrayCountLikeDislikeGroup.sort(function (a, b) { return b.count - a.count });
    if (ArrayCountLikeDislikeGroup.length > 0) {
      return <View style={{
        borderColor: 'gray',
        borderWidth: pxPhone(1),
        borderStyle: 'dashed',
        marginLeft: pxPhone(5),
        borderBottomWidth:0,
        borderTopWidth:0,
        borderRightWidth:0,
      }}>
        <FlatList
          data={ArrayCountLikeDislikeGroup}
          extraData={ArrayCountLikeDislikeGroup}
          renderItem={item => {
            return renderHeaderGroup(item.item)
          }}>
        </FlatList>
      </View>
    }
  }
  const renderHeaderGroup = (item): React.ReactElement => {
    var ArrayCountLikeDislike = [];
    item.group.posts.map(itemPost => {
      var getCountLike = 0;
      var getCountDislike = 0;
      var getCountLikeDislike = itemPost.votes.length;
      itemPost.votes.map((itemVote) => {
        if (itemVote.type === 'like') {
          getCountLike = getCountLike + 1;
        } else {
          getCountDislike = getCountDislike + 1;
        }
      });
      ArrayCountLikeDislike.push({ content: itemPost.content, count: getCountLikeDislike, countLike: getCountLike, countDislike: getCountDislike });
    })
    ArrayCountLikeDislike.sort(function (a, b) { return b.count - a.count });
    return <View style={{ left: pxPhone(-5) }}>
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
    return <View style={{ flexDirection: 'row', marginLeft: pxPhone(10) }}>
      <Text style={themedStyle.likeCard}>+ {item.countLike}</Text>
      <Text style={themedStyle.dislikeCard}>- {item.countDislike}</Text>
      <Text style={themedStyle.contentCard}>{item.content}</Text>
    </View>
  }
  const renderPostCard = (item): React.ReactElement => {
    var ArrayCountLikeDislikeCard = [];
    item.map(itemPost => {
      var getCountLike = 0;
      var getCountDislike = 0;
      var getCountLikeDislike = itemPost.votes.length;
      itemPost.votes.map(itemVote => {
        if (itemVote.type === 'like') {
          getCountLike = getCountLike + 1;
        } else {
          getCountDislike = getCountDislike + 1;
        }
      })
      ArrayCountLikeDislikeCard.push({ content: itemPost.content, count: getCountLikeDislike, countLike: getCountLike, countDislike: getCountDislike })
    })
    ArrayCountLikeDislikeCard.sort(function (a, b) { return b.count - a.count });
    if (ArrayCountLikeDislikeCard.length > 0) {
      return <FlatList
        data={ArrayCountLikeDislikeCard}
        extraData={ArrayCountLikeDislikeCard}
        renderItem={item => {
          return renderCard(item.item)
        }}>
      </FlatList>
    }
  }
  const renderCard = (item): React.ReactElement => {
    return <View style={{ flexDirection: 'row' }}>
      <Text style={themedStyle.likeCard}>+ {item.countLike}</Text>
      <Text style={themedStyle.dislikeCard}>- {item.countDislike}</Text>
      <Text style={themedStyle.contentCard}>{item.content}</Text>
    </View>
  }
  const renderColumn = (column): React.ReactElement => {
    return (
      <View style={themedStyle.viewContainer}>
        <View style={[themedStyle.viewHeaderColumn, { backgroundColor: column.item.color }]}>
          <Text style={themedStyle.txtHeader}>
            {column.item.label}
          </Text>
        </View>
        <View style={themedStyle.viewColumn}>
          {renderGroupCard(props.columns[column.index])}
          {renderPostCard(props.columns[column.index].posts)}
          {renderViewEmptyColumn(props.columns[column.index].groups, props.columns[column.index].posts)}
        </View>
      </View>
    );
  };

  const renderColumnPostAction = (column): React.ReactElement => {
    return (<View>
      {renderPostAction(props.columns[column.index].posts)}
    </View>
    );
  };
  const renderPostAction = (post): React.ReactElement => {
    return (<FlatList
      data={post}
      extraData={post}
      renderItem={(item) => {
        return renderAction(item.item)
      }}>
    </FlatList>)

  }
  const renderAction = (item): React.ReactElement => {
    if (item.action !== null) {
      return <View style={themedStyle.itemAction}>
        {ActionIcon([themedStyle.actionIcon])}
        <View style={{ flexDirection: 'column', width: '80%' }}>
          <Text style={themedStyle.textAction}>{item.action}</Text>
          <Text style={themedStyle.contentAction}>{item.content}</Text>
        </View>
      </View>
    }
  }

  const renderColumnGroupAction = (column): React.ReactElement => {
    return (<View>
      {renderGroupAction(props.columns[column.index].groups)}
    </View>
    );
  };
  const renderGroupAction = (group): React.ReactElement => {
    return (<FlatList
      data={group}
      extraData={group}
      renderItem={(item) => {
        return renderPostAction(item.item.posts)
      }}>
    </FlatList>)
  }
  return (
    <ScrollView>
      <FlatList
        data={props.session.columns}
        extraData={props.session.columns}
        renderItem={(item) => {
          return renderColumn(item);
        }}>
      </FlatList>
      <View style={themedStyle.viewContainer}>
        <View style={[themedStyle.viewHeaderColumn, { backgroundColor: '#5cdb95' }]}>
          <Text style={themedStyle.txtHeader}>
            {'My Actions'}
          </Text>
        </View>
        <View style={themedStyle.viewColumn}>
          <FlatList
            data={props.columns}
            extraData={props.columns}
            renderItem={(item) => {
              return renderColumnPostAction(item);
            }}>
          </FlatList>
          <FlatList
            data={props.columns}
            extraData={props.columns}
            renderItem={(item) => {
              return renderColumnGroupAction(item);
            }}>
          </FlatList>
        </View>
      </View>
    </ScrollView>
  );
};

export const Summary = withStyles(SummaryComponent, (theme: ThemeType) => ({
  viewContainer: {
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
  viewHeaderColumn: {
    borderTopLeftRadius: pxToPercentage(9),
    borderTopRightRadius: pxToPercentage(9),
    height: pxToPercentage(40),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewColumn: {
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
  contentCard: {
    paddingLeft: pxPhone(10),
    width: '80%',
  },
  likeCard: {
    paddingLeft: pxPhone(10),
    color: 'green',
  },
  dislikeCard: {
    paddingLeft: pxPhone(10),
    color: 'red',
  },
  viewGroup: {
    flexDirection: 'row',
  },
  contentGroup: {
    paddingLeft: pxPhone(10),
    width: '80%',
    color: 'darkgray',
    ...textStyle.proTextSemibold,
  },
  likeGroup: {
    paddingLeft: pxPhone(10),
    color: '#b2cfb4',
  },
  dislikeGroup: {
    paddingLeft: pxPhone(10),
    color: '#f9bbba',
  },
  itemAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: pxPhone(4),
  },
  actionIcon: {
    width: pxPhone(18),
    height: pxPhone(18),
    marginLeft: pxPhone(10),
  },
  textAction: {
    marginLeft: pxPhone(10),
    width: '100%'
  },
  contentAction: {
    marginLeft: pxPhone(10),
    width: '100%',
    color: 'darkgray'
  }
}));
