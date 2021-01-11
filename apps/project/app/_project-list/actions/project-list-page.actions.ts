import { Action } from '@ngrx/store';

export const TOGGLE_PIN_ON_DASHBOARD = '[Project List Page] Toggle Pin On Dashboard';
export const TOGGLE_PIN_ON_DASHBOARD_SUCCESS = '[Project List Page] Toggle Pin On Dashboard Success';
export const COPY_PROJECT = '[Project List Page] Copy Project';
export const COPY_PROJECT_SUCCESS = '[Project List Page] Copy Project Success';

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

export type ProjectListPageActions
  = TogglePinOnDashboard
  | TogglePinOnDashboardSuccess
  | CopyProject
  | CopyProjectSuccess;
