import * as cloneDeep from 'lodash.clonedeep';

import { Template } from '../models';
import * as fromTemplateActions from '../actions';
import { SaveError } from '../../shared/models';

export interface State {
  loaded: boolean;
  loading: boolean;
  saving: boolean;
  publishing: boolean;
  copying: boolean;
  editing: boolean;
  deleting: boolean;
  template: Template;
  saveError: SaveError;
  loadingError: boolean;
  errorMessage: string;
  summary: any;
  loadingSummary: boolean;
}

const initialState: State = {
  loaded: false,
  loading: false,
  saving: false,
  publishing: false,
  copying: false,
  editing: false,
  deleting: false,
  template: null,
  saveError: null,
  loadingError: false,
  errorMessage: '',
  summary: null,
  loadingSummary: false
};

export function reducer(state = initialState, action: fromTemplateActions.TemplateActions): State {
  switch (action.type) {
    case fromTemplateActions.SAVE_TEMPLATE:
      return {
        ...state,
        saving: true
      };
    case fromTemplateActions.SAVE_TEMPLATE_SUCCESS:
      return {
        ...state,
        saving: false
      };
    case fromTemplateActions.SAVE_TEMPLATE_ERROR:
      return {
        ...state,
        saveError: cloneDeep(action.payload)
      };
    case fromTemplateActions.CLEAR_SAVE_TEMPLATE_ERROR:
      return {
        ...state,
        saveError: null
      };
    case fromTemplateActions.COPY_TEMPLATE:
      return {
        ...state,
        copying: true
      };
    case fromTemplateActions.COPY_TEMPLATE_SUCCESS:
      return {
        ...state,
        copying: false,
        template: cloneDeep(action.payload)
      };
    case fromTemplateActions.DELETE_TEMPLATE:
      return {
        ...state,
        deleting: true
      };
    case fromTemplateActions.DELETE_TEMPLATE_SUCCESS:
      return {
        ...state,
        deleting: false
      };
    case fromTemplateActions.LOAD_TEMPLATE:
      return {
        ...state,
        loading: true,
        loadingError: false,
        errorMessage: ''
      };
    case fromTemplateActions.LOAD_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        loadingError: false,
        errorMessage: '',
        template: action.payload
      };
    case fromTemplateActions.LOAD_TEMPLATE_ERROR:
      return {
        ...state,
        loading: false,
        loaded: false,
        loadingError: true,
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
    case fromTemplateActions.CLEAN_TEMPLATE_STATE:
      return initialState;
    default:
      return state;
  }
}

export const getTemplate = (state: State) => state.template;
export const getTemplateLoading = (state: State) => state.loading;
export const getTemplateLoadingError = (state: State) => state.loadingError;
export const getErrorMessage = (state: State) => state.errorMessage;
export const getTemplateAssignmentSummary = (state: State) => state.summary;
