import * as cloneDeep from 'lodash.clonedeep';

import * as fromJobManagementActions from '../actions/job-management.actions';
import { CompanyJob, CompanyJobUdf } from 'libs/models';

export interface State {
  loadingJobOptions: boolean;
  loadingJob: boolean;
  showJobModal: boolean;
  jobId: number;
  companyJob: CompanyJob;
  companyFlsaStatuses: string[];
  jobFamilies: string[];
  companyJobUdfs: CompanyJobUdf[];
  saving: boolean;
  duplicateJobCodeError: boolean;
  errorMessage: string;
}

export const initialState: State = {
  loadingJobOptions: false,
  loadingJob: false,
  showJobModal: false,
  jobId: null,
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
    case fromJobManagementActions.SHOW_JOB_MODAL: {
      return {
        ...state,
        showJobModal: action.payload,
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
        companyJob: null,
        showJobModal: false
      };
    case fromJobManagementActions.LOAD_JOB_OPTIONS:
      return {
        ...state,
        loadingJobOptions: true
      };
    case fromJobManagementActions.LOAD_JOB_OPTIONS_SUCCESS:
      return {
        ...state,
        loadingJobOptions: false,
        jobFamilies: action.jobFamilies.filter(e => e.length > 0),
        companyFlsaStatuses: action.companyFlsaStatuses.filter(e => e.length > 0),
        companyJobUdfs: action.companyJobUdfs
      };
    case fromJobManagementActions.LOAD_JOB:
      return {
        ...state,
        jobId: action.jobId,
        loadingJob: true
      };
    case fromJobManagementActions.LOAD_JOB_SUCCESS:
      return {
        ...state,
        loadingJob: false,
        companyJob: action.payload.JobInfo,
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
        loadingJobOptions: false,
        saving: false,
        errorMessage: action.payload
      };
    default:
      return state;
  }
}

export const getState = (state: State) => state;
export const getLoading = (state: State) => state.loadingJobOptions || state.loadingJob;
export const getLoadingJobOptions = (state: State) => state.loadingJobOptions;
export const getLoadingJob = (state: State) => state.loadingJob;
export const getShowJobModal = (state: State) => state.showJobModal;
export const getJobId = (state: State) => state.jobId;
export const getCompanyJob = (state: State) => state.companyJob;
export const getCompanyFlsaStatuses = (state: State) => state.companyFlsaStatuses;
export const getJobFamilies = (state: State) => state.jobFamilies;
export const getCompanyJobUdfs = (state: State) => state.companyJobUdfs;
export const getSaving = (state: State) => state.saving;
export const getDuplicateJobCodeError = (state: State) => state.duplicateJobCodeError;
export const getErrorMessage = (state: State) => state.errorMessage;
