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

export const sessionReducer = (state = initialState, action: SessionActionTypes): SessionState => {
  console.log(action.type)
  switch (action.type) {
    case RECEIVE_POST: {

      if (!state.session) {
        return state;
      }

      // console.log('action.payload', action.payload)

      // const newState = {
      //   ...state,
      //   session: {
      //     ...state.session,
      //     posts: [...state.session.posts, action.payload],
      //   },
      // }

      // console.log('action.newState', newState)

      console.log(state.session.posts)

      return {
        ...state,
        session: {
          ...state.session,
          posts: [...state.session.posts, action.payload],
        },
      };
    }

    case RECEIVE_BOARD:
      console.log('REDUER', {
        ...state,
        session: action.payload,
      })
      return {
        ...state,
        session: action.payload,
      };
    default: {
      return state;
    }
  }
};
