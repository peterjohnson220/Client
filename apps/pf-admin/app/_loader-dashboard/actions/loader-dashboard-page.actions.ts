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
export const TOGGLE_SHOW_HIDE_TEST_COMPANIES = '[Loaders Dashboard] Toggle Show Hide Test Companies';
export const UPDATE_GRID_SEARCH_PAYLOAD = '[Loaders Dashboard] Update Grid Search Payload';
export const REDROP_EXPORTED_SOURCE_FILE = '[Loaders Dashboard] Redrop Exported Source File';
export const REDROP_EXPORTED_SOURCE_FILE_SUCCESS = '[Loaders Dashboard] Redrop Exported Source File Success';
export const REDROP_EXPORTED_SOURCE_FILE_ERROR = '[Loaders Dashboard] Redrop Exported Source File Error';

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

export class ToggleShowHideTestCompanies implements Action {
  readonly type = TOGGLE_SHOW_HIDE_TEST_COMPANIES;
}

export class UpdateGridSearchPayload implements Action {
  readonly type = UPDATE_GRID_SEARCH_PAYLOAD;

  constructor(public payload: { key: string, value: any }[]) {}
}

export class RedropExportedSourceFile implements Action {
  readonly type = REDROP_EXPORTED_SOURCE_FILE;

  constructor(public payload: number) {}
}

export class RedropExportedSourceFileSuccess implements Action {
  readonly type = REDROP_EXPORTED_SOURCE_FILE_SUCCESS;
}

export class RedropExportedSourceFileError implements Action {
  readonly type = REDROP_EXPORTED_SOURCE_FILE_ERROR;
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
  | ToggleShowHideTestCompanies
  | UpdateGridSearchPayload
  | RedropExportedSourceFile
  | RedropExportedSourceFileSuccess
  | RedropExportedSourceFileError;
