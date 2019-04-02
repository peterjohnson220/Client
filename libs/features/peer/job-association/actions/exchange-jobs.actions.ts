import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeJobAssociation, ExchangeJob, CompanyJob, LoadAssociations } from '../models';
import { GenericMenuItem } from 'libs/models';

// container
export const LOAD = '[Peer Job Association/Exchange Jobs] Load';
export const RESET = '[Peer Job Association/Exchange Jobs] Reset';

// grid and search term
export const ADD_ASSOCIATION = '[Peer Job Association/Exchange Jobs] Add Association';
export const CLOSE_DETAIL_PANEL = '[Peer Job Association/Exchange Jobs] Close Detail Panel';
export const LOAD_EXCHANGE_JOBS  = '[Peer Job Association/Exchange Jobs] Load Exchange Jobs';
export const LOAD_EXCHANGE_JOBS_BAD_REQUEST = '[Peer Job Association/Exchange Jobs] Load Exchange Jobs Bad Request';
export const LOAD_EXCHANGE_JOBS_SUCCESS  = '[Peer Job Association/Exchange Jobs] Load Exchange Jobs Success';
export const LOAD_EXCHANGE_JOBS_ERROR  = '[Peer Job Association/Exchange Jobs] Load Exchange Jobs Error';
export const REMOVE_ASSOCIATION = '[Peer Job Association/Exchange Jobs] Remove Association';
export const SELECT_EXCHANGE_JOB = '[Peer Job Association/Exchange Jobs] Select Exchange Job';
export const TOGGLE_DETAIL_PANEL = '[Peer Job Association/Exchange Jobs] Toggle Detail Panel';
export const UPDATE_SEARCH_TERM  = '[Peer Job Association/Exchange Jobs] Update Search Term';

// previous associations
export const LOAD_PREVIOUS_ASSOCIATIONS = '[Peer Job Association/Exchange Jobs] Load Previous Associations';
export const LOAD_PREVIOUS_ASSOCIATIONS_SUCCESS = '[Peer Job Association/Exchange Jobs] Load Previous Associations Success';
export const LOAD_PREVIOUS_ASSOCIATIONS_ERROR = '[Peer Job Association/Exchange Jobs] Load Previous Associations Error';

// job family filter
export const SELECTED_JOB_FAMILIES_CHANGED = '[Peer Job Association Modal/Exchange Jobs] Selected Job Family Options has been changed';
export const CLEAR_SELECTED_JOB_FAMILIES = '[Peer Job Association/Exchange Jobs] Clear Selected Job Families';
export const LOAD_JOB_FAMILY_FILTER = '[Peer Job Association/Exchange Jobs] Load Exchange Jobs Family Filter';
export const LOAD_JOB_FAMILY_FILTER_SUCCESS = '[Peer Job Association/Exchange Jobs] Load Exchange Jobs Family Filter Success';
export const LOAD_JOB_FAMILY_FILTER_ERROR = '[Peer Job Association/Exchange Jobs] Load Exchange Jobs Family Filter Error';

// exchange filter
export const SELECTED_EXCHANGES_CHANGED = '[Peer Job Association Modal/Exchange Jobs] Selected Exchange Options has been changed';
export const CLEAR_SELECTED_EXCHANGES = '[Peer Job Association/Exchange Jobs] Clear Selected Exchanges';
export const LOAD_EXCHANGE_FILTER = '[Peer Job Association/Exchange Jobs] Load Exchange Jobs Exchange Filter';
export const LOAD_EXCHANGE_FILTER_SUCCESS = '[Peer Job Association/Exchange Jobs] Load Exchange Jobs Exchange Filter Success';
export const LOAD_EXCHANGE_FILTER_ERROR = '[Peer Job Association/Exchange Jobs] Load Exchange Jobs Exchange Filter Error';

// container
export class Load implements Action {
  readonly type = LOAD;
}

export class Reset implements Action {
  readonly type = RESET;
}

// grid and search term
export class AddAssociation implements Action {
  readonly type = ADD_ASSOCIATION;
  constructor(public payload: ExchangeJobAssociation) {}
}

export class CloseDetailPanel implements Action {
  readonly type = CLOSE_DETAIL_PANEL;
}

