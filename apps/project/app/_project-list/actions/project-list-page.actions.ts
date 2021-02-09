import { Action } from '@ngrx/store';
import { BaseShareModalPayload } from 'libs/models/share-modal/bulk-project-share-request';

export const TOGGLE_PIN_ON_DASHBOARD = '[Project List Page] Toggle Pin On Dashboard';
export const TOGGLE_PIN_ON_DASHBOARD_SUCCESS = '[Project List Page] Toggle Pin On Dashboard Success';
export const COPY_PROJECT = '[Project List Page] Copy Project';
export const COPY_PROJECT_SUCCESS = '[Project List Page] Copy Project Success';
export const DELETE_PROJECTS = '[Project List Page] Deletes Project Success';
export const DELETE_PROJECTS_SUCCESS = '[Project List Page] Delete Projects Success';
export const BULK_PROJECT_SHARE = '[Project List Page] Bulk Project Share';
export const BULK_PROJECT_SHARE_SUCCESS = '[Project List Page] Bulk Project Share Success';
export const BULK_PROJECT_SHARE_ERROR = '[Project List Page] Bulk Project Share Error';
export const SAVE_SINGLE_PROJECT_SHARE_ID = '[Project List Page] Save Single Project Share Id';
export const CLEAR_SINGLE_PROJECT_SHARE_ID = '[Project List Page] Clear Single Project Share Id';

export class TogglePinOnDashboard implements Action {
  readonly type = TOGGLE_PIN_ON_DASHBOARD;
  constructor(public payload: number) {}
}

export class TogglePinOnDashboardSuccess implements Action {
  readonly type = TOGGLE_PIN_ON_DASHBOARD_SUCCESS;
  constructor() {}
}

export class CopyProject implements Action {
  readonly type = COPY_PROJECT;
  constructor(public payload: number) {}
}

export class CopyProjectSuccess implements Action {
  readonly type = COPY_PROJECT_SUCCESS;
  constructor() {}
}

export class DeleteProjects implements Action {
  readonly type = DELETE_PROJECTS;
  constructor(public payload: any[]) {}
}

export class DeleteProjectsSuccess implements Action {
  readonly type = DELETE_PROJECTS_SUCCESS;
  constructor() {}
}

export class BulkProjectShare implements Action {
  readonly type = BULK_PROJECT_SHARE;

  constructor(public payload: BaseShareModalPayload, public customMessage: string) {}
}

export class BulkProjectShareSuccess implements Action {
  readonly type = BULK_PROJECT_SHARE_SUCCESS;

  constructor() {}
}

export class BulkProjectShareError implements Action {
  readonly type = BULK_PROJECT_SHARE_ERROR;

  constructor() {}
}

export class SaveSingleProjectShareId implements Action {
  readonly type = SAVE_SINGLE_PROJECT_SHARE_ID;

  constructor(public payload: number) {
  }
}

export class ClearSingleProjectShareId implements Action {
  readonly type = CLEAR_SINGLE_PROJECT_SHARE_ID;

  constructor() {
  }
}

export type ProjectListPageActions
  = TogglePinOnDashboard
  | TogglePinOnDashboardSuccess
  | CopyProject
  | CopyProjectSuccess
  | DeleteProjects
  | DeleteProjectsSuccess
  | BulkProjectShare
  | BulkProjectShareSuccess
  | BulkProjectShareError
  | SaveSingleProjectShareId
  | ClearSingleProjectShareId;
