import * as cloneDeep from 'lodash.clonedeep';

import * as fromTemplateListActions from '../actions';
import { TemplateListItem } from '../models';

export interface State {
  loaded: boolean;
  loading: boolean;
  entities: TemplateListItem[];
}

const initialState: State = {
  loaded: false,
  loading: false,
  entities: []
};

export function reducer(state = initialState, action: fromTemplateListActions.TemplateListActions): State {
  switch (action.type) {
    case fromTemplateListActions.LOAD_TEMPLATE_LIST:
      return {
        ...state,
        loading: true
      };
    case fromTemplateListActions.LOAD_TEMPLATE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        entities: cloneDeep(action.payload)
      };
    default:
      return state;
  }
}

export const getTemplateListLoaded = (state: State) => state.loaded;
export const getTemplateListLoading = (state: State) => state.loading;
export const getTemplateList = (state: State) => state.entities;
