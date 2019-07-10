import { Action } from '@ngrx/store';

import { CompanyGridItem } from '../../_companies/models';

export const LOAD_YOY_DEFAULT_SCOPES_COMPANIES_LIST = '[Pf-Admin/YoyDefaultScopesCompaniesList] Load Yoy Default Scopes Companies';
export const LOAD_YOY_DEFAULT_SCOPES_COMPANIES_LIST_SUCCESS =
  '[Pf-Admin/YoyDefaultScopesCompaniesList] Load Yoy Default Scopes Companies Success';

export class LoadYoyDefaultScopesCompanies implements Action {
  readonly type = LOAD_YOY_DEFAULT_SCOPES_COMPANIES_LIST;
}

export class LoadYoyDefaultScopesCompaniesSuccess implements Action {
  readonly type = LOAD_YOY_DEFAULT_SCOPES_COMPANIES_LIST_SUCCESS;

  constructor(public payload: CompanyGridItem[]) {}
}

export type Actions
  = LoadYoyDefaultScopesCompanies
  | LoadYoyDefaultScopesCompaniesSuccess;
