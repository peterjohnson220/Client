import * as communityIndustryActions from '../actions/community-industry.actions';
import { CommunityIndustry } from 'libs/models/community/community-industry.model';

export interface State {
  loading: boolean;
  loadingError: boolean;
  entities: CommunityIndustry[];
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  entities: []
};

export function reducer(state = initialState, action: communityIndustryActions.Actions): State {
  switch (action.type) {
    case communityIndustryActions.LOADING_COMMUNITY_INDUSTRIES: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        entities: []
      };
    }
    case communityIndustryActions.LOADING_COMMUNITY_INDUSTRIES_SUCCESS: {
      return {
        ...state,
        loading: false,
        entities: action.payload
      };
    }
    case communityIndustryActions.LOADING_COMMUNITY_INDUSTRIES_ERROR: {
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

export const getLoadingCommunityIndustries = (state: State) => state.loading;
export const getLoadingCommunityIndustriesError = (state: State) => state.loadingError;
export const getCommunityIndustries = (state: State ) => state.entities;
