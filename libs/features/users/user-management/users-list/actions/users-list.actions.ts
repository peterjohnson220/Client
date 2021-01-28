import { Action } from '@ngrx/store';
import { CompanyDto } from 'libs/models';

export const LOAD_USERS = '[Company Admin / Users List] Load Users';
export const LOAD_USERS_ERROR = '[Company Admin / Users List] Load Users Error';
export const LOAD_USERS_SUCCESS = '[Company Admin / Users List] Load Users Success';
export const LOAD_COMPANY = '[Company Admin / Users List] Load Company';
export const LOAD_COMPANY_ERROR = '[Company Admin / Users List] Load Company Error';
export const LOAD_COMPANY_SUCCESS = '[Company Admin / Users List] Load Company Success';
export const UPDATE_SEARCH_TERM = '[Company Admin / Users List] Update Search Term';

export class LoadUsers implements Action {
  readonly type = LOAD_USERS;
  constructor(public payload: number) { }
}
export class LoadUsersError implements Action {
  readonly type = LOAD_USERS_ERROR;
}
export class LoadUsersSuccess implements Action {
  readonly type = LOAD_USERS_SUCCESS;
  constructor(public payload: any) { }
}
export class LoadCompany implements Action {
  readonly type = LOAD_COMPANY;
  constructor(public payload: number) { }
}
export class LoadCompanyError implements Action {
  readonly type = LOAD_COMPANY_ERROR;
}
export class LoadCompanySuccess implements Action {
  readonly type = LOAD_COMPANY_SUCCESS;
  constructor(public payload: CompanyDto) { }
}
export class UpdateUserSearchTerm implements Action {
  readonly type = UPDATE_SEARCH_TERM;
  constructor(public payload: string) { }
}

export type Actions
  = LoadUsers
  | LoadUsersError
  | LoadUsersSuccess
  | LoadCompany
  | LoadCompanyError
  | LoadCompanySuccess
  | UpdateUserSearchTerm;
