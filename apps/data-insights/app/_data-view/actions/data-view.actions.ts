import { Action } from '@ngrx/store';

import { CsvFileDelimiter, ExportFileExtension, SharedUserPermission } from 'libs/models/payfactors-api/reports/request';
import { UserDataView, SharedDataViewUser } from 'libs/ui/formula-editor';

export const GET_USER_DATA_VIEW = '[Data Insights / Data View] Get User Data View';
export const GET_USER_DATA_VIEW_SUCCESS = '[Data Insights / Data View] Get User Data View Success';
export const GET_USER_DATA_VIEW_ERROR = '[Data Insights / Data View] Get User Data View Error';
export const DELETE_USER_REPORT = '[Data Insights / Data View] Delete User Report';
export const DELETE_USER_REPORT_SUCCESS = '[Data Insights / Data View] Delete User Report Success';
export const EXPORT_USER_REPORT = '[Data Insights / Data View] Export User Report';
export const EXPORT_USER_REPORT_SUCCESS = '[Data Insights / Data View] Export User Report Success';
export const EXPORT_USER_REPORT_ERROR = '[Data Insights / Data View] Export User Report Error';
export const GET_EXPORTING_USER_REPORT = '[Data Insights / Data View] Get Exporting User Report';
export const GET_EXPORTING_USER_REPORT_SUCCESS = '[Data Insights / Data View] Get Exporting User Report Success';
export const GET_EXPORTING_USER_REPORT_ERROR = '[Data Insights / Data View] Get Exporting User Report Error';
export const EXPORTING_COMPLETE = '[Data Insights / Data View] Exporting Complete';
export const GET_SHAREABLE_USERS = '[Data Insights / Data View] Get Shareable Users';
export const GET_SHAREABLE_USERS_SUCCESS = '[Data Insights / Data View] Get Shareable Users Success';
export const GET_SHAREABLE_USERS_ERROR = '[Data Insights / Data View] Get Shareable Users Error';
export const SAVE_SHARE_PERMISSIONS = '[Data Insights / Data View] Save Share Permissions';
export const SAVE_SHARE_PERMISSIONS_SUCCESS = '[Data Insights / Data View] Save Share Permissions Success';
export const SAVE_SHARE_PERMISSIONS_ERROR = '[Data Insights / Data View] Save Share Permissions Error';
export const GET_SHARE_PERMISSIONS = '[Data Insights / Data View] Get Share Permissions';
export const GET_SHARE_PERMISSIONS_SUCCESS = '[Data Insights / Data View] Get Share Permissions Success';
export const GET_SHARE_PERMISSIONS_ERROR = '[Data Insights / Data View] Get Share Permissions Error';
export const REMOVE_SHARE_PERMISSION = '[Data Insights / Data View] Remove Share Permission';
export const REMOVE_SHARE_PERMISSION_SUCCESS = '[Data Insights / Data View] Remove Share Permission Success';
export const REMOVE_SHARE_PERMISSION_ERROR = '[Data Insights / Data View] Remove Share Permission Error';
export const EDIT_USER_REPORT = '[Data Insights / Data View] Edit User Report';
export const EDIT_USER_REPORT_SUCCESS = '[Data Insights / Data View] Edit User Report Success';
export const EDIT_USER_REPORT_ERROR = '[Data Insights / Data View] Edit User Report Error';
export const EDIT_USER_REPORT_CONFLICT_ERROR = '[Data Insights / Data View] Edit User Report Conflict';
export const DUPLICATE_USER_REPORT = '[Data Insights / Data View] Duplicate User Report';
export const DUPLICATE_USER_REPORT_SUCCESS = '[Data Insights / Data View] Duplicate User Report Success';
export const DUPLICATE_USER_REPORT_ERROR = '[Data Insights / Data View] Duplicate User Report Error';
export const DUPLICATE_USER_REPORT_CONFLICT_ERROR = '[Data Insights / Data View] Duplicate User Report Conflict';

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

  constructor(public payload: any) {}
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

  constructor(public payload: { fileExtension: ExportFileExtension, csvFileDelimiter: CsvFileDelimiter }) {}
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

export class GetShareableUsers implements Action {
  readonly type = GET_SHAREABLE_USERS;

  constructor() {}
}

export class GetShareableUsersSuccess implements Action {
  readonly type = GET_SHAREABLE_USERS_SUCCESS;

  constructor(public payload: SharedDataViewUser[]) {}
}

export class GetShareableUsersError implements Action {
  readonly type = GET_SHAREABLE_USERS_ERROR;

  constructor() {}
}

export class SaveSharePermissions implements Action {
  readonly type = SAVE_SHARE_PERMISSIONS;

  constructor(public payload: SharedDataViewUser[]) {}
}

export class SaveSharePermissionsSuccess implements Action {
  readonly type = SAVE_SHARE_PERMISSIONS_SUCCESS;

  constructor(public payload: SharedDataViewUser[]) {}
}

export class SaveSharePermissionsError implements Action {
  readonly type = SAVE_SHARE_PERMISSIONS_ERROR;

  constructor() {}
}

export class GetSharePermissions implements Action {
  readonly type = GET_SHARE_PERMISSIONS;

  constructor() {}
}

export class GetSharePermissionsSuccess implements Action {
  readonly type = GET_SHARE_PERMISSIONS_SUCCESS;

  constructor(public payload: SharedUserPermission[]) {}
}

export class GetSharePermissionsError implements Action {
  readonly type = GET_SHARE_PERMISSIONS_ERROR;

  constructor() {}
}

export class RemoveSharePermission implements Action {
  readonly type = REMOVE_SHARE_PERMISSION;

  constructor(public payload: SharedDataViewUser) {}
}

export class RemoveSharePermissionSuccess implements Action {
  readonly type = REMOVE_SHARE_PERMISSION_SUCCESS;

  constructor(public payload: SharedDataViewUser) {}
}

export class RemoveSharePermissionError implements Action {
  readonly type = REMOVE_SHARE_PERMISSION_ERROR;

  constructor() {}
}

export class EditUserReport implements Action {
  readonly type = EDIT_USER_REPORT;

  constructor(public payload: UserDataView) {}
}

export class EditUserReportSuccess implements Action {
  readonly type = EDIT_USER_REPORT_SUCCESS;

  constructor(public payload: UserDataView) {}
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

  constructor(public payload: UserDataView) {}
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

export type Actions
  = GetUserDataView
  | GetUserDataViewSuccess
  | GetUserDataViewError
  | DeleteUserReport
  | DeleteUserReportSuccess
  | ExportUserReport
  | ExportUserReportSuccess
  | ExportUserReportError
  | GetExportingUserReport
  | GetExportingUserReportSuccess
  | GetExportingUserReportError
  | ExportingComplete
  | GetShareableUsers
  | GetShareableUsersSuccess
  | GetShareableUsersError
  | SaveSharePermissions
  | SaveSharePermissionsError
  | SaveSharePermissionsSuccess
  | GetSharePermissions
  | GetSharePermissionsSuccess
  | GetSharePermissionsError
  | RemoveSharePermission
  | RemoveSharePermissionSuccess
  | RemoveSharePermissionError
  | EditUserReport
  | EditUserReportSuccess
  | EditUserReportError
  | EditUserReportConflict
  | DuplicateUserReport
  | DuplicateUserReportSuccess
  | DuplicateUserReportError
  | DuplicateUserReportConflict;
