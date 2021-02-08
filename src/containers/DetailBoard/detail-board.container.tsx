
import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { DetailBoard } from './detail-board.component';
import { AppState } from '@src/core/store';
import { SessionState } from '@src/core/store/reducer/session/types';
import { useDispatch, useSelector } from 'react-redux';
export const DetailBoardContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const sessionId: string = props.navigation.getParam('sessionId');
  const name: string = props.navigation.getParam('name');
  const { session }: SessionState = useSelector((state: AppState) => state.session);
  return (
    <DetailBoard
      onBack={() => props.navigation.goBack()}
      sessionId={sessionId}
      session={session} />
  );
};
