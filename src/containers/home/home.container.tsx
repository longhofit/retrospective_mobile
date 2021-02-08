import { Post, Session } from '@src/core/models/type';
import { AppState } from '@src/core/store';
import { SessionState } from '@src/core/store/reducer/session/types';
import { UserState } from '@src/core/store/reducer/user';
import { toasts } from '@src/core/utils/toasts';
import React, { useEffect } from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Home } from './home.component';
import { onClearBoards } from './store/reducer/actions';
import { HomeState } from './store/reducer/types';
import { onThunkCreateBoardReq, onThunkCreateCustomBoardReq, onThunkGetPrePrivateBoardsReq, onThunkGetPrePublicBoardsReq } from './store/thunk';

export const HomeContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const { user }: UserState = useSelector((state: AppState) => state.user);
  const { session }: SessionState = useSelector((state: AppState) => state.session);
  const { boards, privateBoards }: HomeState = useSelector((state: AppState) => state.home);
  const dispatch: Dispatch<any> = useDispatch();

  useEffect(() => {
    onGetPrePublicBoards();
    onGetPrePrivateBoards();
  }, []);

  useEffect(() => {
    return () => {
      dispatch(onClearBoards());
    };
  }, []);

  const onBoardPress = (sessionId: string): void => {
    props.navigation.navigate({
      routeName: 'DetailBoard',
      params: {
        sessionId,
      }
    })
  };

  const receivePost = (post: Post): void => {
  }

  const receiveBoard = (board: Session): void => {
  }

  const onBackPress = (): void => {
    props.navigation.goBack();
  };

  const onGetBoardSuccess = (): void => {
  };

  const onGetBoardError = (): void => {
  };

  const onCreateBoardSuccess = (): void => {
    toasts.success('Create board successfully!!!');
    onGetPrePublicBoards();
    onGetPrePrivateBoards();
  };


  const onGetPrePublicBoards = (): void => {
    dispatch(onThunkGetPrePublicBoardsReq(
      onGetBoardSuccess,
      onGetBoardError,
    ));
  };

  const onGetPrePrivateBoards = (): void => {
    dispatch(onThunkGetPrePrivateBoardsReq(
      onGetBoardSuccess,
      onGetBoardError,
    ));
  };

  const onCreateBoard = (data): void => {
    dispatch(onThunkCreateCustomBoardReq(
      data,
      onCreateBoardSuccess,
      () => { },
    ));
  };

  return (
    <Home
      onBoardPress={onBoardPress}
      onCreateBoard={onCreateBoard}
      boards={boards.concat(privateBoards)}
      onReceiveBoard={receiveBoard}
      session={session}
      onReceivePost={receivePost}
      user={user}
      sessionId={'iQdhS78i7'}
      onBackPress={onBackPress}
      name={'asasd'} />
  );
};
