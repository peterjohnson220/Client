import * as communityTagActions from '../actions/community-tag.actions';
import { CommunityTag } from 'libs/models/community/community-tag.model';

export interface State {
  loading: boolean;
  loadingError: boolean;
  trendingTags: CommunityTag[];
  suggesting: boolean;
  suggestingError: boolean;
  entities: CommunityTag[];
  postId: string;
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  trendingTags: [],
  suggesting: false,
  suggestingError: false,
  entities: [],
  postId: ''
};

export function reducer(state = initialState, action: communityTagActions.Actions): State {
  switch (action.type) {
    case communityTagActions.LOADING_COMMUNITY_TRENDING_TAGS: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        trendingTags: []
      };
    }
    case communityTagActions.LOADING_COMMUNITY_TRENDING_TAGS_SUCCESS: {
      return {
        ...state,
        loading: false,
        trendingTags: action.payload
      };
    }
    case communityTagActions.LOADING_COMMUNITY_TRENDING_TAGS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case communityTagActions.SUGGESTING_COMMUNITY_TAGS: {
      return {
        ...state,
        suggesting: true,
        suggestingError: false,
        postId: action.payload.postId
      };
    }
    case communityTagActions.SUGGESTING_COMMUNITY_TAGS_SUCCESS: {
      return {
        ...state,
        suggesting: false,
        entities: action.payload
      };
    }
    case communityTagActions.SUGGESTING_COMMUNITY_TAGS_ERROR: {
      return {
        ...state,
        suggesting: false,
        suggestingError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingCommunityTrendingTags = (state: State) => state.loading;
export const getLoadingCommunityTrendingTagsError = (state: State) => state.loadingError;
export const getCommunityTrendingTags = (state: State) => state.trendingTags;
export const getSuggestingCommunityTags = (state: State) => state.suggesting;
export const getSuggestingCommunityTagsError = (state: State) => state.suggestingError;
export const getCommunityTags = (state: State) => state.entities;
export const getCommunityTagsPostId = (state: State) => state.postId;
