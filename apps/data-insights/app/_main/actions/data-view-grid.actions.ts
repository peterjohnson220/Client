import { Action } from '@ngrx/store';

export const GET_DATA = '[Data Insights / Data View Grid] Get Data';
export const GET_DATA_SUCCESS = '[Data Insights / Data View Grid] Get Data Success';
export const GET_DATA_ERROR = '[Data Insights / Data View Grid] Get Data Error';
export const GET_MORE_DATA = '[Data Insights / Data View Grid] Get More Data';
export const GET_MORE_DATA_SUCCESS = '[Data Insights / Data View Grid] Get More Data Success';

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

export type Actions
  = GetData
  | GetDataSuccess
  | GetDataError
  | GetMoreData
  | GetMoreDataSuccess;
