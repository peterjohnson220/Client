import * as fromJobsPageActions from '../actions';

export interface State {
  company: string;
  loading: boolean;
  loadingError: boolean;
  addingToProject: boolean;
}

export const initialState: State = {
  company: '',
  loading: false,
  loadingError: false,
  addingToProject : false
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
    default: {
      return state;
    }
  }
}

export const getCompany = (state: State) => state.company;
export const getloading = (state: State) => state.loading;
export const getloadingError = (state: State) => state.loadingError;
export const getToProjectButtonState = (state: State) => state.addingToProject;

