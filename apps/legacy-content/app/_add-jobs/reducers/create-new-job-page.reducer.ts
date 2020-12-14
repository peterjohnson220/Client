import * as fromCreateNewJobPageActions from '../actions/create-new-job-page.actions';

export interface State {
  jdmEnabled: boolean;
  loadingJobFamilies: boolean;
  jobFamilies: string[];
  creatingJob: boolean;
  creatingJobError: boolean;
  jobCodeExists: boolean;
}

const initialState: State = {
  jdmEnabled: false,
  loadingJobFamilies: false,
  jobFamilies: [],
  creatingJob: false,
  creatingJobError: false,
  jobCodeExists: false
};

// Reducer function
export function reducer(state = initialState, action: fromCreateNewJobPageActions.Actions): State {
  switch (action.type) {

    case fromCreateNewJobPageActions.GET_JDM_STATUS: {
      return {
        ...state,
        jdmEnabled: false
      };
    }
    case fromCreateNewJobPageActions.GET_JDM_STATUS_SUCCESS: {
      return {
        ...state,
        jdmEnabled: action.payload
      };
    }
    case fromCreateNewJobPageActions.GET_JDM_STATUS_ERROR: {
      return {
        ...state,
        jdmEnabled: false
      };
    }
    case fromCreateNewJobPageActions.GET_JOB_FAMILIES: {
      return {
        ...state,
        loadingJobFamilies: true
      };
    }
    case fromCreateNewJobPageActions.GET_JOB_FAMILIES_SUCCESS: {
      return {
        ...state,
        jobFamilies: action.payload,
        loadingJobFamilies: false
      };
    }
    case fromCreateNewJobPageActions.GET_JOB_FAMILIES_ERROR: {
      return {
        ...state,
        loadingJobFamilies: false
      };
    }
    case fromCreateNewJobPageActions.CREATE_JOB: {
      return {
        ...state,
        creatingJob: true,
        creatingJobError: false
      };
    }
    case fromCreateNewJobPageActions.CREATE_JOB_ERROR: {
      return {
        ...state,
        creatingJobError: true,
        creatingJob: false
      };
    }
    case fromCreateNewJobPageActions.RESET: {
      return {
        ...initialState
      };
    }
    case fromCreateNewJobPageActions.JOB_CODE_EXISTS_ERROR: {
      return {
        ...state,
        creatingJob: false,
        jobCodeExists: true
      };
    }
    case fromCreateNewJobPageActions.CLEAR_JOB_CODE_EXISTS_ERROR: {
      return {
        ...state,
        jobCodeExists: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getJdmEnabled = (state: State) => state.jdmEnabled;
export const getLoadingJobFamilies = (state: State) => state.loadingJobFamilies;
export const getJobFamilies = (state: State) => state.jobFamilies;
export const getCreatingJob = (state: State) => state.creatingJob;
export const getCreatingJobError = (state: State) => state.creatingJobError;
export const getJobCodeExits = (state: State) => state.jobCodeExists;
