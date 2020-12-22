import { Post, Session } from '@src/core/models/type';
import { AppState } from '@src/core/store';
import { onReceiveBoard, onReceivePost } from '@src/core/store/reducer/session/actions';
import { SessionState } from '@src/core/store/reducer/session/types';
import { UserState } from '@src/core/store/reducer/user';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Board } from './board.component';
import { HomeState } from './store/reducer/types';
import { onThunkCreateBoardReq, onThunkGetPrePublicBoardsReq } from './store/thunk';
import io from 'socket.io-client';
import { Actions } from '@src/core/utils/constants';

export const BoardContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const sessionId: string = props.navigation.getParam('sessionId');
  const { user }: UserState = useSelector((state: AppState) => state.user);
  const { session }: SessionState = useSelector((state: AppState) => state.session);
  const { boards }: HomeState = useSelector((state: AppState) => state.home);
  const dispatch: Dispatch<any> = useDispatch();
  const [socket, setSocket] = useState(null);

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
  }, []);

  const onAddPost = useCallback(
    (columnIndex: number, content: string, rank: string) => {
      if (send) {
        const post = {
          content,
          action: null,
          giphy: null,
          votes: [],
          id: 'asdasd-sdsdsd-sdsds-sxxxxxx',
          column: columnIndex,
          user: user!,
          group: null,
          rank,
        };

        send(Actions.ADD_POST_SUCCESS, post);
      }
    },
    [send],
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
      session={session} />
  );
};
