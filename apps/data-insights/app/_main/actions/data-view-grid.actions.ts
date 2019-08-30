import { Action } from '@ngrx/store';

import { Field } from '../models';

export const GET_DATA = '[Data Insights / Data View Grid] Get Data';
export const GET_DATA_SUCCESS = '[Data Insights / Data View Grid] Get Data Success';
export const GET_DATA_ERROR = '[Data Insights / Data View Grid] Get Data Error';
export const GET_MORE_DATA = '[Data Insights / Data View Grid] Get More Data';
export const GET_MORE_DATA_SUCCESS = '[Data Insights / Data View Grid] Get More Data Success';
export const SORT_FIELD = '[Data Insights / Data View Grid] Sort Field';
export const RESET_SORT_FIELD = '[Data Insights / Data View Grid] Reset Sort Field';

export class GetData implements Action {
  readonly type = GET_DATA;

  constructor() {}
}

export class GetDataSuccess implements Action {
  readonly type = GET_DATA_SUCCESS;

  constructor(public payload: any[]) {}
}

export class GetDataError implements Action {
  readonly type = GET_DATA_ERROR;

  constructor() {}
}

export class GetMoreData implements Action {
  readonly type = GET_MORE_DATA;

  constructor() {}
}

export class GetMoreDataSuccess implements Action {
  readonly type = GET_MORE_DATA_SUCCESS;

  constructor(public payload: any[]) {}
}

export class SortField implements Action {
  readonly type = SORT_FIELD;

  constructor(public payload: { field: Field, dir: string }) {}
}

export class ResetSortField implements Action {
  readonly type = RESET_SORT_FIELD;

  constructor() {}
}

export type Actions
  = GetData
  | GetDataSuccess
  | GetDataError
  | GetMoreData
  | GetMoreDataSuccess
  | SortField
  | ResetSortField;
