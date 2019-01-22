import * as communityLikeActions from '../actions/community-like.actions';
import { CommunityUserInfo } from 'libs/models';

export interface State {
  loading: boolean;
  loadingError: boolean;
  likes: CommunityUserInfo[];
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  likes: []
};

export function reducer(state = initialState, action: communityLikeActions.Actions): State {
    switch (action.type) {
      case communityLikeActions.LOADING_COMMUNITY_LIKES: {
        return {
          ...state,
          loading: true,
          loadingError: false,
          likes: []
        };
      }
      case communityLikeActions.LOADING_COMMUNITY_LIKES_SUCCESS: {
        return {
          ...state,
          loading: false,
          likes: action.payload
        };
      }
      case communityLikeActions.LOADING_COMMUNITY_LIKES_ERROR: {
        return {
          ...state,
          loading: false,
          loadingError: true
        };
      }
      default: {
        return state;
      }
    }
  }

export const getLoadingCommunityLikes = (state: State) => state.loading;
export const getLoadingCommunityLikesError = (state: State) => state.loadingError;
export const getLoadingCommunityLikesSuccess = (state: State ) => state.likes;
