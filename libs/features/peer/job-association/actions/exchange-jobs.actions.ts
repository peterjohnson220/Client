import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeJobAssociation, ExchangeJob } from '../models';
import { GenericMenuItem } from 'libs/models';

// grid and search term
export const LOAD_EXCHANGE_JOBS  = '[Peer Job Association Modal/Exchange Jobs] Load Exchange Jobs';
export const LOAD_EXCHANGE_JOBS_SUCCESS  = '[Peer Job Association Modal/Exchange Jobs] Load Exchange Jobs Success';
export const LOAD_EXCHANGE_JOBS_ERROR  = '[Peer Job Association Modal/Exchange Jobs] Load Exchange Jobs Error';
export const UPDATE_SEARCH_TERM  = '[Peer Job Association Modal/Exchange Jobs] Update Search Term';
export const ADD_ASSOCIATION = '[Peer Job Association Modal/Exchange Jobs] Add Association';
export const REMOVE_ASSOCIATION = '[Peer Job Association Modal/Exchange Jobs] Remove Association';
export const SELECT_EXCHANGE_JOB = '[Peer Job Association Modal/Exchange Jobs] Select Exchange Job';
export const TOGGLE_DETAIL_PANEL = '[Peer Job Association Modal/Exchange Jobs] Toggle Detail Panel';
export const CLOSE_DETAIL_PANEL = '[Peer Job Association Modal/Exchange Jobs] Close Detail Panel';

// job family filter
export const LOAD_JOB_FAMILY_FILTER = '[Peer Job Association Modal/Exchange Jobs] Load Exchange Jobs Family Filter';
export const LOAD_JOB_FAMILY_FILTER_SUCCESS = '[Peer Job Association Modal/Exchange Jobs] Load Exchange Jobs Family Filter Success';
export const LOAD_JOB_FAMILY_FILTER_ERROR = '[Peer Job Association Modal/Exchange Jobs] Load Exchange Jobs Family Filter Error';
export const TOGGLE_JOB_FAMILY_FILTER = '[Peer Job Association Modal/Exchange Jobs] Toggle Job Family Filter';
export const TOGGLE_JOB_FAMILY_FILTER_SELECTION = '[Peer Job Association Modal/Exchange Jobs] Toggle Job Family Filter Selection';
export const CLEAR_SELECTED_JOB_FAMILIES = '[Peer Job Association Modal/Exchange Jobs] Clear Selected Job Families';

// grid and search term
export class LoadExchangeJobs implements Action {
  readonly type = LOAD_EXCHANGE_JOBS;
}

export class LoadExchangeJobsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_JOBS_SUCCESS;
  constructor(public payload: GridDataResult) {}
}

export class LoadExchangeJobsError implements Action {
  readonly type = LOAD_EXCHANGE_JOBS_ERROR;
}

export class UpdateSearchTerm implements Action {
  readonly type = UPDATE_SEARCH_TERM;
  constructor(public payload: string) {}
}

export class AddAssociation implements Action {
  readonly type = ADD_ASSOCIATION;
  constructor(public payload: ExchangeJobAssociation) {}
}

export class RemoveAssociation implements Action {
  readonly type = REMOVE_ASSOCIATION;
  constructor(public exchangeId: number, public exchangeJobId: number, public companyJobId: number) {}
}

export class SelectExchangeJob implements Action {
  readonly type = SELECT_EXCHANGE_JOB;
  constructor(public payload: ExchangeJob) {}
}

export class ToggleDetailPanel implements Action {
  readonly type = TOGGLE_DETAIL_PANEL;
}

export class CloseDetailPanel implements Action {
  readonly type = CLOSE_DETAIL_PANEL;
}

// job family filter
export class LoadJobFamilyFilter implements Action {
  readonly type = LOAD_JOB_FAMILY_FILTER;
}

export class LoadJobFamilyFilterSuccess implements Action {
  readonly type = LOAD_JOB_FAMILY_FILTER_SUCCESS;
  constructor(public payload: GenericMenuItem[]) {}
}

export class LoadJobFamilyFilterError implements Action {
  readonly type = LOAD_JOB_FAMILY_FILTER_ERROR;
}

export class ToggleJobFamilyFilter implements Action {
  readonly type = TOGGLE_JOB_FAMILY_FILTER;
  constructor(public payload?: boolean) {}
}

export class ToggleJobFamilyFilterSelection implements Action {
  readonly type = TOGGLE_JOB_FAMILY_FILTER_SELECTION;
  constructor(public payload: GenericMenuItem) {}
}

export class ClearSelectedJobFamilies implements Action {
  readonly type = CLEAR_SELECTED_JOB_FAMILIES;
}

export type Actions
  = LoadExchangeJobs
  | LoadExchangeJobsSuccess
  | LoadExchangeJobsError
  | UpdateSearchTerm
  | AddAssociation
  | RemoveAssociation
  | SelectExchangeJob
  | ToggleDetailPanel
  | CloseDetailPanel
  // job family
  | LoadJobFamilyFilter
  | LoadJobFamilyFilterSuccess
  | LoadJobFamilyFilterError
  | ToggleJobFamilyFilter
  | ToggleJobFamilyFilterSelection
  | ClearSelectedJobFamilies;
