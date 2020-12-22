import {
  SessionState,
  SessionActionTypes,
  RECEIVE_POST,
  RECEIVE_BOARD,
} from './types';

const initialState: SessionState = {
  players: [],
  session: {
    id: 'null',
    posts: [],
    name: '',
    members: [],
    groups: [],
    columns: [],
    options: undefined,
    createdBy: undefined,
  },
  panelOpen: false,
};

export const sessionReducer = (
  state = initialState,
  action: SessionActionTypes,
): SessionState => {
  console.log(action.type, action.payload);

  switch (action.type) {
    case RECEIVE_POST: {
      if (!state.session) {
        return state;
      }

      return {
        ...state,
        session: {
          ...state.session,
          posts: [...state.session.posts, action.payload],
        },
      };
    }

    case RECEIVE_BOARD:
      return {
        ...state,
        session: action.payload,
      };
    default: {
      return state;
    }
  }
};
