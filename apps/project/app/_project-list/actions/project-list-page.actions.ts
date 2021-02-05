import { Action } from '@ngrx/store';

export const TOGGLE_PIN_ON_DASHBOARD = '[Project List Page] Toggle Pin On Dashboard';
export const TOGGLE_PIN_ON_DASHBOARD_SUCCESS = '[Project List Page] Toggle Pin On Dashboard Success';
export const COPY_PROJECT = '[Project List Page] Copy Project';
export const COPY_PROJECT_SUCCESS = '[Project List Page] Copy Project Success';
export const DELETE_PROJECTS = '[Project List Page] Deletes Project Success';
export const DELETE_PROJECTS_SUCCESS = '[Project List Page] Delete Projects Success';

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

export type ProjectListPageActions
  = TogglePinOnDashboard
  | TogglePinOnDashboardSuccess
  | CopyProject
  | CopyProjectSuccess
  | DeleteProjects
  | DeleteProjectsSuccess;
