import * as fromJobDescriptionVersionCompareActions from '../actions/job-description-version-compare.actions';
import { JobDescriptionHistoryListItem } from 'libs/features/job-description-management';

export interface State {
  historyList: JobDescriptionHistoryListItem[];
  sourceHistoryListItem: JobDescriptionHistoryListItem;
  comparisonHistoryListItem: JobDescriptionHistoryListItem;
  loadingJobDescriptionComparison: boolean;
  jobDescriptionComparison: any;
  loadingJobDescriptionComparisonError: boolean;
}

export const initialState: State = {
  historyList: [],
  sourceHistoryListItem: null,
  comparisonHistoryListItem: null,
  loadingJobDescriptionComparison: false,
  jobDescriptionComparison: null,
  loadingJobDescriptionComparisonError: false
};

export function reducer (state = initialState, action: fromJobDescriptionVersionCompareActions.Actions): State {
  switch (action.type) {
    case fromJobDescriptionVersionCompareActions.LOAD_JOB_DESCRIPTION_COMPARISON:
      return {
        ...state,
        loadingJobDescriptionComparison: true,
        loadingJobDescriptionComparisonError: false
      };
    case fromJobDescriptionVersionCompareActions.LOAD_JOB_DESCRIPTION_COMPARISON_SUCCESS:
      return {
        ...state,
        loadingJobDescriptionComparison: false,
        jobDescriptionComparison: action.payload
      };
    case fromJobDescriptionVersionCompareActions.LOAD_JOB_DESCRIPTION_COMPARISON_ERROR:
      return {
        ...state,
        loadingJobDescriptionComparison: false,
        loadingJobDescriptionComparisonError: true
      };
    case fromJobDescriptionVersionCompareActions.LOAD_JOB_DESCRIPTION_HISTORY_LIST_SUCCESS:
      return {
        ...state,
        historyList: action.payload.historyList,
        sourceHistoryListItem: action.payload.historyList.find(h => h.VersionNumber === action.payload.sourceVersion),
        comparisonHistoryListItem: action.payload.historyList.find(h => h.VersionNumber === action.payload.compareVersion)
      };
    case fromJobDescriptionVersionCompareActions.SET_SELECTED_SOURCE_HISTORY_LIST_ITEM:
      return {
        ...state,
        sourceHistoryListItem: action.payload
      };
    case fromJobDescriptionVersionCompareActions.SET_SELECTED_COMPARISON_HISTORY_LIST_ITEM:
      return {
        ...state,
        comparisonHistoryListItem: action.payload
      };
    default:
      return state;
  }
}

export const getJobDescriptionHistoryList = (state: State) => state;
export const getSourceHistoryListItem = (state: State) => state.sourceHistoryListItem;
export const getComparisonHistoryListItem = (state: State) => state.comparisonHistoryListItem;
export const getJobDescriptionComparisonLoading = (state: State) => state.loadingJobDescriptionComparison;
export const getJobDescriptionComparisonLoadingError =
  (state: State) => state.loadingJobDescriptionComparisonError;
export const getJobDescriptionComparison = (state: State) => state.jobDescriptionComparison;


