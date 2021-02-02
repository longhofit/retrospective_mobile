
import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { DetailBoard } from './detail-board.component';

export const DetailBoardContainer: React.FunctionComponent<NavigationInjectedProps> = (props) => {
  const sessionId: string = props.navigation.getParam('sessionId');
  console.log(sessionId);
  return (
    <DetailBoard 
    sessionId = {sessionId}/>
  );
};
