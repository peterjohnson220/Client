import cloneDeep from 'lodash/cloneDeep';

import { TemplateListItem } from 'libs/models';

import * as fromTemplateListActions from '../actions';

export interface State {
  loaded: boolean;
  loading: boolean;
  deleting: boolean;
  entities: TemplateListItem[];
  error: boolean;
  errorMessage: string;
}

const initialState: State = {
  loaded: false,
  loading: false,
  deleting: false,
  entities: [],
  error: false,
  errorMessage: ''
};

export function reducer(state = initialState, action: fromTemplateListActions.TemplateListActions): State {
  switch (action.type) {
    case fromTemplateListActions.LOAD_TEMPLATE_LIST:
      return {
        ...state,
        loading: true,
        deleting: false,
        loaded: false,
        error: false
      };
    case fromTemplateListActions.LOAD_TEMPLATE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        entities: cloneDeep(action.payload),
        error: false
      };
    case fromTemplateListActions.LOAD_TEMPLATE_LIST_ERROR:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: true,
        errorMessage: action.payload.errorMessage
      };
    case fromTemplateListActions.DELETE_TEMPLATE:
      return {
        ...state,
        deleting: true,
        loading: false,
        error: false,
      };
    case fromTemplateListActions.DELETE_TEMPLATE_SUCCESS:
      return {
        ...state,
        deleting: false,
        error: false,
      };
    case fromTemplateListActions.DELETE_TEMPLATE_ERROR:
      return {
        ...state,
        deleting: false,
        error: true,
        errorMessage: action.payload.errorMessage,
      };
    default:
      return state;
  }
}

export const getTemplateListLoaded = (state: State) => state.loaded;
export const getTemplateListLoading = (state: State) => state.loading;
export const getTemplateDeleting = (state: State) => state.deleting;
export const getTemplateList = (state: State) => state.entities;
export const getTemplateListError = (state: State) => state.error;
export const getTemplateListErrorMessage = (state: State) => state.errorMessage;
