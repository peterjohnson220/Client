import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeJobAssociation } from '../models';

export const LOAD_EXCHANGE_JOBS  = '[Peer Job Association Modal/Exchange Jobs] Load Exchange Jobs';
export const LOAD_EXCHANGE_JOBS_SUCCESS  = '[Peer Job Association Modal/Exchange Jobs] Load Exchange Jobs Success';
export const LOAD_EXCHANGE_JOBS_ERROR  = '[Peer Job Association Modal/Exchange Jobs] Load Exchange Jobs Error';
export const UPDATE_SEARCH_TERM  = '[Peer Job Association Modal/Exchange Jobs] Update Search Term';
export const ADD_ASSOCIATION = '[Peer Job Association Modal/Exchange Jobs] Add Association';

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

export type Actions
  = LoadExchangeJobs
  | LoadExchangeJobsSuccess
  | LoadExchangeJobsError
  | UpdateSearchTerm
  | AddAssociation;
