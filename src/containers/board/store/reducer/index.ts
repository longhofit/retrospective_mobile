import {
  HomeState,
  HomeActionTypes,
  GET_PREV_PUBLIC_BOARD,
} from './types';

const initialState: HomeState = {
  boards: [],
};

export const homeReducer = (state = initialState, action: HomeActionTypes): HomeState => {
  switch (action.type) {
    case GET_PREV_PUBLIC_BOARD: {
      return {
        boards: action.payload
      }
    }

    default:
      return state;
  }
};