export class LoadExchangeJobs implements Action {
  readonly type = LOAD_EXCHANGE_JOBS;
}

export class LoadExchangeJobsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_JOBS_SUCCESS;
  constructor(public payload: GridDataResult) {}
}

export class RemoveAssociation implements Action {
  readonly type = REMOVE_ASSOCIATION;
  constructor(public exchangeId: number, public exchangeJobId: number, public companyJobId: number) {}
}

export class LoadExchangeJobsError implements Action {
  readonly type = LOAD_EXCHANGE_JOBS_ERROR;
  constructor(public payload: any) {}
}

export class LoadExchangeJobsBadRequest implements Action {
  readonly type = LOAD_EXCHANGE_JOBS_BAD_REQUEST;
  constructor(public payload: string) {}
}

// previous associations
export class LoadPreviousAssociations implements Action {
  readonly type = LOAD_PREVIOUS_ASSOCIATIONS;
  constructor(public payload: LoadAssociations) {}
}

export class LoadPreviousAssociationsSuccess implements Action {
  readonly type = LOAD_PREVIOUS_ASSOCIATIONS_SUCCESS;
  constructor(public payload: CompanyJob[]) {}
}

export class LoadPreviousAssociationsError implements Action {
  readonly type = LOAD_PREVIOUS_ASSOCIATIONS_ERROR;
}

export class SelectExchangeJob implements Action {
  readonly type = SELECT_EXCHANGE_JOB;
  constructor(public payload: ExchangeJob) {}
}

export class ToggleDetailPanel implements Action {
  readonly type = TOGGLE_DETAIL_PANEL;
}

export class UpdateSearchTerm implements Action {
  readonly type = UPDATE_SEARCH_TERM;
  constructor(public payload: string) {}
}

// job family filter
export class ClearSelectedJobFamilies implements Action {
  readonly type = CLEAR_SELECTED_JOB_FAMILIES;
}

export class SelectedJobFamiliesChanged  implements Action {
  readonly type = SELECTED_JOB_FAMILIES_CHANGED;
  constructor(public payload: GenericMenuItem[]) {}
}

export class LoadJobFamilyFilter implements Action {
  readonly type = LOAD_JOB_FAMILY_FILTER;
}

export class LoadJobFamilyFilterError implements Action {
  readonly type = LOAD_JOB_FAMILY_FILTER_ERROR;
}

export class LoadJobFamilyFilterSuccess implements Action {
  readonly type = LOAD_JOB_FAMILY_FILTER_SUCCESS;
  constructor(public payload: GenericMenuItem[]) {}
}

// exchange filter
export class ClearSelectedExchanges implements Action {
  readonly type = CLEAR_SELECTED_EXCHANGES;
}

export class SelectedExchangesChanged implements Action {
  readonly type = SELECTED_EXCHANGES_CHANGED;
  constructor(public payload: GenericMenuItem[]) {}
}

export class LoadExchangeFilter implements Action {
  readonly type = LOAD_EXCHANGE_FILTER;
}

export class LoadExchangeFilterError implements Action {
  readonly type = LOAD_EXCHANGE_FILTER_ERROR;
}

export class LoadExchangeFilterSuccess implements Action {
  readonly type = LOAD_EXCHANGE_FILTER_SUCCESS;
  constructor(public payload: GenericMenuItem[]) {}
}

export type Actions
  // container
  = Load
  | Reset

  // grid and search term
  | AddAssociation
  | CloseDetailPanel
  | LoadExchangeJobs
  | LoadExchangeJobsError
  | LoadExchangeJobsSuccess
  | RemoveAssociation
  | SelectExchangeJob
  | ToggleDetailPanel
  | UpdateSearchTerm

  // job family
  | ClearSelectedJobFamilies
  | SelectedJobFamiliesChanged
  | LoadJobFamilyFilter
  | LoadJobFamilyFilterError
  | LoadJobFamilyFilterSuccess

  // exchange
  | ClearSelectedExchanges
  | SelectedExchangesChanged
  | LoadExchangeFilter
  | LoadExchangeFilterError
  | LoadExchangeFilterSuccess

  // previous associations
  | LoadPreviousAssociations
  | LoadPreviousAssociationsSuccess
  | LoadPreviousAssociationsError
  | LoadExchangeJobsBadRequest;
