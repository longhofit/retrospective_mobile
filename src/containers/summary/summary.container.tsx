import { Post, Session } from '@src/core/models/type';
import { AppState } from '@src/core/store';
import { onClearBoard, onDeletePost, onReceiveBoard, onReceivePost, onUpdatePost } from '@src/core/store/reducer/session/actions';
import { SessionState } from '@src/core/store/reducer/session/types';
import { UserState } from '@src/core/store/reducer/user';
import React, { useEffect, useState } from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Summary } from './summary.component';
import { HomeState } from './store/reducer/types';
import io from 'socket.io-client';
import { Actions } from '@src/core/utils/constants';

export const SummaryContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  //const sessionId: string = props.navigation.getParam('sessionId');
  const sessionId: string = props.route.params.sessionId;
  const { user }: UserState = useSelector((state: AppState) => state.user);
  const { session }: SessionState = useSelector((state: AppState) => state.session);
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


  const onBackPress = (): void => {
    props.navigation.goBack();
  };

  return (
    <Summary
      session={session} />
  );
};
