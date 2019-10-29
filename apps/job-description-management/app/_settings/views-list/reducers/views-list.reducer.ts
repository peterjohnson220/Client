import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { FilterableName } from 'libs/core/interfaces';

import * as fromViewsListActions from '../actions/views-list.actions';

export interface State {
  viewsAsyncObj: AsyncStateObj<FilterableName[]>;
}

export const initialState: State = {
  viewsAsyncObj: generateDefaultAsyncStateObj<FilterableName[]>([])
};

export function reducer(state = initialState, action: fromViewsListActions.Actions): State {
  switch (action.type) {
    case fromViewsListActions.LOAD_JOB_DESCRIPTION_VIEWS:
      return {
        ...state,
        viewsAsyncObj: {...state.viewsAsyncObj, loading: true, loadingError: false}
      };
    case fromViewsListActions.LOAD_JOB_DESCRIPTION_VIEWS_SUCCESS:
      return {
        ...state,
        viewsAsyncObj: {...state.viewsAsyncObj, loading: false, obj: action.payload}
      };
    case fromViewsListActions.LOAD_JOB_DESCRIPTION_VIEWS_ERROR:
      return {
        ...state,
        viewsAsyncObj: {...state.viewsAsyncObj, loadingError: true, loading: false}
      };
    default:
      return state;
  }
}

export const getViewsAsyncObj = (state: State) => state.viewsAsyncObj;
