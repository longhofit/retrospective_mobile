import {
  SessionState,
  SessionActionTypes,
  RECEIVE_POST,
  RECEIVE_BOARD,
  CLEAR_BOARD,
  EDIT_POST,
  DELETE_POST,
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

    case CLEAR_BOARD:
      return {
        ...state,
        session: initialState.session,
      };

    case EDIT_POST:
      if (!state.session) {
        return state;
      }

      const index: number = state.session.posts.findIndex(
        (item) => item.id === action.payload.id,
      );

      if (index === -1) {
        return state;
      }

      return {
        ...state,
        session: {
          ...state.session,
          posts: [
            ...state.session.posts.slice(0, index),
            action.payload,
            ...state.session.posts.slice(index + 1),
          ],
        },
      };

    case DELETE_POST:
      console.log(action.payload)
      if (!state.session) {
        return state;
      }
      return {
        ...state,
        session: {
          ...state.session,
          posts: state.session.posts.filter((p) => p.id !== action.payload.id),
        },
      };
    default: {
      return state;
    }
  }
};
