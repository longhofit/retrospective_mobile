import ApiService from './api.service';
import { BoardMetaData } from '../models/board/board.model';

export default class HomeService extends ApiService {
  public getPrevPublicBoards() {
    return this.apiGet<BoardMetaData[]>('/previous/public');
  }
}
