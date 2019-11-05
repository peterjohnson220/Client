import { Action } from '@ngrx/store';
import { DataViewExport } from '../models';

export const GET_DATA_VIEW_EXPORTS = '[Notifications / Data Views Export] Get Data Views Exports';
export const GET_DATA_VIEW_EXPORTS_SUCCESS = '[Notifications / Data Views Export] Get Data Views Exports Success';
export const GET_DATA_VIEW_EXPORTS_ERROR = '[Notifications / Data Views Export] Get Data Views Exports Error';

export class GetDataViewExports implements Action {
  readonly type = GET_DATA_VIEW_EXPORTS;

  constructor() {}
}

export class GetDataViewExportsSuccess implements Action {
  readonly type = GET_DATA_VIEW_EXPORTS_SUCCESS;

  constructor(public payload: DataViewExport[]) {}
}

export class GetDataViewExportsError implements Action {
  readonly type = GET_DATA_VIEW_EXPORTS_ERROR;

  constructor() {}
}

export type Actions
  = GetDataViewExports
  | GetDataViewExportsSuccess
  | GetDataViewExportsError;
