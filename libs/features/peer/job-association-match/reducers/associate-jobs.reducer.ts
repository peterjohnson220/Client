import * as fromAssociateJobActions from '../actions/associate-jobs.actions';

export interface State {
  loading: boolean;
  loadingError: boolean;
}

export const initialState: State = {
  loading: false,
  loadingError: false
};

export function reducer(state = initialState, action: fromAssociateJobActions.Actions): State {
  switch (action.type) {
    case fromAssociateJobActions.DOWNLOAD_ASSOCIATIONS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromAssociateJobActions.DOWNLOAD_ASSOCIATIONS_SUCCESS: {
      return {
        ...state,
        loading: false
      };
    }
    case fromAssociateJobActions.DOWNLOAD_ASSOCIATIONS_ERROR: {
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

export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
