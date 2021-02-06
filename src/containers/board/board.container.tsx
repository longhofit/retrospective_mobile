import { Post, PostGroup, Session, Vote, VoteType } from '@src/core/models/type';
import { AppState } from '@src/core/store';
import { onClearBoard, onDeletePost, onReceiveBoard, onReceivePost, onReceiveVote, onSetPlayers, onUpdatePost } from '@src/core/store/reducer/session/actions';
import { SessionState } from '@src/core/store/reducer/session/types';
import { UserState } from '@src/core/store/reducer/user';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Board } from './board.component';
import { HomeState } from './store/reducer/types';
import { onThunkGetPrePublicBoardsReq } from './store/thunk';
import io from 'socket.io-client';
import { Actions } from '@src/core/utils/constants';
import uuid from 'react-native-uuid';

export const BoardContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  // const sessionId: string = props.navigation.getParam('sessionId');
  const sessionId: string = props.route.params.sessionId;
  const { user }: UserState = useSelector((state: AppState) => state.user);
  const { session }: SessionState = useSelector((state: AppState) => state.session);
  const { players }: SessionState = useSelector((state: AppState) => state.session);
  const { boards }: HomeState = useSelector((state: AppState) => state.home);
  const dispatch: Dispatch<any> = useDispatch();
  const [socket, setSocket] = useState(null);
  console.log(sessionId);
  // socket connection

  function sendFactory(socket, sessionId) {
    return function (action, payload?) {
      console.log(action);
      if (socket) {
        const messagePayload = {
          sessionId: sessionId,
          payload,
        };

        console.log('Sending message to socket', action, messagePayload);

        socket.emit(action, messagePayload);
      }
    };
  }

  const send = useMemo(
    () => (socket ? sendFactory(socket, sessionId) : null),
    [socket, sessionId],
  );

  useEffect(() => {
    const newSocket = io('http://10.0.2.2:8082');
    setSocket(newSocket);

    const send = sendFactory(newSocket, sessionId);

    // Socket events listeners
    newSocket.on(Actions.RECEIVE_POST, (post: Post) => {
      console.log('Receive new post:');

      dispatch(onReceivePost(post));
    });

    newSocket.on('disconnect', () => {
      console.log('Server disconnected');
    });

    newSocket.on('connect', () => {
      console.log('Connected to the socket');

      send(Actions.JOIN_SESSION);
    });

    newSocket.on(Actions.RECEIVE_BOARD, (board: Session) => {
      console.log('Receive entire board: ');

      dispatch(onReceiveBoard(board));
    });

    newSocket.on(Actions.RECEIVE_EDIT_POST, (post: { post: Post }) => {
      console.log('Receive edit post: ', post.post);
      dispatch(onUpdatePost(post.post));
    });

    newSocket.on(Actions.RECEIVE_DELETE_POST, (post: Post) => {
      console.log('Delete post: ', post);
      dispatch(onDeletePost(post));
    });

    newSocket.on(Actions.RECEIVE_CLIENT_LIST, (clients: string[]) => {
      dispatch(onSetPlayers(clients));
    });

    newSocket.on(
      Actions.RECEIVE_LIKE,
      ({ postId, vote }: { postId: string; vote: Vote }) => {
        console.log('Receive vote: ', postId, vote);
        dispatch(onReceiveVote({ postId, vote }));
      }
    );

    return () => {
      console.log('Attempting disconnection');
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      dispatch(onClearBoard());
    };
  }, []);

  const onAddPost = useCallback(
    (columnIndex: number, content: string, rank: string) => {
      if (send) {
        const post: Post = {
          content,
          action: null,
          giphy: null,
          votes: [],
          id: uuid.v4(),
          column: columnIndex,
          group: null,
          rank,
          user: user,
        };

        send(Actions.ADD_POST_SUCCESS, post);
        dispatch(onReceivePost(post));
      }
    },
    [send],
  );

  const onEditPost = useCallback(
    (post: Post) => {
      if (send) {
        dispatch(onUpdatePost(post));
        send(Actions.EDIT_POST, { post });
      }
    },
    [send]
  );

  const onDeletePostPress = useCallback(
    (post: Post) => {
      if (send) {
        dispatch(onDeletePost(post));
        send(Actions.DELETE_POST, post);
      }
    },
    [send]
  );

  const onMovePost = useCallback(
    (
      post: Post,
      destinationGroup: PostGroup | null,
      destinationColumn: number,
      newRank: string
    ) => {
      if (send) {
        const updatedPost: Post = {
          ...post,
          column: destinationColumn,
          group: destinationGroup,
          rank: newRank,
        };
        dispatch(onUpdatePost(updatedPost));
        send(Actions.EDIT_POST, {
          post: updatedPost,
        });
      }
    },
    [send]
  );

  const onLike = useCallback(
    (post: Post, like: boolean) => {
      if (send) {
        const type: VoteType = like ? 'like' : 'dislike';
        const existingVote: Vote = post.votes.find(item => item.type === type && item.user.id === user!.id)
        // if (existingVote && !allowMultipleVotes) {
        //   return;
        // }
        if (existingVote) {
          return;
        }

        const vote: Vote = {
          id: uuid.v4(),
          type,
          user: user!,
        };
        const modifiedPost: Post = {
          ...post,
          votes: [...post.votes, vote],
        };
        dispatch(onUpdatePost(modifiedPost));
        send(Actions.LIKE_SUCCESS, {
          type,
          post,
        });
      }
    },
    [user, send, onUpdatePost]
  );

  const onBackPress = (): void => {
    props.navigation.goBack();
  };

  const onGetBoardSuccess = (): void => {
  };

  const onGetBoardError = (): void => {
  };

  const onCreateBoardSuccess = (): void => {
    onGetPrePublicBoards();
  };


  const onGetPrePublicBoards = (): void => {
    dispatch(onThunkGetPrePublicBoardsReq(
      onGetBoardSuccess,
      onGetBoardError,
    ));
  };


  return (
    <Board
      onAddPost={onAddPost}
      onEditPost={onEditPost}
      onDeletePostPress={onDeletePostPress}
      onMovePost={onMovePost}
      onLike={onLike}
      session={session}
    />
  );
};
