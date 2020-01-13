import * as fromJobsPageActions from '../actions';

export interface State {
  company: string;
  loading: boolean;
  loadingError: boolean;
  addingToProject: boolean;
  pricingIdToBeDeleted: number;
}

export const initialState: State = {
  company: '',
  loading: false,
  loadingError: false,
  addingToProject : false,
  pricingIdToBeDeleted: undefined
};

export function reducer(state = initialState, action: fromJobsPageActions.JobsPageActions): State {
  switch (action.type) {
    case fromJobsPageActions.LOAD_COMPANY: {
      return {
        ...state,
        loading: true,
        loadingError: false,
      };
    }
    case fromJobsPageActions.LOAD_COMPANY_SUCCESS: {
      return {
        ...state,
        company: action.payload,
        loading: false,
        loadingError: false,
      };
    }
    case fromJobsPageActions.ADD_JOBS_TO_PROJECT: {
      return {
        ...state,
        addingToProject: true
      };
    }
    case fromJobsPageActions.HANDLE_API_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromJobsPageActions.CONFIRM_DELETE_PRICING_FROM_GRID: {
      return {
        ...state,
        pricingIdToBeDeleted: action.payload.CompanyJobPricingId
      };
    }
    case fromJobsPageActions.CANCEL_DELETE_PRICING:
    case fromJobsPageActions.DELETE_PRICING_SUCCESS: {
      return {
        ...state,
        pricingIdToBeDeleted: undefined
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompany = (state: State) => state.company;
export const getloading = (state: State) => state.loading;
export const getloadingError = (state: State) => state.loadingError;
export const getToProjectButtonState = (state: State) => state.addingToProject;
export const getPricingIdToBeDeleted = (state: State) => state.pricingIdToBeDeleted;

