import { Action } from '@ngrx/store';

import { DataViewFilter } from 'libs/models/payfactors-api';

import { BasicGridConfiguration } from '../models/basic-grid-configuration.model';

export const INIT_GRID = '[Pay Market Management / Basic Data Grid] Init Grid';
export const UPDATE_FILTERS = '[Pay Market Management / Basic Data Grid] Update Filters';
export const GET_DATA = '[Pay Market Management / Basic Data Grid] Get Data';
export const GET_DATA_SUCCESS = '[Pay Market Management / Basic Data Grid] Get Data Success';
export const GET_DATA_ERROR = '[Pay Market Management / Basic Data Grid] Get Data Error';
export const GET_MORE_DATA = '[Pay Market Management / Basic Data Grid] Get More Data';
export const GET_MORE_DATA_SUCCESS = '[Pay Market Management / Basic Data Grid] Get More Data Success';

export class InitGrid implements Action {
  readonly type = INIT_GRID;
  constructor(public gridId: string, public configuration: BasicGridConfiguration) {}
}

export class UpdateFilters implements Action {
  readonly type = UPDATE_FILTERS;
  constructor(public gridId: string, public filters: DataViewFilter[]) {}
}

export class GetData implements Action {
  readonly type = GET_DATA;
  constructor(public gridId: string) {}
}

export class GetDataSuccess implements Action {
  readonly type = GET_DATA_SUCCESS;
  constructor(public gridId: string, public data: any[]) {}
}

export class GetDataError implements Action {
  readonly type = GET_DATA_ERROR;
  constructor(public gridId: string) {}
}

export class GetMoreData implements Action {
  readonly type = GET_MORE_DATA;
  constructor(public gridId: string) {}
}

export class GetMoreDataSuccess implements Action {
  readonly type = GET_MORE_DATA_SUCCESS;
  constructor(public gridId: string, public data: any[]) {}
}

export type Actions
  = InitGrid
  | UpdateFilters
  | GetData
  | GetDataError
  | GetDataSuccess
  | GetMoreData
  | GetMoreDataSuccess;
