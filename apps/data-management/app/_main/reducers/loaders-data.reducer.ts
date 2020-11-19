import { CompositeDataLoadViewResponse } from 'libs/models';

import * as fromLoadersDataActions from '../actions/loaders-data.actions';

export interface State {
  latestOrgDataLoad: CompositeDataLoadViewResponse;
  latestOrgDataLoadModalOpen: boolean;
}

export const initialState: State = {
    latestOrgDataLoad: null,
    latestOrgDataLoadModalOpen: false,
};

export function reducer(state = initialState, action: fromLoadersDataActions.Actions): State {
  switch (action.type) {
    case fromLoadersDataActions.GET_LATEST_ORG_DATA_LOAD_SUCCESS: {
      return {
        ...state,
        latestOrgDataLoad: action.payload,
      };
    }
    case fromLoadersDataActions.OPEN_LATEST_ORG_DATA_LOAD_MODAL: {
      return {
        ...state,
        latestOrgDataLoadModalOpen: true
      };
    }
    case fromLoadersDataActions.CLOSE_LATEST_ORG_DATA_LOAD_MODAL: {
      return {
        ...state,
        latestOrgDataLoadModalOpen: false
      };
    }
    default:
      return state;
  }
}

export const getLatestOrgDataLoad = (state: State) => state.latestOrgDataLoad;
export const getLatestOrgDataLoadModalOpen = (state: State) => state.latestOrgDataLoadModalOpen;
