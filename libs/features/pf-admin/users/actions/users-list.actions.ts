import { Action } from '@ngrx/store';
import { UserGridItem } from '../models';
import { CompanyDto } from '../../../../models/company';
import { UserResponse } from '../../../../models/payfactors-api/user/response';

export const LOAD_USERS  = '[Pf-Admin / Users] Load Pf - Admin Users';
export const LOAD_USERS_ERROR  = '[Pf-Admin / Users] Load Pf - Admin Users Error';
export const LOAD_USERS_SUCCESS  = '[Pf-Admin / Users] Load Pf - Admin Users Success';
export const LOAD_COMPANY  = '[Pf-Admin / Users] Load Pf - Admin Company';
export const LOAD_COMPANY_ERROR  = '[Pf-Admin / Users] Load Pf - Admin Company Error';
export const LOAD_COMPANY_SUCCESS  = '[Pf-Admin / Users] Load Pf - Admin Company Success';
export const UPDATE_SEARCH_TERM  = '[Pf-Admin / Users] Update Search Term';

export class LoadUsers implements Action {
  readonly type = LOAD_USERS;
  constructor(public payload: number) {}
}
export class LoadUsersError implements Action {
  readonly type = LOAD_USERS_ERROR;
}
export class LoadUsersSuccess implements Action {
  readonly type = LOAD_USERS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadCompany implements Action {
  readonly type = LOAD_COMPANY;
  constructor(public payload: number) {}
}
export class LoadCompanyError implements Action {
  readonly type = LOAD_COMPANY_ERROR;
}
export class LoadCompanySuccess implements Action {
  readonly type = LOAD_COMPANY_SUCCESS;
  constructor(public payload: CompanyDto) {}
}
export class UpdateUserSearchTerm implements Action {
  readonly type = UPDATE_SEARCH_TERM;
  constructor(public payload: string) {}
}

export type Actions
  = LoadUsers
  | LoadUsersError
  | LoadUsersSuccess
  | LoadCompany
  | LoadCompanyError
  | LoadCompanySuccess
  | UpdateUserSearchTerm;
