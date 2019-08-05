import { Action } from '@ngrx/store';

import { Entity, SaveUserWorkbookModalData } from '../models';

export const GET_BASE_ENTITIES = '[Data Insights / Data View] Get Base Entities';
export const GET_BASE_ENTITIES_SUCCESS = '[Data Insights / Data View] Get Base Entities Success';
export const GET_BASE_ENTITIES_ERROR = '[Data Insights / Data View] Get Base Entities Error';
export const SAVE_USER_REPORT = '[Data Insights / Data View] Save User Report';
export const SAVE_USER_REPORT_SUCCESS = '[Data Insights / Data View] Save User Report Success';
export const SAVE_USER_REPORT_ERROR = '[Data Insights / Data View] Save User Report Error';
export const SAVE_USER_REPORT_CONFLICT_ERROR = '[Data Insights / Data View] Save User Report Conflict';

export class GetBaseEntities implements Action {
  readonly type = GET_BASE_ENTITIES;

  constructor() {}
}

export class GetBaseEntitiesSuccess implements Action {
  readonly type = GET_BASE_ENTITIES_SUCCESS;

  constructor(public payload: Entity[]) {}
}

export class GetBaseEntitiesError implements Action {
  readonly type = GET_BASE_ENTITIES_ERROR;

  constructor() {}
}

export class SaveUserReport implements Action {
  readonly type = SAVE_USER_REPORT;

  constructor(public payload: SaveUserWorkbookModalData) {}
}

export class SaveUserReportSuccess implements Action {
  readonly type = SAVE_USER_REPORT_SUCCESS;

  constructor(public payload: { dataViewId: number }) {}
}

export class SaveUserReportError implements Action {
  readonly type = SAVE_USER_REPORT_ERROR;

  constructor() {}
}

export class SaveUserReportConflict implements Action {
  readonly type = SAVE_USER_REPORT_CONFLICT_ERROR;

  constructor() {}
}


export type Actions
  = GetBaseEntities
  | GetBaseEntitiesSuccess
  | GetBaseEntitiesError
  | SaveUserReport
  | SaveUserReportSuccess
  | SaveUserReportError
  | SaveUserReportConflict;
