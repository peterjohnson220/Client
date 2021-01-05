import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromJobDescriptionLibraryActions from '../actions/job-description-library.actions';
import { JobDescriptionLibraryBucket, JobDescriptionLibraryResult } from '../models';

export interface State {
  bucketsAsync: AsyncStateObj<JobDescriptionLibraryBucket[]>;
  resultsAsync: AsyncStateObj<JobDescriptionLibraryResult[]>;
}

export const initialState: State = {
  bucketsAsync: generateDefaultAsyncStateObj<JobDescriptionLibraryBucket[]>([]),
  resultsAsync: generateDefaultAsyncStateObj<JobDescriptionLibraryResult[]>([])
};

export function reducer(state = initialState, action: fromJobDescriptionLibraryActions.Actions): State {
  switch (action.type) {
    case fromJobDescriptionLibraryActions.LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_BY_BUCKET: {
      const bucketsAsyncClone = cloneDeep(state.bucketsAsync);

      bucketsAsyncClone.loading = true;
      bucketsAsyncClone.loadingError = false;

      return {
        ...state,
        bucketsAsync: bucketsAsyncClone
      };
    }
    case fromJobDescriptionLibraryActions.LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_BY_BUCKET_SUCCESS: {
      const bucketsAsyncClone = cloneDeep(state.bucketsAsync);
      const resultsAsyncClone = cloneDeep(state.resultsAsync);
      const {buckets, selectedBucket} = action.payload;

      bucketsAsyncClone.loading = false;
      bucketsAsyncClone.obj = action.payload.buckets;

      resultsAsyncClone.obj = selectedBucket ? buckets.find(b => b.Key === selectedBucket).Results : buckets[0].Results;

      return {
        ...state,
        bucketsAsync: bucketsAsyncClone,
        resultsAsync: resultsAsyncClone
      };
    }
    case fromJobDescriptionLibraryActions.LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_BY_BUCKET_ERROR: {
      const bucketsAsyncClone = cloneDeep(state.bucketsAsync);

      bucketsAsyncClone.loading = false;
      bucketsAsyncClone.loadingError = true;

      return {
        ...state,
        bucketsAsync: bucketsAsyncClone
      };
    } case fromJobDescriptionLibraryActions.LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS: {
      const resultsAsyncClone = cloneDeep(state.resultsAsync);

      resultsAsyncClone.loading = true;
      resultsAsyncClone.loadingError = false;

      return {
        ...state,
        resultsAsync: resultsAsyncClone
      };
    }
    case fromJobDescriptionLibraryActions.LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_SUCCESS: {
      const resultsAsyncClone = cloneDeep(state.resultsAsync);

      resultsAsyncClone.loading = false;
      resultsAsyncClone.obj = action.payload;

      return {
        ...state,
        resultsAsync: resultsAsyncClone
      };
    }
    case fromJobDescriptionLibraryActions.LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_ERROR: {
      const resultsAsyncClone = cloneDeep(state.resultsAsync);

      resultsAsyncClone.loading = false;
      resultsAsyncClone.loadingError = true;

      return {
        ...state,
        resultsAsync: resultsAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getBucketsAsync = (state: State) => state.bucketsAsync;
export const getResultsAsync = (state: State) => state.resultsAsync;
export const getLoadJobDescriptionLibraryError = (state: State) => state.bucketsAsync.loadingError || state.resultsAsync.loadingError;
