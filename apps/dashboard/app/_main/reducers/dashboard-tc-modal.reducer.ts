import { TermsConditionsModel, TermsConditionsSubmissionModel } from 'libs/models';

import * as fromDashboardTCModalActions from '../actions/dashboard-tc-modal.actions';

export interface State {
  loading: boolean;
  loadingError: boolean;
  submitting: boolean;
  submittingError: boolean;
  tcData: any;
  hasTCData: boolean;
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  submitting: false,
  submittingError: false,
  tcData: null,
  hasTCData: false
};

export function reducer(state = initialState, action: fromDashboardTCModalActions.Actions): State {
  switch (action.type) {
    case fromDashboardTCModalActions.LOADING_TC: {
      return {
        ...state,
        loading: true,
      };
    }
    case fromDashboardTCModalActions.LOADING_TC_SUCCESS: {
      return {
        ...state,
        loading: false,
        tcData: action.payload,
        hasTCData: action.payload != null
      };
    }
    case fromDashboardTCModalActions.LOADING_TC_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromDashboardTCModalActions.SUBMITTING_TC: {
      return {
        ...state,
        submitting: true
      };
    }
    case fromDashboardTCModalActions.SUBMITTING_TC_SUCCESS: {
      return {
        ...state,
        submitting: false
      };
    }
    case fromDashboardTCModalActions.SUBMITTING_TC_ERROR: {
      return {
        ...state,
        submitting: false,
        submittingError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTCData = (state: State) => state.tcData;
export const hasTCData = (state: State) => state.hasTCData;

