import cloneDeep from 'lodash/cloneDeep';

import * as fromJobDescriptionListActions from '../actions/job-description-list.actions';

export interface State {
  creatingJobDescription: boolean;
  creatingJobDescriptionError: boolean;
  creatingJobDescriptionDraft: boolean;
  creatingJobDescriptionDraftError: boolean;
  savingCompanyJobsJobDescriptionTemplateId: boolean;
  savingCompanyJobsJobDescriptionTemplateIdError: boolean;
  savingCompanyJobsJobDescriptionTemplateIdErrorMessage: string;
  savingCompanyJobsJobDescriptionTemplateIdSuccess: boolean;
}

export const initialState: State = {
  creatingJobDescription: false,
  creatingJobDescriptionError: false,
  creatingJobDescriptionDraft: false,
  creatingJobDescriptionDraftError: false,
  savingCompanyJobsJobDescriptionTemplateId: false,
  savingCompanyJobsJobDescriptionTemplateIdError: false,
  savingCompanyJobsJobDescriptionTemplateIdErrorMessage: '',
  savingCompanyJobsJobDescriptionTemplateIdSuccess: false,
};

export function reducer(state = initialState, action: fromJobDescriptionListActions.Actions): State {
  switch (action.type) {
    case fromJobDescriptionListActions.CREATE_JOB_DESCRIPTION:
      return {
        ...state,
        creatingJobDescription: true
      };
    case fromJobDescriptionListActions.CREATE_JOB_DESCRIPTION_ERROR:
      return {
        ...state,
        creatingJobDescription: false,
        creatingJobDescriptionError: true
      };
    case fromJobDescriptionListActions.CREATE_JOB_DESCRIPTION_SUCCESS:
      return {
        ...state,
        creatingJobDescription: false,
        creatingJobDescriptionError: false
      };
    case fromJobDescriptionListActions.CREATE_JOB_DESCRIPTION_DRAFT:
      return {
        ...state,
        creatingJobDescriptionDraft: true,
        creatingJobDescriptionError: false
      };
    case fromJobDescriptionListActions.CREATE_JOB_DESCRIPTION_DRAFT_ERROR:
      return {
        ...state,
        creatingJobDescriptionDraft: false,
        creatingJobDescriptionDraftError: true
      };
    case fromJobDescriptionListActions.CREATE_JOB_DESCRIPTION_DRAFT_SUCCESS:
      return {
        ...state,
        creatingJobDescriptionDraft: false,
        creatingJobDescriptionDraftError: false
      };
    case fromJobDescriptionListActions.SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID:
      return {
        ...state,
        savingCompanyJobsJobDescriptionTemplateId: true,
        savingCompanyJobsJobDescriptionTemplateIdError: false,
        savingCompanyJobsJobDescriptionTemplateIdErrorMessage: '',
        savingCompanyJobsJobDescriptionTemplateIdSuccess: false
      };
    case fromJobDescriptionListActions.SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID_ERROR:
      return {
        ...state,
        savingCompanyJobsJobDescriptionTemplateId: false,
        savingCompanyJobsJobDescriptionTemplateIdError: true,
        savingCompanyJobsJobDescriptionTemplateIdSuccess: false,
        savingCompanyJobsJobDescriptionTemplateIdErrorMessage: action.payload.errorMessage
      };
    case fromJobDescriptionListActions.SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID_SUCCESS:
      return {
        ...state,
        savingCompanyJobsJobDescriptionTemplateId: false,
        savingCompanyJobsJobDescriptionTemplateIdError: false,
        savingCompanyJobsJobDescriptionTemplateIdSuccess: true
      };
    case fromJobDescriptionListActions.CLEAR_JOB_DESCRIPTION_STATE:
      return initialState;
    default:
      return state;
  }
}

export const getJobDescriptionCreating = (state: State) => state.creatingJobDescription;
export const getJobDescriptionCreatingError = (state: State) => state.creatingJobDescriptionError;
export const getJobDescriptionDraftCreating = (state: State) => state.creatingJobDescriptionDraft;
export const getJobDescriptionDraftCreatingError = (state: State) => state.creatingJobDescriptionDraftError;
export const getCompanyJobsJobDescriptionTemplateIdSaving = (state: State) => state.savingCompanyJobsJobDescriptionTemplateId;
export const getCompanyJobsJobDescriptionTemplateIdSavingError = (state: State) => state.savingCompanyJobsJobDescriptionTemplateIdError;
export const getCompanyJobsJobDescriptionTemplateIdSavingErrorMessage = (state: State) => state.savingCompanyJobsJobDescriptionTemplateIdErrorMessage;
export const getCompanyJobsJobDescriptionTemplateIdSavingSuccess = (state: State) => state.savingCompanyJobsJobDescriptionTemplateIdSuccess;
