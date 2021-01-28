import { Action } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';

import { DataViewFilter } from 'libs/models/payfactors-api';

import { BasicGridConfiguration } from '../models/basic-grid-configuration.model';

export const INIT_GRID = '[Basic Data Grid Feature / Basic Data Grid] Init Grid';
export const UPDATE_FILTERS = '[Basic Data Grid Feature / Basic Data Grid] Update Filters';
export const UPDATE_SORT = '[Basic Data Grid Feature / Basic Data Grid] Update Sort';
export const GET_DATA = '[Basic Data Grid Feature / Basic Data Grid] Get Data';
export const GET_DATA_SUCCESS = '[Basic Data Grid Feature / Basic Data Grid] Get Data Success';
export const GET_DATA_ERROR = '[Basic Data Grid Feature / Basic Data Grid] Get Data Error';
export const GET_MORE_DATA = '[Basic Data Grid Feature / Basic Data Grid] Get More Data';
export const GET_MORE_DATA_SUCCESS = '[Basic Data Grid Feature / Basic Data Grid] Get More Data Success';
export const GET_COUNT = '[Basic Data Grid Feature / Basic Data Grid] Get Count';
export const GET_COUNT_ERROR = '[Basic Data Grid Feature / Basic Data Grid] Get Count Error';
export const GET_COUNT_SUCCESS = '[Basic Data Grid Feature / Basic Data Grid] Get Count Success';

export class InitGrid implements Action {
  readonly type = INIT_GRID;
  constructor(public gridId: string, public configuration: BasicGridConfiguration) {}
}

export class UpdateFilters implements Action {
  readonly type = UPDATE_FILTERS;
  constructor(public gridId: string, public filters: DataViewFilter[]) {}
}

export class UpdateSort implements Action {
  readonly type = UPDATE_SORT;
  constructor(public gridId: string, public sort: SortDescriptor) {}
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

export class GetCount implements Action {
  readonly type = GET_COUNT;
  constructor(public gridId: string) {}
}

export class GetCountError implements Action {
  readonly type = GET_COUNT_ERROR;
  constructor(public gridId: string) {}
}

export class GetCountSuccess implements Action {
  readonly type = GET_COUNT_SUCCESS;
  constructor(public gridId: string, public payload: number) {}
}

export type Actions
  = InitGrid
  | UpdateFilters
  | UpdateSort
  | GetData
  | GetDataError
  | GetDataSuccess
  | GetMoreData
  | GetMoreDataSuccess
  | GetCount
  | GetCountError
  | GetCountSuccess;
