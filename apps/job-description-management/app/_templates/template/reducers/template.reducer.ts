import cloneDeep from 'lodash/cloneDeep';

import { Template } from 'libs/models/jdm/template';

import * as fromTemplateActions from '../actions';
import * as section from './template-section.reducer';
import * as control from './template-control.reducer';
import { SaveError } from 'libs/features/job-description-management';

export interface State {
  loading: boolean;
  saving: boolean;
  publishing: boolean;
  copying: boolean;
  editing: boolean;
  deleting: boolean;
  template: Template;
  summary: any;
  loadingSummary: boolean;
  error: boolean;
  errorMessage: string;
  saveError: SaveError;
  assigningError: string;
}

const initialState: State = {
  loading: false,
  saving: false,
  publishing: false,
  copying: false,
  editing: false,
  deleting: false,
  template: null,
  saveError: null,
  error: false,
  summary: null,
  loadingSummary: false,
  errorMessage: '',
  assigningError: ''
};

export function reducer(state = initialState, action: fromTemplateActions.TemplateActions): State {
  switch (action.type) {
    case fromTemplateActions.SAVE_TEMPLATE:
      return {
        ...state,
        saving: true,
        saveError: null
      };
    case fromTemplateActions.SAVE_TEMPLATE_SUCCESS:
      return {
        ...state,
        saving: false,
        template: action.payload.template
      };
    case fromTemplateActions.SAVE_TEMPLATE_NAME_SUCCESS:
      const templateCopy = cloneDeep(state.template);
      templateCopy.TemplateName = action.payload;

      return {
        ...state,
        template: templateCopy
      };
    case fromTemplateActions.SAVE_TEMPLATE_ERROR:
      return {
        ...state,
        saveError: cloneDeep(action.payload.error)
      };
    case fromTemplateActions.CLEAR_SAVE_TEMPLATE_ERROR:
      return {
        ...state,
        saveError: null
      };
    case fromTemplateActions.COPY_TEMPLATE:
      return {
        ...state,
        copying: true,
        loading: false,
        error: false
      };
    case fromTemplateActions.COPY_TEMPLATE_SUCCESS:
      return {
        ...state,
        copying: false,
        error: false,
        template: cloneDeep(action.payload)
      };
    case fromTemplateActions.COPY_TEMPLATE_ERROR:
      return {
        ...state,
        copying: false,
        error: true,
        errorMessage: action.payload.errorMessage,
        template: null
      };
    case fromTemplateActions.LOAD_TEMPLATE:
      return {
        ...state,
        loading: true,
        error: false,
        saveError: null
      };
    case fromTemplateActions.LOAD_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        saving: false,
        publishing: false,
        copying: false,
        error: false,
        editing: action.payload.TemplateStatus === 'Draft',
        saveError: null,
        template: action.payload
      };
    case fromTemplateActions.LOAD_TEMPLATE_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.payload.errorMessage
      };
    case fromTemplateActions.LOAD_TEMPLATE_ASSIGNMENT_SUMMARY:
      return {
        ...state,
        loadingSummary: true
      };
    case fromTemplateActions.LOAD_TEMPLATE_ASSIGNMENT_SUMMARY_SUCCESS:
      return {
        ...state,
        loadingSummary: false,
        summary: action.payload
      };
    case fromTemplateActions.PUBLISH_TEMPLATE:
      return {
        ...state,
        publishing: true,
        error: false,
      };
    case fromTemplateActions.PUBLISH_TEMPLATE_SUCCESS:
      const publishedTemplate = cloneDeep(state.template);
      publishedTemplate.TemplateStatus = 'Published';

      return {
        ...state,
        publishing: false,
        error: false,
        template: publishedTemplate
      };
    case fromTemplateActions.PUBLISH_TEMPLATE_ERROR:
      return {
        ...state,
        publishing: false,
        error: true,
        errorMessage: action.payload.errorMessage
      };
    case fromTemplateActions.BEGIN_EDITING:
      return {
        ...state,
        editing: true
      };
    case fromTemplateActions.ADD_SECTION:
    case fromTemplateActions.EDIT_SECTION:
    case fromTemplateActions.DELETE_SECTION:
    case fromTemplateActions.MOVE_SECTION:
      return section.reducer(state, action);
    case fromTemplateActions.ADD_CONTROL_TO_SECTION:
    case fromTemplateActions.ADD_DATA_ROW_TO_CONTROL:
    case fromTemplateActions.MOVE_CONTROL_TO_SECTION:
    case fromTemplateActions.UPDATE_CONTROL_DATA:
    case fromTemplateActions.UPDATE_CONTROL_LABEL:
    case fromTemplateActions.DELETE_CONTROL_FROM_SECTION:
    case fromTemplateActions.MOVE_CONTROL:
    case fromTemplateActions.REORDER_CONTROL_DATA:
    case fromTemplateActions.REMOVE_CONTROL_DATA_ROW:
    case fromTemplateActions.REPLACE_CONTROL_DATA:
    case fromTemplateActions.UPDATE_CONTROL_ADDITIONAL_PROPERTIES:
      return control.reducer(state, action);
    case fromTemplateActions.REPLACE_JOB_INFORMATION_FIELDS: {
      const newTemplate = cloneDeep(state.template);
      newTemplate.JobInformationFields = action.payload.jobInformationFields;
      return {
        ...state,
        template: newTemplate
      };
    }
    case fromTemplateActions.SET_JOB_HAS_TEMPLATE_MESSAGE:
      return {
        ...state,
        assigningError: action.payload.message
      };
    case fromTemplateActions.UPDATE_TEMPLATE_LOGO: {
        const newTemplate = cloneDeep(state.template);
        newTemplate.CompanyLogo = action.payload.logoUrl;
        return {
          ...state,
          template: newTemplate
        };
    }
    case fromTemplateActions.CLEAN_TEMPLATE_STATE:
      return initialState;
    default:
      return state;
  }
}

export const getTemplate = (state: State) => state.template;
export const getTemplateLoading = (state: State) => state.loading;
export const getTemplateEditing = (state: State) => state.editing;
export const getErrorMessage = (state: State) => state.saveError.ErrorMessage;
export const getTemplateAssignmentSummary = (state: State) => state.summary;
export const getTemplateSaving = (state: State) => state.saving;
export const getTemplatePublishing = (state: State) => state.publishing;
export const getTemplateCopying = (state: State) => state.copying;
export const getTemplateError = (state: State) => state.error;
export const getTemplateErrorMessage = (state: State) => state.errorMessage;
export const getTemplateSaveError = (state: State) => state.saveError;
export const getTemplateAssigningError = (state: State) => state.assigningError;
export const getLoadingSummary = (state: State) => state.loadingSummary;
