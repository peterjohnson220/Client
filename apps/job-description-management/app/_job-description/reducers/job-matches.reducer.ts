import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromJobMatchesActions from '../actions/job-matches.actions';
import { JobMatchResult } from '../models';

export interface State {
  jobMatchesAsync: AsyncStateObj<JobMatchResult[]>;
}

export const initialState: State = {
  jobMatchesAsync: generateDefaultAsyncStateObj<JobMatchResult[]>([])
};

export function reducer(state = initialState, action: fromJobMatchesActions.Actions): State {
  switch (action.type) {
    case fromJobMatchesActions.GET_JOB_MATCHES: {
      const jobMatchesAsyncClone = cloneDeep(state.jobMatchesAsync);
      jobMatchesAsyncClone.loading = true;
      jobMatchesAsyncClone.error = false;

      return {
        ...state,
        jobMatchesAsync: jobMatchesAsyncClone
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
    default: {
      return state;
    }
  }
}

export const getJobMatchesAsync = (state: State) => state.jobMatchesAsync;
