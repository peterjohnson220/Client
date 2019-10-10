import * as cloneDeep from 'lodash.clonedeep';

import * as fromJobDescriptionActions from '../actions/job-description.actions';
import { SaveJobDescriptionTemplateIdSucessModel } from '../models';

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
  savingCompanyJobsJobDescriptionTemplateIdPayload: null
};

export function reducer(state = initialState, action: fromJobDescriptionActions.Actions): State {
  switch (action.type) {
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
