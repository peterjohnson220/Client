import { Action } from '@ngrx/store';

export const ADD_DATA = '[Project Add Data/Add Survey Data Page] Add Data Cuts to Project';
export const ADD_DATA_SUCCESS = '[Project Add Data/Add Survey Data Page] Add Data Cuts to Project Success';
export const ADD_DATA_ERROR = '[Project Add Data/Add Survey Data Page] Add Data Cuts to Project Error';

export class AddData implements Action {
  readonly type = ADD_DATA;

  constructor(public payload: boolean) {}
}

export class AddDataSuccess implements Action {
  readonly type = ADD_DATA_SUCCESS;

  constructor(public payload: number[]) {}
}

export class AddDataError implements Action {
  readonly type = ADD_DATA_ERROR;

  constructor() {}
}


export type Actions
  = AddData
  | AddDataSuccess
  | AddDataError;
