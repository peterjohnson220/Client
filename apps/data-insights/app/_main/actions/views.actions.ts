import { Action } from '@ngrx/store';

import { Workbook, SaveReportOrderData, DashboardView } from '../models';

export const REFRESH_TABLEAU_REPORTS = '[Data Insights / Views] Refresh Tableau Reports';
export const REFRESH_TABLEAU_REPORTS_SUCCESS = '[Data Insights / Views] Refresh Tableau Reports Success';
export const REFRESH_TABLEAU_REPORTS_ERROR = '[Data Insights / Views] Refresh Tableau Reports Error';
export const GET_ALL_COMPANY_REPORTS_VIEWS = '[Data Insights / Views] Get All Company Reports Views';
export const GET_ALL_COMPANY_REPORTS_VIEWS_SUCCESS = '[Data Insights / Views] Get All Company Reports Views Success';
export const GET_ALL_COMPANY_REPORTS_VIEWS_ERROR = '[Data Insights / Views] Get All Company Reports Views Error';
export const ADD_VIEW_FAVORITE = '[Data Insights / Views] Add View Favorite';
export const ADD_VIEW_FAVORITE_SUCCESS = '[Data Insights / Views] Add View Favorite Success';
export const ADD_VIEW_FAVORITE_ERROR = '[Data Insights / Views] Add View Favorite Error';
export const REMOVE_VIEW_FAVORITE = '[Data Insights / Views] Remove View Favorite';
export const REMOVE_VIEW_FAVORITE_SUCCESS = '[Data Insights / Views] Remove View Favorite Success';
export const REMOVE_VIEW_FAVORITE_ERROR = '[Data Insights / Views] Remove View Favorite Error';
export const SAVE_REPORT_ORDER = '[Data Insights / Views] Save Report Order';
export const SAVE_REPORT_ORDER_SUCCESS = '[Data Insights / Views] Save Report Order Success';
export const SAVE_REPORT_ORDER_ERROR = '[Data Insights / Views] Save Report Order Error';
export const GET_DASHBOARD_VIEW = '[Data Insights / Views] Get Dashboard View]';
export const GET_DASHBOARD_VIEW_SUCCESS = '[Data Insights / Views] Get Dashboard View Success';
export const GET_DASHBOARD_VIEW_ERROR = '[Data Insights / Views] Get Dashboard View Error';
export const TOGGLE_DASHBOARD_VIEW = '[Data Insights / Views] Toggle Dashboard View]';
export const PERSIST_DASHBOARD_VIEW_SUCCESS = '[Data Insights / Views] Persist Dashboard View Success';
export const PERSIST_DASHBOARD_VIEW_ERROR = '[Data Insights / Views] Persist Dashboard View Error';

export class RefreshTableauReports implements Action {
  readonly type = REFRESH_TABLEAU_REPORTS;

  constructor() {}
}

export class RefreshTableauReportsSuccess implements Action {
  readonly type = REFRESH_TABLEAU_REPORTS_SUCCESS;

  constructor() {}
}

export class RefreshTableauReportsError implements Action {
  readonly type = REFRESH_TABLEAU_REPORTS_ERROR;

  constructor() {}
}

export class GetAllCompanyReportsViews implements Action {
  readonly type = GET_ALL_COMPANY_REPORTS_VIEWS;

  constructor() {}
}

export class GetAllCompanyReportsViewsSuccess implements Action {
  readonly type = GET_ALL_COMPANY_REPORTS_VIEWS_SUCCESS;

  constructor(public payload: Workbook[]) {}
}

export class GetAllCompanyReportsViewsError implements Action {
  readonly type = GET_ALL_COMPANY_REPORTS_VIEWS_ERROR;

  constructor() {}
}

export class AddViewFavorite implements Action {
  readonly type = ADD_VIEW_FAVORITE;

  constructor(public payload: { workbookId: string, viewId: string }) {}
}

export class AddViewFavoriteSuccess implements Action {
  readonly type = ADD_VIEW_FAVORITE_SUCCESS;

  constructor() {}
}

export class AddViewFavoriteError implements Action {
  readonly type = ADD_VIEW_FAVORITE_ERROR;

  constructor() {}
}

export class RemoveViewFavorite implements Action {
  readonly type = REMOVE_VIEW_FAVORITE;

  constructor(public payload: { workbookId: string, viewId: string }) {}
}

export class RemoveViewFavoriteSuccess implements Action {
  readonly type = REMOVE_VIEW_FAVORITE_SUCCESS;

  constructor() {}
}

export class RemoveViewFavoriteError implements Action {
  readonly type = REMOVE_VIEW_FAVORITE_ERROR;

  constructor() {}
}

export class SaveReportOrder implements Action {
  readonly type = SAVE_REPORT_ORDER;

  constructor(public payload: SaveReportOrderData) {}
}

export class SaveReportOrderSuccess implements Action {
  readonly type = SAVE_REPORT_ORDER_SUCCESS;

  constructor(public payload: SaveReportOrderData) {}
}

export class SaveReportOrderError implements Action {
  readonly type = SAVE_REPORT_ORDER_ERROR;

  constructor() {}
}

export class GetDashboardView implements Action {
  readonly type = GET_DASHBOARD_VIEW;

  constructor() {}
}

export class GetDashboardViewSuccess implements Action {
  readonly type = GET_DASHBOARD_VIEW_SUCCESS;

  constructor(public payload: string) {}
}

export class GetDashboardViewError implements Action {
  readonly type = GET_DASHBOARD_VIEW_ERROR;

  constructor() {}
}

export class ToggleDashboardView implements Action {
  readonly type = TOGGLE_DASHBOARD_VIEW;

  constructor(public payload: { view: DashboardView }) {}
}

export class PersistDashboardViewSuccess implements Action {
  readonly type = PERSIST_DASHBOARD_VIEW_SUCCESS;
  constructor() {}
}
export class PersistDashboardViewError implements Action {
  readonly type = PERSIST_DASHBOARD_VIEW_ERROR;
  constructor() {}
}


export type Actions
  = RefreshTableauReports
  | RefreshTableauReportsSuccess
  | RefreshTableauReportsError
  | GetAllCompanyReportsViews
  | GetAllCompanyReportsViewsSuccess
  | GetAllCompanyReportsViewsError
  | AddViewFavorite
  | AddViewFavoriteSuccess
  | AddViewFavoriteError
  | RemoveViewFavorite
  | RemoveViewFavoriteSuccess
  | RemoveViewFavoriteError
  | SaveReportOrder
  | SaveReportOrderSuccess
  | SaveReportOrderError
  | GetDashboardView
  | GetDashboardViewSuccess
  | GetDashboardViewError
  | ToggleDashboardView
  | PersistDashboardViewSuccess
  | PersistDashboardViewError;
