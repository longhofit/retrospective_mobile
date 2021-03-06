import {ThunkActionTypes} from '@src/core/store/thunk/types';
import {alerts} from '@src/core/utils/alerts';
import HomeService from '@src/core/services/home.service';
import {BoardMetaData} from '@src/core/models/board/board.model';
import {onGetPrevPublicBoard, onGetPrevPrivateBoard} from '../reducer/actions';

export const onThunkGetPrePublicBoardsReq = (
  onSuccess: () => void,
  onError: () => void,
): ThunkActionTypes => async (dispatch) => {
  const homeService = new HomeService();

  try {
    const res: BoardMetaData[] = await homeService.getPrevPublicBoards();

    if (res) {
      dispatch(onGetPrevPublicBoard(res));
      onSuccess();
    } else {
      alerts.alert({message: 'Get public boards not successfully'});
      onError();
    }
  } catch (e) {
    alerts.alert({message: 'Get public boards not successfully'});
    onError();
  }
};

export const onThunkGetPrePrivateBoardsReq = (
  onSuccess: () => void,
  onError: () => void,
): ThunkActionTypes => async (dispatch) => {
  const homeService = new HomeService();

  try {
    const res: BoardMetaData[] = await homeService.getPrevPrivateBoards();

    if (res) {
      dispatch(onGetPrevPrivateBoard(res));
      onSuccess();
    } else {
      alerts.alert({message: 'Get private boards not 2 successfully'});
      onError();
    }
  } catch (e) {
    alerts.alert({message: 'Get private boards not successfully'});
    onError();
  }
};

export const onThunkCreateBoardReq = (
  onSuccess: () => void,
  onError: () => void,
): ThunkActionTypes => async () => {
  const homeService = new HomeService();

  try {
    const res = await homeService.createBoard();

    if (res) {
      onSuccess();
    } else {
      alerts.alert({message: 'Create board successfully'});
      onError();
    }
  } catch (e) {
    alerts.alert({message: 'Create board not successfully'});
    onError();
  }
};

export const onThunkCreateCustomBoardReq = (
  data,
  onSuccess: () => void,
  onError: () => void,
): ThunkActionTypes => async () => {
  const homeService = new HomeService();

  try {
    const res = await homeService.createCustomBoard(data);

    if (res) {
      onSuccess();
    } else {
      alerts.alert({message: 'Create board successfully'});
      onError();
    }
  } catch (e) {
    alerts.alert({message: 'Create board not successfully'});
    onError();
  }
};

export const onThunkDeleteBoardReq = (
  data: String,
  onSuccess: () => void,
  onError: () => void,
): ThunkActionTypes => async () => {
  const homeService = new HomeService();

  try {
    const res = await homeService.deleteBoard(data);

    if (res) {
      onSuccess();
    } else {
      onError();
    }
  } catch (e) {
    alerts.alert({message: 'Delete board not successfully'});
    onError();
  }
};
