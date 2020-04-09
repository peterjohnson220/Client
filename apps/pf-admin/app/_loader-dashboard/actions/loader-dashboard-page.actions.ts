import { Action } from '@ngrx/store';

import {CompositeDataLoadViewResponse} from 'libs/models/admin/loader-dashboard';

import {GridSearchPayload} from '../models';

export const INIT = '[Loaders Dashboard] Init';
export const GET_GRID_DATA = '[Loaders Dashboard] Get Grid';
export const GET_GRID_DATA_SUCCESS = '[Loaders Dashboard] Get Grid Success';
export const GET_GRID_DATA_ERROR = '[Loaders Dashboard] Get Grid Error';
export const UPDATE_GRID_SEARCH_PAYLOAD = '[Loaders Dashboard] Update Grid Search Payload';

export class Init implements Action {
  readonly type = INIT;

  constructor(public payload: GridSearchPayload) {}
}

export class GetGridData implements Action {
  readonly type = GET_GRID_DATA;

  constructor(public payload: GridSearchPayload) {}
}

export class GetGridDataSuccess implements Action {
  readonly type = GET_GRID_DATA_SUCCESS;

  constructor(public payload: CompositeDataLoadViewResponse[]) {}
}

export class GetGridDataError implements Action {
  readonly type = GET_GRID_DATA_ERROR;
}

export class UpdateGridSearchPayload implements Action {
  readonly type = UPDATE_GRID_SEARCH_PAYLOAD;

  constructor(public payload: { key: string, value: any }[]) {}
}

export type Actions
  = Init
  | GetGridData
  | GetGridDataSuccess
  | GetGridDataError
  | UpdateGridSearchPayload;
