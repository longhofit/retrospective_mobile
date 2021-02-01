import {
  HomeState,
  HomeActionTypes,
  GET_PREV_PUBLIC_BOARD,
  GET_PREV_PRIVATE_BOARD,
} from './types';

const initialState: HomeState = {
  boards: [],
  privateBoards: [],
};

export const homeReducer = (
  state = initialState,
  action: HomeActionTypes,
): HomeState => {
  switch (action.type) {
    case GET_PREV_PUBLIC_BOARD: {
      return {
        ...state,
        boards: action.payload,
      };
    }

    case GET_PREV_PRIVATE_BOARD: {
      return {
        ...state,
        privateBoards: action.payload,
      };
    }

    default:
      return state;
  }
};
