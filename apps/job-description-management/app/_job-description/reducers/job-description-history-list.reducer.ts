import * as cloneDeep from 'lodash.clonedeep';

import * as fromJobDescriptionHistoryListActions from '../actions/job-description-history-list.actions';
import { JobDescriptionHistoryListItem } from '../models/job-description-history-list-item.model';

export interface State {
  jobDescriptionHistoryList: JobDescriptionHistoryListItem[];
  loadingJobDescriptionHistoryList: boolean;
  loadingJobDescriptionHistoryListError: boolean;
}

export const initialState: State = {
  jobDescriptionHistoryList: [],
  loadingJobDescriptionHistoryList: false,
  loadingJobDescriptionHistoryListError: false
};

export function reducer(state = initialState, action: fromJobDescriptionHistoryListActions.Actions): State {
  switch (action.type) {
    case fromJobDescriptionHistoryListActions.LOAD_JOB_DESCRIPTION_HISTORY_LIST_ITEMS:
      return {
        ...state,
        loadingJobDescriptionHistoryList: true
      };
    case fromJobDescriptionHistoryListActions.LOAD_JOB_DESCRIPTION_HISTORY_LIST_ITEMS_ERROR:
      return {
        ...state,
        loadingJobDescriptionHistoryList: false,
        loadingJobDescriptionHistoryListError: true
      };
    case fromJobDescriptionHistoryListActions.LOAD_JOB_DESCRIPTION_HISTORY_LIST_ITEMS_SUCCESS:
      return {
        ...state,
        loadingJobDescriptionHistoryList: false,
        jobDescriptionHistoryList: cloneDeep(action.payload)
      };
    default:
      return state;
  }
}

export const getJobDescriptionHistoryList = (state: State) => state.jobDescriptionHistoryList;
export const getJobDescriptionHistoryListLoading = (state: State) => state.loadingJobDescriptionHistoryList;
export const getJobDescriptionHistoryListLoadingError = (state: State) => state.loadingJobDescriptionHistoryListError;
