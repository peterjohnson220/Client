import cloneDeep from 'lodash/cloneDeep';

import { CompanyJob } from 'libs/models/company';
import { CompanyJobUdfColumn } from 'libs/models/jdm/company-job-udf-column';
import { MessageHelper } from 'libs/core';

import * as fromAddJobModalActions from '../actions/add-job-modal.actions';

export interface State {
  companyJob: CompanyJob;
  companyJobUdfColumns: CompanyJobUdfColumn[];
  creatingCompanyJob: boolean;
  creatingCompanyJobError: boolean;
  creatingCompanyJobErrorMessage: string;
  creatingCompanyJobSuccess: boolean;
  duplicateCompanyJobMessage: string;
  loadingCompanyJobUdfColumns: boolean;
  loadingCompanyJobUdfColumnsError: boolean;
}

export const initialState: State = {
  companyJob: null,
  companyJobUdfColumns: [],
  creatingCompanyJob: false,
  creatingCompanyJobError: false,
  creatingCompanyJobErrorMessage: '',
  creatingCompanyJobSuccess: false,
  duplicateCompanyJobMessage: '',
  loadingCompanyJobUdfColumns: false,
  loadingCompanyJobUdfColumnsError: false
};

export function reducer(state = initialState, action: fromAddJobModalActions.Actions): State {
  switch (action.type) {
    case fromAddJobModalActions.CREATE_COMPANY_JOB:
      return {
        ...state,
        creatingCompanyJob: true,
        creatingCompanyJobError: false,
        creatingCompanyJobSuccess: false
      };
    case fromAddJobModalActions.CREATE_COMPANY_JOB_ERROR:
      return {
        ...state,
        creatingCompanyJob: false,
        creatingCompanyJobError: true,
        creatingCompanyJobSuccess: false,
        creatingCompanyJobErrorMessage: MessageHelper.buildErrorMessage('There was an error creating this job.'),
        duplicateCompanyJobMessage: ''
      };
    case fromAddJobModalActions.CREATE_COMPANY_JOB_SUCCESS:
      return {
        ...state,
        creatingCompanyJob: false,
        creatingCompanyJobError: false,
        creatingCompanyJobSuccess: true,
        companyJob: cloneDeep(action.payload),
        creatingCompanyJobErrorMessage: '',
        duplicateCompanyJobMessage: ''
      };
    case fromAddJobModalActions.LOAD_COMPANY_JOB_UDF_COLUMNS:
      return {
        ...state,
        loadingCompanyJobUdfColumns: true
      };
    case fromAddJobModalActions.LOAD_COMPANY_JOB_UDF_COLUMNS_ERROR:
      return {
        ...state,
        loadingCompanyJobUdfColumns: false,
        loadingCompanyJobUdfColumnsError: true
      };
    case fromAddJobModalActions.LOAD_COMPANY_JOB_UDF_COLUMNS_SUCCESS:
      return {
        ...state,
        loadingCompanyJobUdfColumns: false,
        loadingCompanyJobUdfColumnsError: false,
        companyJobUdfColumns: cloneDeep(action.payload)
      };
    case fromAddJobModalActions.SET_DUPLICATE_COMPANY_JOB_MESSAGE:
      return {
        ...state,
        duplicateCompanyJobMessage: action.payload.errorMessage,
        creatingCompanyJobErrorMessage: ''
      };
    case fromAddJobModalActions.UPDATE_COMPANY_JOB:
      return {
        ...state,
        companyJob: cloneDeep(action.payload)
      };
    default:
      return state;
  }
}

export const getCompanyJob = (state: State) => state.companyJob;
export const getCompanyJobCreating = (state: State) => state.creatingCompanyJob;
export const getCompanyJobCreatingSuccess = (state: State) => state.creatingCompanyJobSuccess;
export const getCompanyJobCreatingError = (state: State) => state.creatingCompanyJobError;
export const getCompanyJobCreatingErrorMessage = (state: State) => state.creatingCompanyJobErrorMessage;
export const getCompanyJobUdfColumns = (state: State) => state.companyJobUdfColumns;
export const getCompanyJobUdfColumnsLoading = (state: State) => state.loadingCompanyJobUdfColumns;
export const getCompanyJobUdfColumnsLoadingError = (state: State) => state.loadingCompanyJobUdfColumnsError;
export const getDuplicateCompanyJobMessage = (state: State) => state.duplicateCompanyJobMessage;
