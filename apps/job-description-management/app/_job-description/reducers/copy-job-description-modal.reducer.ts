import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';

import * as fromCopyJobDescriptionModalActions from '../actions/copy-job-description-modal.actions';
import { JobDescriptionSource } from 'libs/features/jobs/job-description-management';

export interface State {
  jobDescriptionSourcesAsync: AsyncStateObj<JobDescriptionSource[]>;
}

export const initialState: State = {
  jobDescriptionSourcesAsync: generateDefaultAsyncStateObj<JobDescriptionSource[]>(null)
};

export function reducer(state = initialState, action: fromCopyJobDescriptionModalActions.Actions): State {
  switch (action.type) {
    case fromCopyJobDescriptionModalActions.GET_JOB_DESCRIPTION_SOURCES: {
      const asyncObjClone: AsyncStateObj<JobDescriptionSource[]> = cloneDeep(state.jobDescriptionSourcesAsync);
      asyncObjClone.loading = true;
      asyncObjClone.loadingError = false;

      return {
        ...state,
        jobDescriptionSourcesAsync: asyncObjClone
      };
    }
    case fromCopyJobDescriptionModalActions.GET_JOB_DESCRIPTION_SOURCES_SUCCESS: {
      const asyncObjClone: AsyncStateObj<JobDescriptionSource[]> = cloneDeep(state.jobDescriptionSourcesAsync);
      asyncObjClone.loading = false;
      asyncObjClone.loadingError = false;
      asyncObjClone.obj = action.payload;

      return {
        ...state,
        jobDescriptionSourcesAsync: asyncObjClone
      };
    }
    case fromCopyJobDescriptionModalActions.GET_JOB_DESCRIPTION_SOURCES_ERROR: {
      const asyncObjClone: AsyncStateObj<JobDescriptionSource[]> = cloneDeep(state.jobDescriptionSourcesAsync);
      asyncObjClone.loading = false;
      asyncObjClone.loadingError = true;

      return {
        ...state,
        jobDescriptionSourcesAsync: asyncObjClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getJobDescriptionSourcesAsync = (state: State) => state.jobDescriptionSourcesAsync;
