import { JobDescription } from 'libs/models/jdm';

import * as fromJobDescriptionJobCompareActions from '../actions/job-description-job-compare.actions';

export interface State {
  jobDescriptionList: JobDescription[];
  jobDescriptionComparisonDiff: any;
  loadingJobDescriptionComparisonDiff: boolean;
  loadingJobDescriptionComparisonDiffError: boolean;

  sourceJobDescription: JobDescription;
  loadingSourceJobDescription: boolean;
  loadingSourceJobDescriptionError: boolean;

  jobDescriptionForComparison: JobDescription;
  loadingJobDescriptionForComparison: boolean;
  loadingJobDescriptionForComparisonError: boolean;

  leftJobIsFullscreen: boolean;
  rightJobIsFullscreen: boolean;

  editingJobDescription: boolean;
  saving: boolean;
}

export const initialState: State = {
  jobDescriptionList: [],
  jobDescriptionComparisonDiff: null,
  loadingJobDescriptionComparisonDiff: false,
  loadingJobDescriptionComparisonDiffError: false,

  sourceJobDescription: null,
  loadingSourceJobDescription: false,
  loadingSourceJobDescriptionError: false,

  jobDescriptionForComparison: null,
  loadingJobDescriptionForComparison: false,
  loadingJobDescriptionForComparisonError: false,

  leftJobIsFullscreen: false,
  rightJobIsFullscreen: false,

  editingJobDescription: false,
  saving: false
};

export function reducer(state = initialState, action: fromJobDescriptionJobCompareActions.Actions): State {
  switch (action.type) {
    case fromJobDescriptionJobCompareActions.LOAD_JOB_DESCRIPTION_LIST_SUCCESS:
      return {
        ...state,
        jobDescriptionList: action.payload
      };
    case fromJobDescriptionJobCompareActions.LOAD_SOURCE_JOB_DESCRIPTION_SUCCESS:
      return {
        ...state,
        loadingSourceJobDescription: false,
        sourceJobDescription: action.payload
      };
    case fromJobDescriptionJobCompareActions.LOAD_JOB_DESCRIPTION_FOR_COMPARISON_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        loadingJobDescriptionForComparison: false,
        jobDescriptionForComparison: action.payload
      };
    default:
      return state;
  }
}

export const getJobDescriptionList = (state: State) => state.jobDescriptionList;
export const getSourceJobDescription = (state: State) => state.sourceJobDescription;
export const getJobDescriptionForComparison = (state: State) => state.jobDescriptionForComparison;
