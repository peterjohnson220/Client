import * as cloneDeep from 'lodash.clonedeep';

import { JdmListFilter } from 'libs/models/user-profile';

import * as fromUserFilterActions from '../actions/user-filter.actions';

import { MessageHelper } from '../../shared/helpers/message-helper';

export interface State {
  addingUserFilter: boolean;
  addingUserFilterError: boolean;
  addingUserFilterSuccess: boolean;
  deletingUserFilter: boolean;
  deletingUserFilterError: boolean;
  loadingUserFilterList: boolean;
  loadingUserFilterListError: boolean;
  loadingUserFilterListErrorMessage: string;
  userFilterList: JdmListFilter[];
}

export const initialState: State = {
  addingUserFilter: false,
  addingUserFilterError: false,
  addingUserFilterSuccess: false,
  deletingUserFilter: false,
  deletingUserFilterError: false,
  loadingUserFilterList: false,
  loadingUserFilterListError: false,
  loadingUserFilterListErrorMessage: null,
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
        addingUserFilterError: true
      };
    case fromUserFilterActions.ADD_USER_FILTER_SUCCESS:
      const newUserFilterList = cloneDeep(state.userFilterList);

      newUserFilterList.push(action.payload);
      newUserFilterList.slice(0);

      return {
        ...state,
        addingUserFilter: false,
        addingUserFilterSuccess: true,
        userFilterList: newUserFilterList
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
        deletingUserFilterError: true
      };
    case fromUserFilterActions.DELETE_USER_FILTER_SUCCESS:
      return {
        ...state,
        deletingUserFilter: false,
        userFilterList: state.userFilterList.filter(lf => lf.Id !== action.payload)
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
        loadingUserFilterListError: true,
        loadingUserFilterListErrorMessage: MessageHelper.buildErrorMessage('There was an error loading your saved filters.')
      };
    case fromUserFilterActions.LOAD_USER_FILTER_LIST_SUCCESS:
      return {
        ...state,
        loadingUserFilterList: false,
        userFilterList: cloneDeep(action.payload)
      };
    default:
      return state;
  }
}

export const getUserFilterAdding = (state: State) => state.addingUserFilter;
export const getUserFilterAddingError = (state: State) => state.addingUserFilterError;
export const getUserFilterAddingSuccess = (state: State) => state.addingUserFilterSuccess;
export const getUserFilterDeleting = (state: State) => state.deletingUserFilter;
export const getUserFilterDeletingError = (state: State) => state.deletingUserFilterError;
export const getUserFilterList = (state: State) => state.userFilterList;
export const getUserFilterLoading = (state: State) => state.loadingUserFilterList;
export const getUserFilterLoadingError = (state: State) => state.loadingUserFilterListError;
export const getUserFilterLoadingErrorMessage = (state: State) => state.loadingUserFilterListErrorMessage;
