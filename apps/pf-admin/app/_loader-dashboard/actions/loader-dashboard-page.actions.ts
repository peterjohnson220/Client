import { Action } from '@ngrx/store';

import {CompanyFilePackagesResponse, CompositeDataLoadViewResponse} from 'libs/models/admin/loader-dashboard/response';

import {GridSearchPayload} from '../models';

export const INIT = '[Loaders Dashboard] Init';
export const GET_ALL_GRID_DATA = '[Loaders Dashboard] Get All Grids';
export const GET_COMPOSITE_LOAD_GRID_DATA = '[Loaders Dashboard] Get Composite Load Grid Data';
export const GET_COMPOSITE_LOAD_GRID_DATA_SUCCESS = '[Loaders Dashboard] Get Composite Load Grid Data Success';
export const GET_COMPOSITE_LOAD_GRID_DATA_ERROR = '[Loaders Dashboard] Get Composite Load Grid Data Error';
export const GET_FILE_PACKAGE_GRID_DATA = '[Loaders Dashboard] Get File Package Grid Data';
export const GET_FILE_PACKAGE_GRID_DATA_SUCCESS = '[Loaders Dashboard] Get File Package Grid Data Success';
export const GET_FILE_PACKAGE_GRID_DATA_ERROR = '[Loaders Dashboard] Get File Package Grid Data Error';
export const UPDATE_GRID_SEARCH_PAYLOAD = '[Loaders Dashboard] Update Grid Search Payload';

export class Init implements Action {
  readonly type = INIT;

  constructor(public payload: GridSearchPayload) {}
}

export class GetAllGridData implements Action {
  readonly type = GET_ALL_GRID_DATA;

  constructor(public payload: GridSearchPayload) {}
}

export class GetCompositeLoadGridData implements Action {
  readonly type = GET_COMPOSITE_LOAD_GRID_DATA;

  constructor(public payload: GridSearchPayload) {}
}

export class GetCompositeLoadGridDataSuccess implements Action {
  readonly type = GET_COMPOSITE_LOAD_GRID_DATA_SUCCESS;

  constructor(public payload: CompositeDataLoadViewResponse[]) {}
}

export class GetCompositeLoadGridDataError implements Action {
  readonly type = GET_COMPOSITE_LOAD_GRID_DATA_ERROR;
}

export class GetFilePackageGridData implements Action {
  readonly type = GET_FILE_PACKAGE_GRID_DATA;

  constructor(public payload: GridSearchPayload) {}
}

export class GetFilePackageGridDataSuccess implements Action {
  readonly type = GET_FILE_PACKAGE_GRID_DATA_SUCCESS;

  constructor(public payload: CompanyFilePackagesResponse[]) {}
}

export class GetFilePackageGridDataError implements Action {
  readonly type = GET_FILE_PACKAGE_GRID_DATA_ERROR;
}

export class UpdateGridSearchPayload implements Action {
  readonly type = UPDATE_GRID_SEARCH_PAYLOAD;

  constructor(public payload: { key: string, value: any }[]) {}
}

export type Actions
  = Init
  | GetAllGridData
  | GetCompositeLoadGridData
  | GetCompositeLoadGridDataSuccess
  | GetCompositeLoadGridDataError
  | GetFilePackageGridData
  | GetFilePackageGridDataSuccess
  | GetFilePackageGridDataError
  | UpdateGridSearchPayload;
