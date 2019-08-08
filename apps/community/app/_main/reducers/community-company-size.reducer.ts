import * as communityCompanySizeActions from '../actions/community-company-size.actions';
import { CommunityCompanySize } from 'libs/models/community/community-company-size.model';

export interface State {
  loading: boolean;
  loadingError: boolean;
  entities: CommunityCompanySize[];
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  entities: []
};

export function reducer(state = initialState, action: communityCompanySizeActions.Actions): State {
  switch (action.type) {
    case communityCompanySizeActions.LOADING_COMMUNITY_COMPANY_SIZES: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        entities: []
      };
    }
    case communityCompanySizeActions.LOADING_COMMUNITY_COMPANY_SIZES_SUCCESS: {
      return {
        ...state,
        loading: false,
        entities: action.payload
      };
    }
    case communityCompanySizeActions.LOADING_COMMUNITY_COMPANY_SIZES_ERROR: {
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

export const getLoadingCommunityCompanySizes = (state: State) => state.loading;
export const getLoadingCommunityCompanySizesError = (state: State) => state.loadingError;
export const getCommunityCompanySizes = (state: State ) => state.entities;
