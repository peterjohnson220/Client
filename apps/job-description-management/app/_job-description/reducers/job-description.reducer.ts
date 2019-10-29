import * as cloneDeep from 'lodash.clonedeep';

import { JobDescription } from 'libs/models/jdm';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromJobDescriptionActions from '../actions/job-description.actions';
import { SaveJobDescriptionTemplateIdSucessModel } from '../models';
import { UndoHelper } from '../../shared/helpers';

const MAX_UNDO_QUEUE_LEN = 50;

export interface State {
  creatingJobDescription: boolean;
  creatingJobDescriptionError: boolean;
  creatingJobDescriptionDraft: boolean;
  creatingJobDescriptionDraftError: boolean;
  createdJobDescriptionId: number;
  createdJobDescriptionDraft: any;
  savingCompanyJobsJobDescriptionTemplateId: boolean;
  savingCompanyJobsJobDescriptionTemplateIdError: boolean;
  savingCompanyJobsJobDescriptionTemplateIdPayload: SaveJobDescriptionTemplateIdSucessModel;
  jobDescriptionAsync: AsyncStateObj<JobDescription>;
  editing: boolean;
  saving: boolean;
  publishButtonEnabled: boolean;
  jobDescriptionRecentChange: JobDescription;
  jobDescriptionChangeHistory: JobDescription[];
  companyLogoAsync: AsyncStateObj<string>;
}

export const initialState: State = {
  creatingJobDescription: false,
  creatingJobDescriptionError: false,
  creatingJobDescriptionDraft: false,
  creatingJobDescriptionDraftError: false,
  createdJobDescriptionId: null,
  createdJobDescriptionDraft: null,
  savingCompanyJobsJobDescriptionTemplateId: false,
  savingCompanyJobsJobDescriptionTemplateIdError: false,
  savingCompanyJobsJobDescriptionTemplateIdPayload: null,
  jobDescriptionAsync: generateDefaultAsyncStateObj<JobDescription>(null),
  editing: false,
  saving: false,
  publishButtonEnabled: false,
  jobDescriptionRecentChange: null,
  jobDescriptionChangeHistory: [],
  companyLogoAsync: generateDefaultAsyncStateObj<string>(null),
};

