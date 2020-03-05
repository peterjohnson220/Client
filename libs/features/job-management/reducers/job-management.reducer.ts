import * as cloneDeep from 'lodash.clonedeep';

import * as fromJobManagementActions from '../actions/job-management.actions';
import { CompanyJob, CompanyJobUdf, CompanyJobAttachment } from 'libs/models';

export interface State {
  loadingJobOptions: boolean;
  loadingJob: boolean;
  uploadingAttachments: boolean;
  saving: boolean;
  showJobModal: boolean;
  jobId: number;
  jobFormData: CompanyJob;
  attachments: CompanyJobAttachment[];
  companyFlsaStatuses: string[];
  jobFamilies: string[];
  companyJobUdfs: CompanyJobUdf[];
  duplicateJobCodeError: boolean;
  errorMessage: string;
}

export const initialState: State = {
  loadingJobOptions: false,
  loadingJob: false,
  uploadingAttachments: false,
  saving: false,
  showJobModal: false,
  jobId: null,
  jobFormData: null,
  attachments: [],
  companyFlsaStatuses: [],
  jobFamilies: [],
  companyJobUdfs: [],
  duplicateJobCodeError: false,
  errorMessage: '',
};


export function reducer(state = initialState, action: fromJobManagementActions.Actions): State {
  switch (action.type) {
    case fromJobManagementActions.SHOW_JOB_MODAL: {
      return {
        ...state,
        jobId: null,
        jobFormData: null,
        attachments: [],
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
        showJobModal: false
      };
    case fromJobManagementActions.UPLOAD_ATTACHMENTS:
      return {
        ...state,
        uploadingAttachments: true
      };
    case fromJobManagementActions.UPLOAD_ATTACHMENTS_SUCCESS:
      return {
        ...state,
        uploadingAttachments: false,
        attachments: cloneDeep(state.attachments).concat(mapUploadedAttachments(action.uploadedAttachments))
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
        // The jobFormData is set by the subscription of the LOAD_JOB_SUCCESS in the JobFormComponent
        ...state,
        loadingJob: false,
        jobId: action.payload.JobInfo.CompanyJobId,
        attachments: action.payload.JobInfo.CompanyJobsAttachments
      };
    case fromJobManagementActions.UPDATE_COMPANY_JOB:
      return {
        ...state,
        jobFormData: cloneDeep(action.payload)
      };
    case fromJobManagementActions.REMOVE_ATTACHMENT:
      return {
        ...state,
        attachments: cloneDeep(state.attachments.filter(a => a.Filename !== action.fileName))
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
        uploadingAttachments: false,
        errorMessage: action.payload
      };
    default:
      return state;
  }
}

// The object returned from UploadJobAttachment has the property 
// FileName but we are expected the property to be named Filename
export function mapUploadedAttachments(attachments: any): CompanyJobAttachment[] {
  return attachments.map(file => ({
    CompanyJobAttachments_ID: 0,
    DisplayName: file.DisplayName,
    Filename: file.FileName
  }));
}

export const getState = (state: State) => state;
export const getLoading = (state: State) => state.loadingJobOptions || state.loadingJob || state.saving || state.uploadingAttachments;
export const getLoadingJobOptions = (state: State) => state.loadingJobOptions;
export const getLoadingJob = (state: State) => state.loadingJob;
export const getSaving = (state: State) => state.saving;
export const getUploadingAttachments = (state: State) => state.uploadingAttachments;
export const getShowJobModal = (state: State) => state.showJobModal;
export const getJobId = (state: State) => state.jobId;
export const getJobFormData = (state: State) => state.jobFormData;
export const getAttachments = (state: State) => state.attachments;
export const getCompanyFlsaStatuses = (state: State) => state.companyFlsaStatuses;
export const getJobFamilies = (state: State) => state.jobFamilies;
export const getCompanyJobUdfs = (state: State) => state.companyJobUdfs;
export const getDuplicateJobCodeError = (state: State) => state.duplicateJobCodeError;
export const getErrorMessage = (state: State) => state.errorMessage;
