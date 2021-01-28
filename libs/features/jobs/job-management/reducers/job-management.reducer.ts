import cloneDeep from 'lodash/cloneDeep';

import * as fromJobManagementActions from '../actions/job-management.actions';
import {
  CompanyJob,
  CompanyJobUdf,
  CompanyJobAttachment,
  CompanyStructure,
  CompanyStructureInfo,
  CompanyStructurePaymarketGrade,
  JobDescriptionSummary
} from 'libs/models';

export interface State {
  loadingJobOptions: boolean;
  loadingStructurePayMarketGrade: boolean;
  loadingJob: boolean;
  uploadingAttachments: boolean;
  saving: boolean;
  jobId: number;
  jobFormData: CompanyJob;
  jobDescriptionSummary: JobDescriptionSummary;
  attachments: CompanyJobAttachment[];
  structures: CompanyStructureInfo[];
  selectedStructureId: number;
  companyFlsaStatuses: string[];
  jobFamilies: string[];
  isJdmEnabled: boolean;
  companyJobUdfs: CompanyJobUdf[];
  structuresList: CompanyStructure[];
  paymarketGradeList: CompanyStructurePaymarketGrade[];
  duplicateJobCodeError: boolean;
  errorMessage: string;
}

export const defaultJobDescriptionSummary: JobDescriptionSummary = {
  JobDescriptionId: null,
  JobSummary: null,
  JobDescriptionManagementEnabled: false,
  CompanyJobCode: null,
  CompanyJobId: null
};

export const initialState: State = {
  loadingJobOptions: false,
  loadingStructurePayMarketGrade: false,
  loadingJob: false,
  uploadingAttachments: false,
  saving: false,
  jobId: null,
  jobFormData: null,
  jobDescriptionSummary: defaultJobDescriptionSummary,
  attachments: [],
  structures: [],
  selectedStructureId: null,
  companyFlsaStatuses: [],
  jobFamilies: [],
  isJdmEnabled: false,
  companyJobUdfs: [],
  structuresList: [],
  paymarketGradeList: [],
  duplicateJobCodeError: false,
  errorMessage: '',
};

