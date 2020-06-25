import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromJobMatchesActions from '../actions/job-matches.actions';
import { JobMatchResult } from 'libs/features/job-description-management';

export interface State {
  jobMatchesAsync: AsyncStateObj<JobMatchResult[]>;
  forbidden: boolean;
  creatingProject: boolean;
  creatingProjectError: boolean;
}

export const initialState: State = {
  jobMatchesAsync: generateDefaultAsyncStateObj<JobMatchResult[]>(null),
  forbidden: false,
  creatingProject: false,
  creatingProjectError: false
};

export function reducer(state = initialState, action: fromJobMatchesActions.Actions): State {
  switch (action.type) {
    case fromJobMatchesActions.GET_JOB_MATCHES: {
      const jobMatchesAsyncClone = cloneDeep(state.jobMatchesAsync);
      jobMatchesAsyncClone.loading = true;
      jobMatchesAsyncClone.error = false;

      return {
        ...state,
        jobMatchesAsync: jobMatchesAsyncClone,
        forbidden: false
      };
    }
    case fromJobMatchesActions.GET_JOB_MATCHES_SUCCESS: {
      const jobMatchesAsyncClone = cloneDeep(state.jobMatchesAsync);
      jobMatchesAsyncClone.loading = false;
      jobMatchesAsyncClone.obj = action.payload;

      return {
        ...state,
        jobMatchesAsync: jobMatchesAsyncClone
      };
    }
    case fromJobMatchesActions.GET_JOB_MATCHES_ERROR: {
      const jobMatchesAsyncClone = cloneDeep(state.jobMatchesAsync);
      jobMatchesAsyncClone.loading = false;
      jobMatchesAsyncClone.error = true;

      return {
        ...state,
        jobMatchesAsync: jobMatchesAsyncClone
      };
    }
    case fromJobMatchesActions.GET_JOB_MATCHES_FORBIDDEN: {
      const jobMatchesAsyncClone = cloneDeep(state.jobMatchesAsync);
      jobMatchesAsyncClone.loading = false;
      jobMatchesAsyncClone.error = false;

      return {
        ...state,
        jobMatchesAsync: jobMatchesAsyncClone,
        forbidden: true
      };
    }
    case fromJobMatchesActions.TOGGLE_JOB_MATCH_SELECTED: {
      const jobMatchesAsyncClone: AsyncStateObj<JobMatchResult[]> = cloneDeep(state.jobMatchesAsync);
      const selectedJob = jobMatchesAsyncClone.obj.find(j => j.Id === action.payload.jobMatchResultId);
      selectedJob.Selected = !selectedJob.Selected;

      return {
        ...state,
        jobMatchesAsync: jobMatchesAsyncClone
      };
    }
    case fromJobMatchesActions.RESET_JOB_MATCHES: {
      const jobMatchesAsyncClone = cloneDeep(state.jobMatchesAsync);
      jobMatchesAsyncClone.loading = false;
      jobMatchesAsyncClone.error = false;
      jobMatchesAsyncClone.obj = null;

      return {
        ...state,
        jobMatchesAsync: jobMatchesAsyncClone
      };
    }
    case fromJobMatchesActions.CREATE_PROJECT: {
      return {
        ...state,
        creatingProject: true,
        creatingProjectError: false
      };
    }
    case fromJobMatchesActions.CREATE_PROJECT_ERROR: {
      return {
        ...state,
        creatingProject: false,
        creatingProjectError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getJobMatchesAsync = (state: State) => state.jobMatchesAsync;
export const getJobMatchesForbidden = (state: State) => state.forbidden;
export const getCreatingProject = (state: State) => state.creatingProject;
export const getCreatingProjectError = (state: State) => state.creatingProjectError;