export function reducer(state = initialState, action: fromJobDescriptionActions.Actions): State {
  switch (action.type) {
    case fromJobDescriptionActions.LOAD_COMPANY_LOGO: {
      const companyLogoAsync = cloneDeep(state.companyLogoAsync);
      companyLogoAsync.loading = true;
      companyLogoAsync.error = false;
      return {
        ...state,
        companyLogoAsync: companyLogoAsync
      };
    }
    case fromJobDescriptionActions.LOAD_COMPANY_LOGO_ERROR: {
      const companyLogoAsync = cloneDeep(state.companyLogoAsync);
      companyLogoAsync.loading = false;
      companyLogoAsync.error = true;
      return {
        ...state,
        companyLogoAsync: companyLogoAsync
      };
    }
    case fromJobDescriptionActions.LOAD_COMPANY_LOGO_SUCCESS: {
      const companyLogoAsync = cloneDeep(state.companyLogoAsync);
      companyLogoAsync.loading = false;
      companyLogoAsync.obj = action.payload;
      return {
        ...state,
        companyLogoAsync: companyLogoAsync
      };
    }
    case fromJobDescriptionActions.CREATE_JOB_DESCRIPTION:
      return {
        ...state,
        creatingJobDescription: true
      };
    case fromJobDescriptionActions.CREATE_JOB_DESCRIPTION_ERROR:
      return {
        ...state,
        creatingJobDescription: false,
        creatingJobDescriptionError: true
      };
    case fromJobDescriptionActions.CREATE_JOB_DESCRIPTION_SUCCESS:
      return {
        ...state,
        creatingJobDescription: false,
        createdJobDescriptionId: action.payload
      };
    case fromJobDescriptionActions.CREATE_JOB_DESCRIPTION_DRAFT:
      return {
        ...state,
        creatingJobDescriptionDraft: true
      };
    case fromJobDescriptionActions.CREATE_JOB_DESCRIPTION_DRAFT_ERROR:
      return {
        ...state,
        creatingJobDescriptionDraft: false,
        creatingJobDescriptionDraftError: true
      };
    case fromJobDescriptionActions.CREATE_JOB_DESCRIPTION_DRAFT_SUCCESS:
      return {
        ...state,
        creatingJobDescriptionDraft: false,
        createdJobDescriptionDraft: JSON.parse(action.payload)
      };
    case fromJobDescriptionActions.SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID:
      return {
        ...state,
        savingCompanyJobsJobDescriptionTemplateId: true
      };
    case fromJobDescriptionActions.SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID_ERROR:
      return {
        ...state,
        savingCompanyJobsJobDescriptionTemplateId: false,
        savingCompanyJobsJobDescriptionTemplateIdError: true
      };
    case fromJobDescriptionActions.SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID_SUCCESS:
      return {
        ...state,
        savingCompanyJobsJobDescriptionTemplateId: false,
        savingCompanyJobsJobDescriptionTemplateIdPayload: cloneDeep(action.payload)
      };
    case fromJobDescriptionActions.GET_JOB_DESCRIPTION: {
      const asyncStateObjClone = cloneDeep(state.jobDescriptionAsync);
      asyncStateObjClone.loading = true;
      asyncStateObjClone.error = false;
      return {
        ...state,
        jobDescriptionAsync: asyncStateObjClone
      };
    }
    case fromJobDescriptionActions.GET_JOB_DESCRIPTION_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.jobDescriptionAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = action.payload;
      const editing: boolean = asyncStateObjClone.obj.JobDescriptionStatus === 'Draft' ||
        (asyncStateObjClone.obj.JobDescriptionStatus === 'In Review' && asyncStateObjClone.obj.identityInWorkflow);
      return {
        ...state,
        jobDescriptionAsync: asyncStateObjClone,
        editing: editing
      };
    }
    case fromJobDescriptionActions.GET_JOB_DESCRIPTION_ERROR: {
      const asyncStateObjClone = cloneDeep(state.jobDescriptionAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.error = true;
      return {
        ...state,
        jobDescriptionAsync: asyncStateObjClone
      };
    }
    case fromJobDescriptionActions.SAVE_JOB_DESCRIPTION: {
      return {
        ...state,
        saving: true
      };
    }
    case fromJobDescriptionActions.SAVE_JOB_DESCRIPTION_SUCCESS: {
      const asyncStateObjClone: AsyncStateObj<JobDescription> = cloneDeep(state.jobDescriptionAsync);
      asyncStateObjClone.obj.DraftNumber = action.payload.jobDescription.DraftNumber;
      asyncStateObjClone.obj.JobDescriptionStatus = action.payload.jobDescription.JobDescriptionStatus;
      asyncStateObjClone.obj.JobDescriptionRevision = action.payload.jobDescription.JobDescriptionRevision;
      asyncStateObjClone.obj.CreatedDate = action.payload.jobDescription.CreatedDate;
      if (action.payload.isFirstSave) {
        asyncStateObjClone.obj.Name = action.payload.jobDescription.Name;
        asyncStateObjClone.obj.JobInformationFields = action.payload.jobDescription.JobInformationFields;
      }

      const jobDescriptionChangeHistoryClone = state.jobDescriptionChangeHistory;

      if (state.jobDescriptionRecentChange && !action.payload.undo) {
        if (jobDescriptionChangeHistoryClone.length === 0) {
          jobDescriptionChangeHistoryClone.push(state.jobDescriptionRecentChange);
        } else {
          const undoPoint = UndoHelper.getUndoPoint(state.jobDescriptionAsync.obj, state.jobDescriptionRecentChange);
          if (UndoHelper.needsUndoPoint(undoPoint)) {
            // If max queue size, pop the first element and not 0th because 0th needs to be a full state and
            // we are storing changes in state only for non-0th element
            if (jobDescriptionChangeHistoryClone.length > MAX_UNDO_QUEUE_LEN) {
              jobDescriptionChangeHistoryClone.splice(1, 1);
            }
            jobDescriptionChangeHistoryClone.push(undoPoint);
          }
        }
      }
      const jobDescriptionRecentChange = state.jobDescriptionAsync.obj;
      return {
        ...state,
        saving: false,
        jobDescriptionAsync: asyncStateObjClone,
        jobDescriptionRecentChange: jobDescriptionRecentChange,
        jobDescriptionChangeHistory: jobDescriptionChangeHistoryClone,
        publishButtonEnabled: true
      };
    }
    case fromJobDescriptionActions.SAVE_JOB_DESCRIPTION_ERROR: {
      return {
        ...state,
        saving: false,
        publishButtonEnabled: true
      };
    }
    case fromJobDescriptionActions.TOGGLE_PUBLISH_BUTTON: {
      return {
        ...state,
        publishButtonEnabled: action.payload.enabled
      };
    }
    default:
      return state;
  }
}

export const getCreatedJobDescriptionId = (state: State) => state.createdJobDescriptionId;
export const getCreatedJobDescriptionDraft = (state: State) => state.createdJobDescriptionDraft;
export const getJobDescriptionCreating = (state: State) => state.creatingJobDescription;
export const getJobDescriptionCreatingError = (state: State) => state.creatingJobDescriptionError;
export const getJobDescriptionDraftCreating = (state: State) => state.creatingJobDescriptionDraft;
export const getJobDescriptionDraftCreatingError = (state: State) => state.creatingJobDescriptionDraftError;
export const getCompanyJobsJobDescriptionTemplateIdSaving = (state: State) => state.savingCompanyJobsJobDescriptionTemplateId;
export const getCompanyJobsJobDescriptionTemplateIdSavingError = (state: State) => state.savingCompanyJobsJobDescriptionTemplateIdError;
export const getCompanyJobsJobDescriptionTemplateIdSavingResponse = (state: State) =>
  state.savingCompanyJobsJobDescriptionTemplateIdPayload;
export const getJobDescriptionAsync = (state: State) => state.jobDescriptionAsync;
export const getEditingJobDescription = (state: State) => state.editing;
export const getSavingJobDescription = (state: State) => state.saving;
export const getCompanyLogoAsync = (state: State) => state.companyLogoAsync;
