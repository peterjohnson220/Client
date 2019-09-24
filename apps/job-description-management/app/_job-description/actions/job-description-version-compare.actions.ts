import { Action } from '@ngrx/store';

import { LoadJobDescriptionComparisonRequest } from 'libs/models/payfactors-api/job-description/request';

import { JobDescriptionHistoryListItem } from '../models';

export const LOAD_COMPANY_LOGO = '[JobDescription/JobDescriptionVersionCompare] Load Company Logo';
export const LOAD_COMPANY_LOGO_SUCCESS = '[JobDescription/JobDescriptionVersionCompare] Load Company Logo Success';
export const LOAD_COMPANY_LOGO_ERROR = '[JobDescription/JobDescriptionVersionCompare] Load Company Logo Error';
export const LOAD_JOB_DESCRIPTION_COMPARISON =
  '[JobDescription/JobDescriptionVersionCompare] Loading Job Description Comparison';
export const LOAD_JOB_DESCRIPTION_COMPARISON_SUCCESS =
  '[JobDescription/JobDescriptionVersionCompare] Load Job Description Comparison Success';
export const LOAD_JOB_DESCRIPTION_COMPARISON_ERROR = '[JobDescription/JobDescriptionVersionCompare] Load Job Description Comparison Error';
export const LOAD_JOB_DESCRIPTION_HISTORY_LIST_SUCCESS =
  '[JobDescription/JobDescriptionVersionCompare] Load Job Description History List Success';
export const SET_SELECTED_SOURCE_HISTORY_LIST_ITEM = '[JobDescription/JobDescriptionVersionCompare] Set Selected Source History List Item';
export const SET_SELECTED_COMPARISON_HISTORY_LIST_ITEM =
  '[JobDescription/JobDescriptionVersionCompare] Set Selected Comparison History List Item';

export class LoadCompanyLogo implements Action {
  readonly type = LOAD_COMPANY_LOGO;
  constructor(public payload: number) {}
}
export class LoadCompanyLogoSuccess implements Action {
  readonly type = LOAD_COMPANY_LOGO_SUCCESS;
  constructor(public payload: string) {}
}
export class LoadCompanyLogoError implements Action {
  readonly type = LOAD_COMPANY_LOGO_ERROR;
}
export class LoadJobDescriptionComparison implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_COMPARISON;
  constructor(public payload: LoadJobDescriptionComparisonRequest) { }
}
export class LoadJobDescriptionComparisonSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_COMPARISON_SUCCESS;
  constructor(public payload: any) { }
}
export class LoadJobDescriptionComparisonError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_COMPARISON_ERROR;
}
export class LoadJobDescriptionHistoryListSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_HISTORY_LIST_SUCCESS;
  constructor(public payload: any) { }
}
export class SetSelectedSourceHistoryListItem implements Action {
  readonly type = SET_SELECTED_SOURCE_HISTORY_LIST_ITEM;
  constructor(public payload: JobDescriptionHistoryListItem) {}
}
export class SetSelectedComparisonHistoryListItem implements Action {
  readonly type = SET_SELECTED_COMPARISON_HISTORY_LIST_ITEM;
  constructor(public payload: JobDescriptionHistoryListItem) {}
}

export type Actions
  = LoadCompanyLogo
  | LoadCompanyLogoSuccess
  | LoadCompanyLogoError
  | LoadJobDescriptionComparison
  | LoadJobDescriptionComparisonSuccess
  | LoadJobDescriptionComparisonError
  | LoadJobDescriptionHistoryListSuccess
  | SetSelectedSourceHistoryListItem
  | SetSelectedComparisonHistoryListItem;
