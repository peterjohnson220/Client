import * as cloneDeep from 'lodash.clonedeep';

import { JdmListFilter } from 'libs/models/user-profile';
import { MessageHelper } from 'libs/core';

import * as fromUserFilterActions from '../actions/user-filter.actions';

export interface State {
  addingUserFilter: boolean;
  deletingUserFilter: boolean;
  loadingUserFilterList: boolean;
  userFilterList: JdmListFilter[];
  error: boolean;
  errorMessage: string;
}

export const initialState: State = {
  addingUserFilter: false,
  error: false,
  deletingUserFilter: false,
  loadingUserFilterList: false,
  errorMessage: null,
  userFilterList: []
};

export function reducer(state = initialState, action: fromUserFilterActions.Actions): State {
  switch (action.type) {
    case fromUserFilterActions.ADD_USER_FILTER:
      return {
        ...state,
        addingUserFilter: true
      };
    case fromUserFilterActions.ADD_USER_FILTER_ERROR:
      return {
        ...state,
        addingUserFilter: false,
        error: true,
        errorMessage: MessageHelper.buildErrorMessage('There was an error saving this filter.')
      };
    case fromUserFilterActions.ADD_USER_FILTER_SUCCESS:
      const newUserFilterList = cloneDeep(state.userFilterList);

      newUserFilterList.push(action.payload);
      newUserFilterList.slice(0);

      return {
        ...state,
        addingUserFilter: false,
        userFilterList: newUserFilterList,
        error: false
      };
    case fromUserFilterActions.DELETE_USER_FILTER:
      return {
        ...state,
        deletingUserFilter: true
      };
    case fromUserFilterActions.DELETE_USER_FILTER_ERROR:
      return {
        ...state,
        deletingUserFilter: false,
        error: true,
        errorMessage: MessageHelper.buildErrorMessage('There was an error deleting this filter.')
      };
    case fromUserFilterActions.DELETE_USER_FILTER_SUCCESS:
      return {
        ...state,
        deletingUserFilter: false,
        userFilterList: state.userFilterList.filter(lf => lf.Id !== action.payload),
        error: false
      };
    case fromUserFilterActions.LOAD_USER_FILTER_LIST:
      return {
        ...state,
        loadingUserFilterList: true
      };
    case fromUserFilterActions.LOAD_USER_FILTER_LIST_ERROR:
      return {
        ...state,
        loadingUserFilterList: false,
        error: true,
        errorMessage: MessageHelper.buildErrorMessage('There was an error loading your saved filters.')
      };
    case fromUserFilterActions.LOAD_USER_FILTER_LIST_SUCCESS:
      return {
        ...state,
        loadingUserFilterList: false,
        userFilterList: cloneDeep(action.payload),
        error: false
      };
    default:
      return state;
  }
}

export const getUserFilterAdding = (state: State) => state.addingUserFilter;
export const getUserFilterDeleting = (state: State) => state.deletingUserFilter;
export const getUserFilterList = (state: State) => state.userFilterList;
export const getUserFilterLoading = (state: State) => state.loadingUserFilterList;
export const getUserFilterError = (state: State) => state.error;
export const getUserFilterErrorMessage = (state: State) => state.errorMessage;
