import * as fromJobDescriptionActions from '../actions';
import { JobDescriptionSummary, AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';

export interface State {
  jobId: number;
  updatedJobDescription: string;
  jobDescriptionSummary: AsyncStateObj<JobDescriptionSummary>;
}

export const initialState: State = {
  jobId: null,
  updatedJobDescription: null,
  jobDescriptionSummary: generateDefaultAsyncStateObj<JobDescriptionSummary>(null),
};

export function reducer(state = initialState, action: fromJobDescriptionActions.JobDescriptionActions): State {
  switch (action.type) {
    case fromJobDescriptionActions.LOAD_JOB_DESCRIPTION: {
      return {
        ...AsyncStateObjHelper.loading(state, 'jobDescriptionSummary'),
        jobId: action.payload
      };
    }
    case fromJobDescriptionActions.LOAD_JOB_DESCRIPTION_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'jobDescriptionSummary', action.payload);
    }
    case fromJobDescriptionActions.CHANGE_JOB_DESCRIPTION: {
      return {
        ...state,
        updatedJobDescription: action.payload,
        jobDescriptionSummary: {
          ...state.jobDescriptionSummary,
          savingSuccess: false,
          loadingError: false,
          savingError: false
        }
      };
    }
    case fromJobDescriptionActions.SAVE_JOB_DESCRIPTION: {
      return AsyncStateObjHelper.saving(state, 'jobDescriptionSummary');
    }
    case fromJobDescriptionActions.SAVE_JOB_DESCRIPTION_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'jobDescriptionSummary');
    }
    case fromJobDescriptionActions.SAVE_JOB_DESCRIPTION_SUCCESS: {
      return AsyncStateObjHelper.savingError(state, 'jobDescriptionSummary');
    }
    default: {
      return state;
    }
  }
}

export const getJobId = (state: State) => state.jobId;
export const getLoading = (state: State) => {
  return state.jobDescriptionSummary.loading || state.jobDescriptionSummary.saving;
};
export const getJobDescriptionSummary = (state: State) => state.jobDescriptionSummary;
export const getUpdatedJobDescription = (state: State) => state.updatedJobDescription;


