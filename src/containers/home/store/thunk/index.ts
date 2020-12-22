import AuthService from '@src/core/services/auth.service';
import { ThunkActionTypes } from '@src/core/store/thunk/types';
import { alerts } from '@src/core/utils/alerts';
import { ApiResult } from '@src/core/dataTransfer/apiResult';
import { SignInFormData, SignInReq } from '@src/core/models/signUp/signInReq.model';
import { onSetUser } from '@src/core/store/reducer/user/actions';
import { User } from '@src/core/models/user/user.model';
import HomeService from '@src/core/services/home.service';
import { BoardMetaData } from '@src/core/models/board/board.model';
import { onGetPrevPublicBoard } from '../reducer/actions';

export const onThunkGetPrePublicBoardsReq = (
  onSuccess: () => void,
  onError: () => void,
): ThunkActionTypes => async dispatch => {
  const homeService = new HomeService();
  try {
    const res: BoardMetaData[] = await homeService.getPrevPublicBoards();
    if (res) {
      dispatch(onGetPrevPublicBoard(res));
      onSuccess();
    } else {
      alerts.alert({ message: 'Get public boards not successfully' });
      onError();
    }
  } catch (e) {
    // const { message }: ApiResult = e;
    alerts.alert({ message: 'Get public boards not successfully' });
    onError();
  }
};
