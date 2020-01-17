import { Action } from '@ngrx/store';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State as KendoState } from '@progress/kendo-data-query';

import { GetListAreaColumnsRequest, SaveListAreaColumnsRequest } from 'libs/models/payfactors-api/user-profile/request';
import { ListAreaColumn } from 'libs/models/common';

export const LOAD_JOB_RANGE_MODELING_GRID = '[Structures / Job Range Modeling Grid] Load Job Range Modeling Grid';
export const LOAD_JOB_RANGE_MODELING_GRID_ERROR = '[Structures / Job Range Modeling Grid] Load Job Range Modeling Grid Error';
export const LOAD_JOB_RANGE_MODELING_GRID_SUCCESS = '[Structures / Job Range Modeling Grid] Load Job Range Modeling Grid Success';
export const LOAD_LIST_AREA_COLUMNS = '[Structures / Job Range Modeling Grid] Load List Area Columns';
export const LOAD_LIST_AREA_COLUMNS_ERROR = '[Structures / Job Range Modeling Grid] Load List Area Columns Error';
export const LOAD_LIST_AREA_COLUMNS_SUCCESS = '[Structures / Job Range Modeling Grid] Load List Area Columns Success';
export const REORDER_LIST_AREA_COLUMNS = '[Structures / Job Range Modeling Grid] Reorder List Area Columns';
export const REORDER_LIST_AREA_COLUMNS_SUCCESS = '[Structures / Job Range Modeling Grid] Reorder List Area Columns Success';
export const SAVE_LIST_AREA_COLUMNS = '[Structures / Job Range Modeling Grid] Save List Area Columns';
export const SAVE_LIST_AREA_COLUMNS_ERROR = '[Structures / Job Range Modeling Grid] Save List Area Columns Error';
export const SAVE_LIST_AREA_COLUMNS_SUCCESS = '[Structures / Job Range Modeling Grid] Save List Area Columns Success';
export const UPDATE_GRID_STATE = '[Structures / Job Range Modeling Grid] Update Grid State';
export const UPDATE_LIST_AREA_COLUMN = '[Structures / Job Range Modeling Grid] Update List Area Column';

export class LoadJobRangeModelingGrid implements Action {
  readonly type = LOAD_JOB_RANGE_MODELING_GRID;

  constructor(public payload: number) {}
}

export class LoadJobRangeModelingGridError implements Action {
  readonly type = LOAD_JOB_RANGE_MODELING_GRID_ERROR;
}

export class LoadJobRangeModelingGridSuccess implements Action {
  readonly type = LOAD_JOB_RANGE_MODELING_GRID_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadListAreaColumns implements Action {
  readonly type = LOAD_LIST_AREA_COLUMNS;

  constructor(public payload: GetListAreaColumnsRequest) {}
}

export class LoadListAreaColumnsError implements Action {
  readonly type = LOAD_LIST_AREA_COLUMNS_ERROR;
}

export class LoadListAreaColumnsSuccess implements Action {
  readonly type = LOAD_LIST_AREA_COLUMNS_SUCCESS;

  constructor(public payload: ListAreaColumn[]) {}
}

export class ReorderListAreaColumns implements Action {
  readonly type = REORDER_LIST_AREA_COLUMNS;
}

export class ReorderListAreaColumnsSuccess implements Action {
  readonly type = REORDER_LIST_AREA_COLUMNS_SUCCESS;
}

export class SaveListAreaColumns implements Action {
  readonly type = SAVE_LIST_AREA_COLUMNS;

  constructor(public payload: SaveListAreaColumnsRequest) {}
}

export class SaveListAreaColumnsError implements Action {
  readonly type = SAVE_LIST_AREA_COLUMNS_ERROR;
}

export class SaveListAreaColumnsSuccess implements Action {
  readonly type = SAVE_LIST_AREA_COLUMNS_SUCCESS;
}

export class UpdateGridState implements Action {
  readonly type = UPDATE_GRID_STATE;

  constructor(public payload: KendoState) {}
}

export class UpdateListAreaColumn implements Action {
  readonly type = UPDATE_LIST_AREA_COLUMN;

  constructor(public payload: { ListAreaColumn: ListAreaColumn, Checked: boolean }) {}
}

export type Actions
  = LoadJobRangeModelingGrid
  | LoadJobRangeModelingGridError
  | LoadJobRangeModelingGridSuccess
  | LoadListAreaColumns
  | LoadListAreaColumnsError
  | LoadListAreaColumnsSuccess
  | ReorderListAreaColumns
  | ReorderListAreaColumnsSuccess
  | SaveListAreaColumns
  | SaveListAreaColumnsError
  | SaveListAreaColumnsSuccess
  | UpdateGridState
  | UpdateListAreaColumn;
