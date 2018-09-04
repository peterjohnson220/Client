import { CommunityPost } from 'libs/models/community';
import * as communityPostActions from '../actions/community-post.actions';

export interface State {
  submitting: boolean;
  submittingError: boolean;
  loading: boolean;
  loadingError: boolean;
  entities: CommunityPost[];
  submittedPost: CommunityPost;
}

export const initialState: State = {
  submitting: false,
  submittingError: false,
  loading: false,
  loadingError: false,
  entities: [],
  submittedPost: null
};

export function reducer(state = initialState, action: communityPostActions.Actions): State {
  switch (action.type) {
    case communityPostActions.SUBMITTING_COMMUNITY_POST: {
      return {
        ...state,
        submitting: true,
        submittingError: false
      };
    }
    case communityPostActions.SUBMITTING_COMMUNITY_POST_SUCCESS: {
      const updatedEntities = [];
      updatedEntities.push(action.payload);

      for (const entity of state.entities) {
        updatedEntities.push(entity);
      }
      return {
        ...state,
        submitting: false,
        submittedPost: action.payload,
        entities: updatedEntities
      };
    }
    case communityPostActions.SUBMITTING_COMMUNITY_POST_ERROR: {
      return {
        ...state,
        submitting: false,
        submittingError: true
      };
    }
    case communityPostActions.GETTING_COMMUNITY_POSTS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case communityPostActions.GETTING_COMMUNITY_POSTS_SUCCESS: {
      return {
        ...state,
        loading: false,
        entities: action.payload
      };
    }
    case communityPostActions.GETTING_COMMUNITY_POSTS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case communityPostActions.UPDATING_COMMUNITY_POST_LIKE_SUCCESS: {
      const postId = action.payload['postId'];
      const like = action.payload['like'];

      const updatedEntities = state.entities.map(entity => {
        if (entity.Id === postId) {
        return {
          ...entity,
          LikedByCurrentUser: like,
          LikeCount: like ? entity.LikeCount + 1 : entity.LikeCount - 1
        };
      } else {
          return entity;
        }
      });
    return {
        ...state,
        entities: updatedEntities
      };
    }
    case communityPostActions.UPDATING_COMMUNITY_POST_LIKE_ERROR: {
      return {
        ...state,
        submittingError: true
      };
    }
    default: {
      return state;
    }
  }
}
export const getSubmittingCommunityPosts = (state: State) => state.submitting;
export const getSubmittingCommunityPostsError = (state: State) => state.submittingError;
export const getSubmittingCommunityPostsSuccess = (state: State ) => state.submittedPost;

export const getGettingCommunityPosts = (state: State) => state.loading;
export const getGettingCommunityPostsError = (state: State) => state.loadingError;
export const getCommunityPosts = (state: State) => state.entities;
