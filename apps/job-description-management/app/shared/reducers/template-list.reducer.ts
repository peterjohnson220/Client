import * as cloneDeep from 'lodash.clonedeep';

import { TemplateListItem } from 'libs/models';

import * as fromTemplateListActions from '../../shared/actions/template-list.actions';

export interface State {
  loadingTemplateList: boolean;
  loadingTemplateListError: boolean;
  templateList: TemplateListItem[];
}

export const initialState: State = {
  loadingTemplateList: false,
  loadingTemplateListError: false,
  templateList: []
};

export function reducer(state = initialState, action: fromTemplateListActions.Actions): State {
  switch (action.type) {
    case fromTemplateListActions.LOAD_TEMPLATE_LIST:
      return {
        ...state,
        loadingTemplateList: true
      };
    case fromTemplateListActions.LOAD_TEMPLATE_LIST_ERROR:
      return {
        ...state,
        loadingTemplateList: false,
        loadingTemplateListError: true
      };
    case fromTemplateListActions.LOAD_TEMPLATE_LIST_SUCCESS:
      return {
        ...state,
        loadingTemplateList: false,
        templateList: cloneDeep(action.payload)
      };
    case fromTemplateListActions.LOAD_TEMPLATE_LIST_BY_COMPANY_ID:
        return {
        ...state,
          loadingTemplateList: true
        };
    case fromTemplateListActions.LOAD_TEMPLATE_LIST_BY_COMPANY_ID_SUCCESS:
      return {
        ...state,
        loadingTemplateList: false,
        templateList: cloneDeep(action.payload)
      };
    default:
      return state;
  }
}

export const getTemplateList = (state: State) => state.templateList;
export const getTemplateListLoading = (state: State) => state.loadingTemplateList;
export const getTemplateListLoadingError = (state: State) => state.loadingTemplateListError;
