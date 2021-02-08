import {
  SessionState,
  SessionActionTypes,
  RECEIVE_POST,
  RECEIVE_BOARD,
  CLEAR_BOARD,
  EDIT_POST,
  DELETE_POST,
  SET_PLAYERS,
  RECEIVE_VOTE,
  RECEIVE_POSTGROUP,
  UPDATE_POST_GROUP,
  DELETE_POST_GROUP,
  EDIT_OPTIONS,
  RENAME_SESSION,
  EDIT_COLUMNS,
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

    case SET_PLAYERS:
      return {...state, players: action.payload};

    case RECEIVE_VOTE:
      if (!state.session) {
        return state;
      }

      const postIndex: number = state.session.posts.findIndex(
        (item) => item.id === action.payload.postId,
      );
      const post = state.session.posts[postIndex];

      if (!post) {
        return state;
      }

      return {
        ...state,
        session: {
          ...state.session,
          posts: [
            ...state.session.posts.slice(0, postIndex),
            {
              ...post,
              votes: [...post.votes, action.payload.vote],
            },
            ...state.session.posts.slice(postIndex + 1),
          ],
        },
      };

    case RECEIVE_POSTGROUP:
      if (!state.session) {
        return state;
      }
      return {
        ...state,
        session: {
          ...state.session,
          groups: [...state.session.groups, action.payload],
        },
      };

    case UPDATE_POST_GROUP:
      if (!state.session) {
        return state;
      }

      const groupIndex = state.session.groups.findIndex(
        (g) => g.id === action.payload.id,
      );

      if (groupIndex === -1) {
        return state;
      }
      return {
        ...state,
        session: {
          ...state.session,
          groups: [
            ...state.session.groups.slice(0, groupIndex),
            action.payload,
            ...state.session.groups.slice(groupIndex + 1),
          ],
        },
      };

    case DELETE_POST_GROUP:
      if (!state.session) {
        return state;
      }
      return {
        ...state,
        session: {
          ...state.session,
          groups: state.session.groups.filter(
            (g) => g.id !== action.payload.id,
          ),
          posts: state.session.posts.map((p) =>
            p.group && p.group.id === action.payload.id
              ? {
                  ...p,
                  group: null,
                }
              : p,
          ),
        },
      };

    case EDIT_OPTIONS:
      if (!state.session) {
        return state;
      }
      return {
        ...state,
        session: {
          ...state.session,
          options: action.payload,
        },
      };

    case RENAME_SESSION:
      if (!state.session) {
        return state;
      }
      return {
        ...state,
        session: {
          ...state.session,
          name: action.payload,
        },
      };

    case EDIT_COLUMNS:
      if (!state.session) {
        return state;
      }
      return {
        ...state,
        session: {
          ...state.session,
          columns: action.payload,
        },
      };

    default: {
      return state;
    }
  }
};
