import { Action } from '@ngrx/store';
import {ColumnNameRequestModel} from '../../models';


export const GET_COLUMN_NAMES = '[Data Management / File Upload Page] Get Column Names';
export const GET_COLUMN_NAMES_SUCCESS = '[Data Management / File Upload Page] Get Column Names Success';
export const GET_COLUMN_NAMES_ERROR = '[Data Management / File Upload Page] Get Column Names Error';


export class GetColumnNames implements Action {
  readonly type = GET_COLUMN_NAMES;

  constructor(public payload: ColumnNameRequestModel) { }
}

export class GetColumnNamesSuccess implements Action {
  readonly type = GET_COLUMN_NAMES_SUCCESS;

  constructor(public payload: ColumnNameRequestModel) { }
}

export class GetColumnNamesError implements Action {
  readonly type = GET_COLUMN_NAMES_ERROR;
}



export type Actions
  = GetColumnNames
  | GetColumnNamesSuccess
  | GetColumnNamesError;
