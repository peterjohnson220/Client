import * as fromJobDescriptionActions from '../actions';

export interface State {
  jobId: number;
  jobDescriptionManagementEnabled: boolean;
  jobDescription: string;
  updatedJobDescription: string;
  saving: boolean;
  jobDescriptionLoaded: boolean;
}

export const initialState: State = {
  jobId: null,
  jobDescriptionManagementEnabled: true,
  jobDescription: null,
  updatedJobDescription: null,
  saving: false,
  jobDescriptionLoaded: false
};

export function reducer(state = initialState, action: fromJobDescriptionActions.JobDescriptionActions): State {
  switch (action.type) {
    case fromJobDescriptionActions.LOAD_JOB_DESCRIPTION_SUCCESS: {
      return {
        ...state,
        jobDescriptionManagementEnabled: action.payload.JobDescriptionManagementEnabled,
        jobDescription: action.payload.JobSummary,
        updatedJobDescription: action.payload.JobSummary,
        jobDescriptionLoaded: true,
      };
    }
    case fromJobDescriptionActions.CHANGE_JOB_DESCRIPTION: {
      return {
        ...state,
        updatedJobDescription: action.payload
      };
    }
    case fromJobDescriptionActions.LOAD_JOB_DESCRIPTION: {
      return {
        ...state,
        jobDescriptionLoaded: false,
      };
    }
    case fromJobDescriptionActions.SAVE_JOB_DESCRIPTION_SUCCESS: {
      return {
        ...state,
        jobDescription: state.updatedJobDescription,
        saving: false,
      };
    }
    case fromJobDescriptionActions.SAVE_JOB_DESCRIPTION: {
      return {
        ...state,
        saving: true,
      };
    }
    default: {
      return state;
    }
  }
}

export const getJobDescriptionManagementEnabled = (state: State) => state.jobDescriptionManagementEnabled;
export const getJobDescription = (state: State) => state.jobDescription;
export const getJobDescriptionUpdated = (state: State) => state.jobDescription !== state.updatedJobDescription;
export const getSavingState = (state: State) => state.saving;
export const getJobDescriptionLoaded = (state: State) => state.jobDescriptionLoaded;




