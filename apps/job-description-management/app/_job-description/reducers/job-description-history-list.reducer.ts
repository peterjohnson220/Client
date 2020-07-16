import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromJobDescriptionHistoryListActions from '../actions/job-description-history-list.actions';
import { JobDescriptionHistoryListItem } from 'libs/features/job-description-management';

export interface State {
  jobDescriptionHistoryListAsync: AsyncStateObj<JobDescriptionHistoryListItem[]>;
}

export const initialState: State = {
  jobDescriptionHistoryListAsync: generateDefaultAsyncStateObj<JobDescriptionHistoryListItem[]>([])
};

export function reducer(state = initialState, action: fromJobDescriptionHistoryListActions.Actions): State {
  switch (action.type) {
    case fromJobDescriptionHistoryListActions.LOAD_JOB_DESCRIPTION_HISTORY_LIST_ITEMS: {
      const jobDescriptionHistoryListAsyncClone = cloneDeep(state.jobDescriptionHistoryListAsync);
      jobDescriptionHistoryListAsyncClone.loading = true;
      jobDescriptionHistoryListAsyncClone.loadingError = false;
      return {
        ...state,
        jobDescriptionHistoryListAsync: jobDescriptionHistoryListAsyncClone
      };
    }
    case fromJobDescriptionHistoryListActions.LOAD_JOB_DESCRIPTION_HISTORY_LIST_ITEMS_ERROR: {
      const jobDescriptionHistoryListAsyncClone = cloneDeep(state.jobDescriptionHistoryListAsync);
      jobDescriptionHistoryListAsyncClone.loading = false;
      jobDescriptionHistoryListAsyncClone.loadingError = true;
      return {
        ...state,
        jobDescriptionHistoryListAsync: jobDescriptionHistoryListAsyncClone
      };
    }
    case fromJobDescriptionHistoryListActions.LOAD_JOB_DESCRIPTION_HISTORY_LIST_ITEMS_SUCCESS: {
      const jobDescriptionHistoryListAsyncClone = cloneDeep(state.jobDescriptionHistoryListAsync);
      jobDescriptionHistoryListAsyncClone.loading = false;
      jobDescriptionHistoryListAsyncClone.obj = action.payload;
      return {
        ...state,
        jobDescriptionHistoryListAsync: jobDescriptionHistoryListAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getJobDescriptionHistoryList = (state: State) => state.jobDescriptionHistoryListAsync;
