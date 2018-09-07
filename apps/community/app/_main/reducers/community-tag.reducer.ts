import * as communityTagActions from '../actions/community-tag.actions';
import { CommunityTag } from 'libs/models/community/community-tag.model';

export interface State {
  loading: boolean;
  loadingError: boolean;
  popularTags: CommunityTag[];
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  popularTags: []
};

export function reducer(state = initialState, action: communityTagActions.Actions): State {
  switch (action.type) {
    case communityTagActions.LOADING_COMMUNITY_POPULAR_TAGS: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        popularTags: []
      };
    }
    case communityTagActions.LOADING_COMMUNITY_POPULAR_TAGS_SUCCESS: {
      return {
        ...state,
        loading: false,
        popularTags: action.payload
      };
    }
    case communityTagActions.LOADING_COMMUNITY_POPULAR_TAGS_ERROR: {
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

export const getLoadingCommunityPopularTags = (state: State) => state.loading;
export const getLoadingCommunityPopularTagsError = (state: State) => state.loadingError;
export const getCommunityPopularTags = (state: State) => state.popularTags;
