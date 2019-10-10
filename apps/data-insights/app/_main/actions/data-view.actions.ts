import { Action } from '@ngrx/store';

import { Entity, SaveUserWorkbookModalData, UserDataView, Field } from '../models';

export const GET_BASE_ENTITIES = '[Data Insights / Data View] Get Base Entities';
export const GET_BASE_ENTITIES_SUCCESS = '[Data Insights / Data View] Get Base Entities Success';
export const GET_BASE_ENTITIES_ERROR = '[Data Insights / Data View] Get Base Entities Error';
export const SAVE_USER_REPORT = '[Data Insights / Data View] Save User Report';
export const SAVE_USER_REPORT_SUCCESS = '[Data Insights / Data View] Save User Report Success';
export const SAVE_USER_REPORT_ERROR = '[Data Insights / Data View] Save User Report Error';
export const SAVE_USER_REPORT_CONFLICT_ERROR = '[Data Insights / Data View] Save User Report Conflict';
export const GET_USER_DATA_VIEW = '[Data Insights / Data View] Get User Data View';
export const GET_USER_DATA_VIEW_SUCCESS = '[Data Insights / Data View] Get User Data View Success';
export const GET_USER_DATA_VIEW_ERROR = '[Data Insights / Data View] Get User Data View Error';
export const EDIT_USER_REPORT = '[Data Insights / Data View] Edit User Report';
export const EDIT_USER_REPORT_SUCCESS = '[Data Insights / Data View] Edit User Report Success';
export const EDIT_USER_REPORT_ERROR = '[Data Insights / Data View] Edit User Report Error';
export const EDIT_USER_REPORT_CONFLICT_ERROR = '[Data Insights / Data View] Edit User Report Conflict';
export const DUPLICATE_USER_REPORT = '[Data Insights / Data View] Duplicate User Report';
export const DUPLICATE_USER_REPORT_SUCCESS = '[Data Insights / Data View] Duplicate User Report Success';
export const DUPLICATE_USER_REPORT_ERROR = '[Data Insights / Data View] Duplicate User Report Error';
export const DUPLICATE_USER_REPORT_CONFLICT_ERROR = '[Data Insights / Data View] Duplicate User Report Conflict';
export const DELETE_USER_REPORT = '[Data Insights / Data View] Delete User Report';
export const DELETE_USER_REPORT_SUCCESS = '[Data Insights / Data View] Delete User Report Success';
export const EXPORT_USER_REPORT = '[Data Insights / Data View] Export User Report';
export const EXPORT_USER_REPORT_SUCCESS = '[Data Insights / Data View] Export User Report Success';
export const EXPORT_USER_REPORT_ERROR = '[Data Insights / Data View] Export User Report Error';
export const GET_EXPORTING_USER_REPORT = '[Data Insights / Data View] Get Exporting User Report';
export const GET_EXPORTING_USER_REPORT_SUCCESS = '[Data Insights / Data View] Get Exporting User Report Success';
export const GET_EXPORTING_USER_REPORT_ERROR = '[Data Insights / Data View] Get Exporting User Report Error';
export const EXPORTING_COMPLETE = '[Data Insights / Data View] Exporting Complete';

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

export class GetUserDataView implements Action {
  readonly type = GET_USER_DATA_VIEW;

  constructor(public payload: { dataViewId: number }) {}
}

export class GetUserDataViewSuccess implements Action {
  readonly type = GET_USER_DATA_VIEW_SUCCESS;

  constructor(public payload: UserDataView) {}
}

export class GetUserDataViewError implements Action {
  readonly type = GET_USER_DATA_VIEW_ERROR;

  constructor() {}
}

export class EditUserReport implements Action {
  readonly type = EDIT_USER_REPORT;

  constructor(public payload: SaveUserWorkbookModalData) {}
}

export class EditUserReportSuccess implements Action {
  readonly type = EDIT_USER_REPORT_SUCCESS;

  constructor(public payload: SaveUserWorkbookModalData) {}
}

export class EditUserReportError implements Action {
  readonly type = EDIT_USER_REPORT_ERROR;

  constructor() {}
}

export class EditUserReportConflict implements Action {
  readonly type = EDIT_USER_REPORT_CONFLICT_ERROR;

  constructor() {}
}

export class DuplicateUserReport implements Action {
  readonly type = DUPLICATE_USER_REPORT;

  constructor(public payload: SaveUserWorkbookModalData) {}
}

export class DuplicateUserReportSuccess implements Action {
  readonly type = DUPLICATE_USER_REPORT_SUCCESS;

  constructor(public payload: { dataViewId: number }) {}
}

export class DuplicateUserReportError implements Action {
  readonly type = DUPLICATE_USER_REPORT_ERROR;

  constructor() {}
}

export class DuplicateUserReportConflict implements Action {
  readonly type = DUPLICATE_USER_REPORT_CONFLICT_ERROR;

  constructor() {}
}

export class DeleteUserReport implements Action {
  readonly type = DELETE_USER_REPORT;

  constructor() {}
}

export class DeleteUserReportSuccess implements Action {
  readonly type = DELETE_USER_REPORT_SUCCESS;

  constructor() {}
}

export class ExportUserReport implements Action {
  readonly type = EXPORT_USER_REPORT;

  constructor() {}
}

export class ExportUserReportSuccess implements Action {
  readonly type = EXPORT_USER_REPORT_SUCCESS;

  constructor(public payload: any) {}
}

export class ExportUserReportError implements Action {
  readonly type = EXPORT_USER_REPORT_ERROR;

  constructor() {}
}

export class GetExportingUserReport implements Action {
  readonly type = GET_EXPORTING_USER_REPORT;

  constructor(public payload: { dataViewId: number }) {}
}

export class GetExportingUserReportSuccess implements Action {
  readonly type = GET_EXPORTING_USER_REPORT_SUCCESS;

  constructor(public payload: any) {}
}

export class GetExportingUserReportError implements Action {
  readonly type = GET_EXPORTING_USER_REPORT_ERROR;

  constructor() {}
}

export class ExportingComplete implements Action {
  readonly type = EXPORTING_COMPLETE;

  constructor() {}
}

export type Actions
  = GetBaseEntities
  | GetBaseEntitiesSuccess
  | GetBaseEntitiesError
  | SaveUserReport
  | SaveUserReportSuccess
  | SaveUserReportError
  | SaveUserReportConflict
  | GetUserDataView
  | GetUserDataViewSuccess
  | GetUserDataViewError
  | EditUserReport
  | EditUserReportSuccess
  | EditUserReportError
  | EditUserReportConflict
  | DuplicateUserReport
  | DuplicateUserReportSuccess
  | DuplicateUserReportError
  | DuplicateUserReportConflict
  | DeleteUserReport
  | DeleteUserReportSuccess
  | ExportUserReport
  | ExportUserReportSuccess
  | ExportUserReportError
  | GetExportingUserReport
  | GetExportingUserReportSuccess
  | GetExportingUserReportError
  | ExportingComplete;
