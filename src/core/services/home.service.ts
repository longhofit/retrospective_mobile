import ApiService from './api.service';
import {BoardMetaData} from '../models/board/board.model';

export default class HomeService extends ApiService {
  public getPrevPublicBoards() {
    return this.apiGet<BoardMetaData[]>('/previous/public');
  }

  public getPrevPrivateBoards() {
    return this.apiGet<BoardMetaData[]>('/previous/private');
  }

  public createBoard() {
    return this.apiPost('/create');
  }

  public createCustomBoard(data) {
    return this.apiPost('/create-custom', data);
  }

  public deleteBoard(sessionId: String) {
    return this.apiDelete(`/session/${sessionId}`);
  }
}
