import cloneDeep from 'lodash/cloneDeep';

import * as fromJobFamilyActions from 'libs/features/job-description-management/actions/job-family.actions';

export interface State {
  jobFamilies: string[];
  loadingJobFamilies: boolean;
  loadingJobFamiliesError: boolean;
  errorMessage: string;
}

export const initialState: State = {
  jobFamilies: [],
  loadingJobFamilies: false,
  loadingJobFamiliesError: false,
  errorMessage: ''
};

export function reducer(state = initialState, action: fromJobFamilyActions.Actions): State {
  switch (action.type) {
    case fromJobFamilyActions.LOAD_JOB_FAMILIES:
      return {
        ...state,
        loadingJobFamilies: true
      };
    case fromJobFamilyActions.LOAD_JOB_FAMILIES_ERROR:
      return {
        ...state,
        loadingJobFamilies: false,
        loadingJobFamiliesError: true,
        errorMessage: action.payload.errorMessage
      };
    case fromJobFamilyActions.LOAD_JOB_FAMILIES_SUCCESS:
      return {
        ...state,
        loadingJobFamilies: false,
        loadingJobFamiliesError: false,
        errorMessage: '',
        jobFamilies: cloneDeep(action.payload)
      };
    default:
      return state;
  }
}

export const getJobFamilies = (state: State) => state.jobFamilies;
export const getJobFamiliesLoading = (state: State) => state.loadingJobFamilies;
export const getJobFamiliesLoadingError = (state: State) => state.loadingJobFamiliesError;
export const getJobFamiliesLoadingErrorMessage = (state: State) => state.errorMessage;