export function reducer(state = initialState, action: fromJobManagementActions.Actions): State {
  switch (action.type) {
    case fromJobManagementActions.RESET_STATE: {
      return {
        ...state,
        jobId: null,
        jobFormData: null,
        jobDescriptionSummary: defaultJobDescriptionSummary,
        attachments: [],
        structures: [],
        selectedStructureId: state.structuresList && state.structuresList.length > 0
          ? state.structuresList[0].CompanyStructuresId : state.selectedStructureId
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
        companyJobUdfs: action.companyJobUdfs,
        structuresList: action.structures,
        isJdmEnabled: action.isJdmEnabled,
        selectedStructureId: action.structures && action.structures.length > 0 ? action.structures[0].CompanyStructuresId : null,
      };
    case fromJobManagementActions.LOAD_STRUCTURE_PAYMARKET_GRADE:
      return {
        ...state,
        loadingStructurePayMarketGrade: true
      };
    case fromJobManagementActions.LOAD_STRUCTURE_PAYMARKET_GRADE_SUCCESS:
      return {
        ...state,
        loadingStructurePayMarketGrade: false,
        paymarketGradeList: action.structurePaymarketGrade
      };
    case fromJobManagementActions.LOAD_JOB:
      return {
        ...state,
        jobId: action.jobId,
        loadingJob: true
      };
    case fromJobManagementActions.LOAD_JOB_SUCCESS:
      return {
        // The jobFormData is set in the StandardFieldsComponent on LOAD_JOB_SUCCESS because we need to init the reactive form
        ...state,
        loadingJob: false,
        jobId: action.payload.JobInfo.CompanyJobId,
        attachments: action.payload.JobInfo.CompanyJobsAttachments,
        structures: action.payload.StructureInfo,
        jobDescriptionSummary: action.payload.JobSummaryObj
      };
    case fromJobManagementActions.SET_SELECTED_STRUCTURE_ID:
      return {
        ...state,
        selectedStructureId: action.payload
      };
    case fromJobManagementActions.ADD_STRUCTURE_MAPPING:
      return {
        ...state,
        structures: cloneDeep(state.structures).concat(action.payload)
      };
    case fromJobManagementActions.DELETE_STRUCTURE_MAPPING:
      return {
        ...state,
        structures: cloneDeep(state.structures).filter(s => s.CompanyStructuresRangeGroupId !== action.payload)
      };
    case fromJobManagementActions.UPDATE_STANDARD_FIELDS:
      return {
        ...state,
        jobFormData: updateStandardFields(state.jobFormData, action.payload)
      };
    case fromJobManagementActions.UPDATE_JOB_DESCRIPTION:
      return {
        ...state,
        jobFormData: {
          ...state.jobFormData,
          JobDescription: action.payload
        }
      };
    case fromJobManagementActions.UPDATE_USER_DEFINED_FIELDS:
      return {
        ...state,
        jobFormData: updateUserDefinedFields(state.jobFormData, action.payload)
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
        loadingStructurePayMarketGrade: false,
        errorMessage: action.payload
      };
    default:
      return state;
  }
}

export function updateStandardFields(curCompanyJob: CompanyJob, newCompanyJob: CompanyJob): CompanyJob {
  let updatedCompanyJob: CompanyJob = cloneDeep(curCompanyJob);
  if (updatedCompanyJob) {
    updatedCompanyJob.JobCode = newCompanyJob.JobCode;
    updatedCompanyJob.JobFamily = newCompanyJob.JobFamily ? newCompanyJob.JobFamily : '';
    updatedCompanyJob.JobTitle = newCompanyJob.JobTitle;
    updatedCompanyJob.JobLevel = newCompanyJob.JobLevel;
    updatedCompanyJob.FLSAStatus = newCompanyJob.FLSAStatus ? newCompanyJob.FLSAStatus : '';
    updatedCompanyJob.JobStatus = newCompanyJob.JobStatus;
    updatedCompanyJob.JobDescription = newCompanyJob.JobDescription;
  } else {
    updatedCompanyJob = newCompanyJob;
  }
  return updatedCompanyJob;
}

export function updateUserDefinedFields(curCompanyJob: CompanyJob, newCompanyJob: CompanyJob): CompanyJob {
  let updatedCompanyJob: CompanyJob = cloneDeep(curCompanyJob);
  if (updatedCompanyJob) {
    Object.keys(newCompanyJob).forEach(p => updatedCompanyJob[p] = newCompanyJob[p]);
  } else {
    updatedCompanyJob = newCompanyJob;
  }
  return updatedCompanyJob;
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
export const getLoading = (state: State) => {
  return state.loadingJobOptions || state.loadingStructurePayMarketGrade || state.loadingJob || state.saving || state.uploadingAttachments;
};
export const getLoadingJobOptions = (state: State) => state.loadingJobOptions;
export const getLoadingStructurePayMarketGrade = (state: State) => state.loadingStructurePayMarketGrade;
export const getLoadingJob = (state: State) => state.loadingJob;
export const getJobDescriptionSummary = (state: State) => state.jobDescriptionSummary;
export const getSaving = (state: State) => state.saving;
export const getUploadingAttachments = (state: State) => state.uploadingAttachments;
export const getJobId = (state: State) => state.jobId;
export const getJobFormData = (state: State) => state.jobFormData;
export const getAttachments = (state: State) => state.attachments;
export const getStructures = (state: State) => state.structures;
export const getSelectedStructureId = (state: State) => state.selectedStructureId;
export const getCompanyFlsaStatuses = (state: State) => state.companyFlsaStatuses;
export const getJobFamilies = (state: State) => state.jobFamilies;
export const getIsJdmEnabled = (state: State) => state.isJdmEnabled;
export const getCompanyJobUdfs = (state: State) => state.companyJobUdfs;
export const getStructuresList = (state: State) => state.structuresList;
export const getPaymarketGradeList = (state: State) => state.paymarketGradeList;
export const getDuplicateJobCodeError = (state: State) => state.duplicateJobCodeError;
export const getErrorMessage = (state: State) => state.errorMessage;
