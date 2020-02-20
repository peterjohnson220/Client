import * as fromJobDescriptionWorkflowCompareActions from '../actions/job-description-workflow-compare.actions';
import { JobDescriptionWorkflowCompareListItem } from '../models/';

export interface State {
  compareList: JobDescriptionWorkflowCompareListItem[];
  compareListError: boolean;
  compareListLoading: boolean;
  sourceCompareItem: JobDescriptionWorkflowCompareListItem;
  comparisonCompareItem: JobDescriptionWorkflowCompareListItem;
  loadingJobDescriptionComparison: boolean;
  jobDescriptionComparison: any;
  loadingJobDescriptionComparisonError: boolean;
}

export const initialState: State = {
  compareList: [],
  compareListError: false,
  compareListLoading: false,
  sourceCompareItem: null,
  comparisonCompareItem: null,
  loadingJobDescriptionComparison: false,
  jobDescriptionComparison: null,
  loadingJobDescriptionComparisonError: false
};

export function reducer (state = initialState, action: fromJobDescriptionWorkflowCompareActions.Actions): State {
  switch (action.type) {
    case fromJobDescriptionWorkflowCompareActions.LOADING_JOB_DESCRIPTION_COMPARISON:
      return {
        ...state,
        loadingJobDescriptionComparison: true,
        loadingJobDescriptionComparisonError: false
      };
    case fromJobDescriptionWorkflowCompareActions.LOAD_JOB_DESCRIPTION_COMPARISON_SUCCESS:
      return {
        ...state,
        loadingJobDescriptionComparison: false,
        jobDescriptionComparison: action.payload
      };
    case fromJobDescriptionWorkflowCompareActions.LOAD_JOB_DESCRIPTION_COMPARISON_ERROR:
      return {
        ...state,
        loadingJobDescriptionComparison: false,
        loadingJobDescriptionComparisonError: true
      };
    case fromJobDescriptionWorkflowCompareActions.LOAD_COMPARE_LIST:
      return {
        ...state,
        compareList: null,
        sourceCompareItem: null,
        comparisonCompareItem: null,
        compareListError: false,
        compareListLoading: true
      };
    case fromJobDescriptionWorkflowCompareActions.LOAD_COMPARE_LIST_ERROR:
      return {
        ...state,
        compareList: null,
        sourceCompareItem: null,
        comparisonCompareItem: null,
        compareListError: true,
        compareListLoading: false
      };
    case fromJobDescriptionWorkflowCompareActions.LOAD_COMPARE_LIST_SUCCESS:
      return {
        ...state,
        compareList: action.payload,
        sourceCompareItem: action.payload[action.payload.length - 1],
        comparisonCompareItem: action.payload[action.payload.length - 2],
        compareListError: false,
        compareListLoading: false
      };
    case fromJobDescriptionWorkflowCompareActions.SET_SELECTED_SOURCE_COMPARE_LIST_ITEM:
      return {
        ...state,
        sourceCompareItem: action.payload
      };
    case fromJobDescriptionWorkflowCompareActions.SET_SELECTED_COMPARISON_COMPARE_LIST_ITEM:
      return {
        ...state,
        comparisonCompareItem: action.payload
      };
    default:
      return state;
  }
}

export const getJobDescriptionWorkflowList = (state: State) => state.compareList;
export const getSourceCompareItem = (state: State) => state.sourceCompareItem;
export const getComparisonCompareItem = (state: State) => state.comparisonCompareItem;
export const getJobDescriptionComparisonLoading = (state: State) => state.loadingJobDescriptionComparison;
export const getJobDescriptionComparisonLoadingError =
  (state: State) => state.loadingJobDescriptionComparisonError;
export const getJobDescriptionComparison = (state: State) => state.jobDescriptionComparison;
export const getCompareListError = (state: State) => state.compareListError;
export const getCompareListLoading = (state: State) => state.compareListLoading;
