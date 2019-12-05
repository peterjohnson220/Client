import { Action } from '@ngrx/store';

import { SortDescriptor } from '@progress/kendo-data-query';

import { Field } from '../models';

export const GET_DATA = '[Data Insights / Data View Grid] Get Data';
export const GET_DATA_SUCCESS = '[Data Insights / Data View Grid] Get Data Success';
export const GET_DATA_ERROR = '[Data Insights / Data View Grid] Get Data Error';
export const GET_MORE_DATA = '[Data Insights / Data View Grid] Get More Data';
export const GET_MORE_DATA_SUCCESS = '[Data Insights / Data View Grid] Get More Data Success';
export const SORT_FIELD = '[Data Insights / Data View Grid] Sort Field';
export const SAVE_SORT_DESCRIPTOR = '[Data Insights / Data View Grid] Save Sort Descriptor';
export const SAVE_SORT_DESCRIPTOR_SUCCESS = '[Data Insights / Data View Grid] Save Sort Descriptor Success';
export const SAVE_SORT_DESCRIPTOR_ERROR = '[Data Insights / Data View Grid] Save Sort Descriptor Error';
export const SET_SORT_DESCRIPTOR = '[Data Insights / Data View Grid] Set Sort Descriptor';

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

  constructor(public payload: { field: Field, sortDesc: SortDescriptor }) {}
}

export class SaveSortDescriptor implements Action {
  readonly type = SAVE_SORT_DESCRIPTOR;

  constructor(public payload: SortDescriptor) {}
}

export class SaveSortDescriptorSuccess implements Action {
  readonly type = SAVE_SORT_DESCRIPTOR_SUCCESS;

  constructor() {}
}

export class SaveSortDescriptorError implements Action {
  readonly type = SAVE_SORT_DESCRIPTOR_ERROR;

  constructor() {}
}

export class SetSortDescriptor implements Action {
  readonly type = SET_SORT_DESCRIPTOR;

  constructor(public payload: SortDescriptor) {}
}

export type Actions
  = GetData
  | GetDataSuccess
  | GetDataError
  | GetMoreData
  | GetMoreDataSuccess
  | SortField
  | SaveSortDescriptor
  | SaveSortDescriptorSuccess
  | SaveSortDescriptorError
  | SetSortDescriptor;
