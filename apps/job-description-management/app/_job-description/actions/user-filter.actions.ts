import { Action } from '@ngrx/store';

import { JdmListFilter } from 'libs/models/user-profile';
import { AddUserFilterRequest } from 'libs/models/payfactors-api/user-profile/request';

export const ADD_USER_FILTER = '[job-description-management / User Filter List] Add User Filter';
export const ADD_USER_FILTER_ERROR = '[job-description-management / User Filter List] Add User Filter Error';
export const ADD_USER_FILTER_SUCCESS = '[job-description-management / User Filter List] Add User Filter Success';
export const DELETE_USER_FILTER = '[job-description-management / User Filter List] Delete User Filter';
export const DELETE_USER_FILTER_ERROR = '[job-description-management / User Filter List] Delete User Filter Error';
export const DELETE_USER_FILTER_SUCCESS = '[job-description-management / User Filter List] Delete User Filter Success';
export const LOAD_USER_FILTER_LIST = '[job-description-management / User Filter List] Load User Filter List';
export const LOAD_USER_FILTER_LIST_ERROR = '[job-description-management / User Filter List] Load User Filter List Error';
export const LOAD_USER_FILTER_LIST_SUCCESS = '[job-description-management / User Filter List] Load User Filter List Success';

export class AddUserFilter implements Action {
  readonly type = ADD_USER_FILTER;

  constructor(public payload: AddUserFilterRequest) {}
}

export class AddUserFilterError implements Action {
  readonly type = ADD_USER_FILTER_ERROR;
}

export class AddUserFilterSuccess implements Action {
  readonly type = ADD_USER_FILTER_SUCCESS;

  constructor(public payload: JdmListFilter) {}
}

export class DeleteUserFilter implements Action {
  readonly type = DELETE_USER_FILTER;

  constructor(public payload: string) {}
}

export class DeleteUserFilterError implements Action {
  readonly type = DELETE_USER_FILTER_ERROR;
}

export class DeleteUserFilterSuccess implements Action {
  readonly type = DELETE_USER_FILTER_SUCCESS;

  constructor(public payload: string) {}
}

export class LoadUserFilterList implements Action {
  readonly type = LOAD_USER_FILTER_LIST;
}

export class LoadUserFilterListError implements Action {
  readonly type = LOAD_USER_FILTER_LIST_ERROR;

  constructor(public payload: any) {}
}

export class LoadUserFilterListSuccess implements Action {
  readonly type = LOAD_USER_FILTER_LIST_SUCCESS;

  constructor(public payload: JdmListFilter[]) {}
}

export type Actions
  = AddUserFilter
  | AddUserFilterError
  | AddUserFilterSuccess
  | DeleteUserFilter
  | DeleteUserFilterError
  | DeleteUserFilterSuccess
  | LoadUserFilterList
  | LoadUserFilterListError
  | LoadUserFilterListSuccess;
