import * as fromExchangeDashboardTCModalActions from '../actions/exchange-dashboard-tc-modal.actions';

export interface State {
  loading: boolean;
  loadingError: boolean;
  submitting: boolean;
  submittingError: boolean;
  submittingSuccess: boolean;
  tcData: any;
  hasTCData: boolean;
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  submitting: false,
  submittingError: false,
  submittingSuccess: false,
  tcData: null,
  hasTCData: false
};

export function reducer(state = initialState, action: fromExchangeDashboardTCModalActions.Actions): State {
  switch (action.type) {
    case fromExchangeDashboardTCModalActions.LOAD_TC: {
      return {
        ...state,
        loading: true,
      };
    }
    case fromExchangeDashboardTCModalActions.LOAD_TC_SUCCESS: {
      return {
        ...state,
        loading: false,
        tcData: action.payload,
        hasTCData: action.payload != null
      };
    }
    case fromExchangeDashboardTCModalActions.LOAD_TC_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromExchangeDashboardTCModalActions.SUBMIT_TC: {
      return {
        ...state,
        submitting: true
      };
    }
    case fromExchangeDashboardTCModalActions.SUBMIT_TC_SUCCESS: {
      return {
        ...state,
        submitting: false,
        submittingSuccess: true
      };
    }
    case fromExchangeDashboardTCModalActions.SUBMIT_TC_ERROR: {
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

export const getTCLoading = (state: State) => state.loading;
export const getTCLoadingError = (state: State) => state.loadingError;

export const getTCSubmitting = (state: State) => state.submitting;
export const getTCSubmittingError = (state: State) => state.submittingError;
export const getTCSubmittingSuccess = (state: State) => state.submittingSuccess;

export const getTCData = (state: State) => state.tcData;
export const hasTCData = (state: State) => state.hasTCData;

