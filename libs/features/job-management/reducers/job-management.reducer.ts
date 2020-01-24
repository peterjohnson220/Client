import * as cloneDeep from 'lodash.clonedeep';

import * as fromJobManagementActions from '../actions/job-management.actions';
import { CompanyJob, CompanyJobUdf } from 'libs/models';

export interface State {
  loading: boolean;
  showJobForm: boolean;
  companyJob: CompanyJob;
  companyFlsaStatuses: string[];
  jobFamilies: string[];
  companyJobUdfs: CompanyJobUdf[];
  saving: boolean;
  duplicateJobCodeError: boolean;
  errorMessage: string;
}

export const initialState: State = {
  loading: false,
  showJobForm: false,
  companyJob: null,
  companyFlsaStatuses: [],
  jobFamilies: [],
  companyJobUdfs: [],
  saving: false,
  duplicateJobCodeError: false,
  errorMessage: '',
};


export function reducer(state = initialState, action: fromJobManagementActions.Actions): State {
  switch (action.type) {
    case fromJobManagementActions.SHOW_JOB_FORM: {
      return {
        ...state,
        showJobForm: action.payload,
      };
    }
    case fromJobManagementActions.SAVE_COMPANY_JOB:
      return {
        ...state,
        saving: true
      };
    case fromJobManagementActions.SAVE_COMPANY_JOB_SUCCESS:
      return {
        ...state,
        saving: false,
        showJobForm: false
      };
    case fromJobManagementActions.LOAD_JOB_OPTIONS:
      return {
        ...state,
        loading: true
      };
    case fromJobManagementActions.LOAD_JOB_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        jobFamilies: action.jobFamilies,
        companyFlsaStatuses: action.companyFlsaStatuses,
        companyJobUdfs: action.companyJobUdfs
      };
    case fromJobManagementActions.UPDATE_COMPANY_JOB:
      return {
        ...state,
        companyJob: cloneDeep(action.payload)
      };
    case fromJobManagementActions.SET_DUPLICATE_JOB_CODE_ERROR:
      return {
        ...state,
        saving: false,
        duplicateJobCodeError: action.payload
      };
    case fromJobManagementActions.HANDLE_API_ERROR:
      return {
        ...state,
        loading: false,
        saving: false,
        errorMessage: action.payload
      };
    default:
      return state;
  }
}

export const getState = (state: State) => state;
export const getLoading = (state: State) => state.loading;
export const getShowJobForm = (state: State) => state.showJobForm;
export const getCompanyJob = (state: State) => state.companyJob;
export const getCompanyFlsaStatuses = (state: State) => state.companyFlsaStatuses;
export const getJobFamilies = (state: State) => state.jobFamilies;
export const getCompanyJobUdfs = (state: State) => state.companyJobUdfs;
export const getSaving = (state: State) => state.saving;
export const getDuplicateJobCodeError = (state: State) => state.duplicateJobCodeError;
export const getErrorMessage = (state: State) => state.errorMessage;
