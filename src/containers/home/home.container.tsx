import { Post, Session } from '@src/core/models/type';
import { AppState } from '@src/core/store';
import { onReceiveBoard, onReceivePost } from '@src/core/store/reducer/session/actions';
import { SessionState } from '@src/core/store/reducer/session/types';
import { UserState } from '@src/core/store/reducer/user';
import React, { useEffect } from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Home } from './home.component';
import { HomeState } from './store/reducer/types';
import { onThunkGetPrePublicBoardsReq } from './store/thunk';

export const HomeContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const navigationKey: string = 'HomeContainer';
  const sessionId: string = props.navigation.getParam('sessionId');
  const { user }: UserState = useSelector((state: AppState) => state.user);
  const { session }: SessionState = useSelector((state: AppState) => state.session);
  const { boards }: HomeState = useSelector((state: AppState) => state.home);
  const dispatch: Dispatch<any> = useDispatch();

  const receivePost = (post: Post): void => {
    dispatch(onReceivePost(post));
  }

  const receiveBoard = (board: Session): void => {
    dispatch(onReceiveBoard(board));
  }

  const onBackPress = (): void => {
    props.navigation.goBack();
  };

  const onGetBoardSuccess = (): void => {
  };
  const onGetBoardError = (): void => {
  };

  const onGetPrePublicBoards = (): void => {
    dispatch(onThunkGetPrePublicBoardsReq(
      onGetBoardSuccess,
      onGetBoardError,
    ));
  }

  useEffect(() => {
    onGetPrePublicBoards();
  }, [])

  return (
    <Home
      boards={boards}
      onReceiveBoard={receiveBoard}
      session={session}
      onReceivePost={receivePost}
      user={user}
      sessionId={'iQdhS78i7'}
      onBackPress={onBackPress}
      name={'asasd'} />
  );
};
