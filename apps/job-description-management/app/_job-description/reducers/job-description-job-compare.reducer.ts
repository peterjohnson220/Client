import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { JobDescription } from 'libs/models/jdm';
import { SaveError } from 'libs/models/common/save-error';

import * as fromJobDescriptionJobCompareActions from '../actions/job-description-job-compare.actions';

export interface State {
  jobDescriptionList: JobDescription[];
  jobDescriptionComparisonDiffAsync: AsyncStateObj<any>;
  sourceJobDescriptionAsync: AsyncStateObj<JobDescription>;
  jobDescriptionForComparisonAsync: AsyncStateObj<JobDescription>;
  saving: boolean;
  saveError: SaveError;
}

export const initialState: State = {
  jobDescriptionList: [],
  jobDescriptionComparisonDiffAsync: generateDefaultAsyncStateObj<any>(null),
  sourceJobDescriptionAsync: generateDefaultAsyncStateObj<JobDescription>(null),
  jobDescriptionForComparisonAsync: generateDefaultAsyncStateObj<JobDescription>(null),
  saving: false,
  saveError: null
};

export function reducer(state = initialState, action: fromJobDescriptionJobCompareActions.Actions): State {
  switch (action.type) {
    case fromJobDescriptionJobCompareActions.LOAD_JOB_DESCRIPTION_LIST_SUCCESS: {
      return {
        ...state,
        jobDescriptionList: action.payload
      };
    }
    case fromJobDescriptionJobCompareActions.LOAD_JOB_DESCRIPTION_COMPARISON_DIFF: {
      const jobDescriptionComparisonDiffAsyncClone = cloneDeep(state.jobDescriptionComparisonDiffAsync);

      jobDescriptionComparisonDiffAsyncClone.loading = true;
      jobDescriptionComparisonDiffAsyncClone.loadingError = false;

      return {
        ...state,
        jobDescriptionComparisonDiffAsync: jobDescriptionComparisonDiffAsyncClone
      };
    }
    case fromJobDescriptionJobCompareActions.LOAD_JOB_DESCRIPTION_COMPARISON_DIFF_SUCCESS: {
      const jobDescriptionComparisonDiffAsyncClone = cloneDeep(state.jobDescriptionComparisonDiffAsync);

      jobDescriptionComparisonDiffAsyncClone.loading = false;
      jobDescriptionComparisonDiffAsyncClone.obj = action.payload;

      return {
        ...state,
        jobDescriptionComparisonDiffAsync: jobDescriptionComparisonDiffAsyncClone
      };
    }
    case fromJobDescriptionJobCompareActions.LOAD_JOB_DESCRIPTION_COMPARISON_DIFF_ERROR: {
      const jobDescriptionComparisonDiffAsyncClone = cloneDeep(state.jobDescriptionComparisonDiffAsync);

      jobDescriptionComparisonDiffAsyncClone.loading = false;
      jobDescriptionComparisonDiffAsyncClone.loadingError = true;

      return {
        ...state,
        jobDescriptionComparisonDiffAsync: jobDescriptionComparisonDiffAsyncClone
      };
    }

    case fromJobDescriptionJobCompareActions.RESET_JOB_DESCRIPTION_JOB_COMPARE_STATE: {
      return initialState;
    }

    case fromJobDescriptionJobCompareActions.LOAD_SOURCE_JOB_DESCRIPTION: {
      const sourceJobDescriptionAsyncClone = cloneDeep(state.sourceJobDescriptionAsync);

      sourceJobDescriptionAsyncClone.loading = true;
      sourceJobDescriptionAsyncClone.loadingError = false;

      return {
        ...state,
        sourceJobDescriptionAsync: sourceJobDescriptionAsyncClone
      };
    }
    case fromJobDescriptionJobCompareActions.LOAD_SOURCE_JOB_DESCRIPTION_SUCCESS: {
      const sourceJobDescriptionAsyncClone = cloneDeep(state.sourceJobDescriptionAsync);

      sourceJobDescriptionAsyncClone.loading = false;
      sourceJobDescriptionAsyncClone.obj = action.payload;

      return {
        ...state,
        sourceJobDescriptionAsync: sourceJobDescriptionAsyncClone
      };
    }
    case fromJobDescriptionJobCompareActions.LOAD_SOURCE_JOB_DESCRIPTION_ERROR: {
      const sourceJobDescriptionAsyncClone = cloneDeep(state.sourceJobDescriptionAsync);

      sourceJobDescriptionAsyncClone.loading = false;
      sourceJobDescriptionAsyncClone.loadingError = true;

      return {
        ...state,
        sourceJobDescriptionAsync: sourceJobDescriptionAsyncClone
      };
    }
    case fromJobDescriptionJobCompareActions.LOAD_JOB_DESCRIPTION_FOR_COMPARISON: {
      const jobDescriptionForComparisonAsyncClone = cloneDeep(state.jobDescriptionForComparisonAsync);

      jobDescriptionForComparisonAsyncClone.loading = true;
      jobDescriptionForComparisonAsyncClone.loadingError = false;

      return {
        ...state,
        jobDescriptionForComparisonAsync: jobDescriptionForComparisonAsyncClone
      };
    }
    case fromJobDescriptionJobCompareActions.LOAD_JOB_DESCRIPTION_FOR_COMPARISON_SUCCESS: {
      const jobDescriptionForComparisonAsyncClone = cloneDeep(state.jobDescriptionForComparisonAsync);

      jobDescriptionForComparisonAsyncClone.loading = false;
      jobDescriptionForComparisonAsyncClone.obj = action.payload;

      return {
        ...state,
        jobDescriptionForComparisonAsync: jobDescriptionForComparisonAsyncClone
      };
    }
    case fromJobDescriptionJobCompareActions.LOAD_JOB_DESCRIPTION_FOR_COMPARISON_ERROR: {
      const jobDescriptionForComparisonAsyncClone = cloneDeep(state.jobDescriptionForComparisonAsync);

      jobDescriptionForComparisonAsyncClone.loading = false;
      jobDescriptionForComparisonAsyncClone.loadingError = true;

      return {
        ...state,
        jobDescriptionForComparisonAsync: jobDescriptionForComparisonAsyncClone
      };
    }
    case fromJobDescriptionJobCompareActions.SAVE_JOB_DESCRIPTION: {
      return {
        ...state,
        saving: true
      };
    }
    case fromJobDescriptionJobCompareActions.SAVE_JOB_DESCRIPTION_SUCCESS: {
      const sourceJobDescriptionAsyncClone = cloneDeep(state.sourceJobDescriptionAsync);

      sourceJobDescriptionAsyncClone.obj.DraftNumber = action.payload.DraftNumber;
      sourceJobDescriptionAsyncClone.obj.JobDescriptionStatus = action.payload.JobDescriptionStatus;
      sourceJobDescriptionAsyncClone.obj.JobDescriptionRevision = action.payload.JobDescriptionRevision;

      if (action.IsFirstSave) {
        sourceJobDescriptionAsyncClone.obj.Name = action.payload.Name;
        sourceJobDescriptionAsyncClone.obj.JobInformationFields = action.payload.JobInformationFields;
      }

      return {
        ...state,
        saving: false,
        sourceJobDescriptionAsync: sourceJobDescriptionAsyncClone
      };
    }
    case fromJobDescriptionJobCompareActions.SAVE_JOB_DESCRIPTION_ERROR: {
      return {
        ...state,
        saving: false,
        saveError: action.payload
      };
    }
    case fromJobDescriptionJobCompareActions.CLEAR_SAVE_JOB_DESCRIPTION_ERROR: {
      return {
        ...state,
        saveError: null
      };
    }
    default: {
      return state;
    }
  }
}

export const getJobDescriptionList = (state: State) => state.jobDescriptionList;
export const getJobDescriptionComparisonDiffAsync = (state: State) => state.jobDescriptionComparisonDiffAsync;
export const getSourceJobDescriptionAsync = (state: State) => state.sourceJobDescriptionAsync;
export const getJobDescriptionForComparisonAsync = (state: State) => state.jobDescriptionForComparisonAsync;
export const getJobDescriptionSaving = (state: State) => state.saving;
export const getJobDescriptionSaveError = (state: State) => state.saveError;
