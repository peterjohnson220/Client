import * as cloneDeep from 'lodash.clonedeep';

import { SaveError } from '../../shared/models/save-error.model';
import { Template } from '../models';
import * as fromTemplateActions from '../actions/template.actions';

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
  saveError: null
};

export function reducer(state = initialState, action: fromTemplateActions.Actions): State {
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
    default:
      return state;
  }
}
