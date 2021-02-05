import { Post, Session } from '@src/core/models/type';
import { AppState } from '@src/core/store';
import { onClearBoard, onDeletePost, onReceiveBoard, onReceivePost, onUpdatePost } from '@src/core/store/reducer/session/actions';
import { SessionState } from '@src/core/store/reducer/session/types';
import { UserState } from '@src/core/store/reducer/user';
import React, { useEffect, useState } from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Participants } from './participants.component';
import { HomeState } from './store/reducer/types';
import io from 'socket.io-client';
import { Actions } from '@src/core/utils/constants';

export const ParticipantsContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  //const sessionId: string = props.navigation.getParam('sessionId');
  const sessionId: string = props.route.params.sessionId;
  const { user }: UserState = useSelector((state: AppState) => state.user);
  const { session }: SessionState = useSelector((state: AppState) => state.session);
  const { players }: SessionState = useSelector((state: AppState) => state.session);
  const dispatch: Dispatch<any> = useDispatch();

  const onBackPress = (): void => {
    props.navigation.goBack();
  };

  return (
    <Participants
      session={session}
      user={user} 
      players={players}/>
  );
};
