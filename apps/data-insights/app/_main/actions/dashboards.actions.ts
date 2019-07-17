import { Action } from '@ngrx/store';

import { WorkbookOrderType } from 'libs/constants';

import { DashboardView, Workbook, SaveWorkbookTagObj, View } from '../models';

export const GET_COMPANY_WORKBOOKS = '[Data Insights / Dashboards] Get Company Workbooks';
export const GET_COMPANY_WORKBOOKS_SUCCESS = '[Data Insights / Dashboards] Get Company Workbooks Success';
export const GET_COMPANY_WORKBOOKS_ERROR = '[Data Insights / Dashboards] Get Company Workbooks Error';
export const GET_COMPANY_WORKBOOK_VIEWS = '[Data Insights / Dashboards] Get Company Workbook Views';
export const GET_COMPANY_WORKBOOK_VIEWS_SUCCESS = '[Data Insights / Dashboards] Get Company Workbook Views Success';
export const GET_COMPANY_WORKBOOK_VIEWS_ERROR = '[Data Insights / Dashboards] Get Company Workbook Views Error';
export const ADD_WORKBOOK_FAVORITE = '[Data Insights / Dashboards] Add Workbook Favorite';
export const ADD_WORKBOOK_FAVORITE_SUCCESS = '[Data Insights / Dashboards] Add Workbook Favorite Success';
export const ADD_WORKBOOK_FAVORITE_ERROR = '[Data Insights / Dashboards] Add Workbook Favorite Error';
export const REMOVE_WORKBOOK_FAVORITE = '[Data Insights / Dashboards] Remove Workbook Favorite';
export const REMOVE_WORKBOOK_FAVORITE_SUCCESS = '[Data Insights / Dashboards] Remove Workbook Favorite Success';
export const REMOVE_WORKBOOK_FAVORITE_ERROR = '[Data Insights / Dashboards] Remove Workbook Favorite Error';
export const TOGGLE_DASHBOARD_VIEW = '[Data Insights / Dashboards] Toggle Dashboard View';
export const SAVE_WORKBOOK_TAG = '[Data Insights / Dashboards] Save Workbook Tag';
export const SAVE_WORKBOOK_TAG_SUCCESS = '[Data Insights / Dashboards] Save Workbook Tag Success';
export const SAVE_WORKBOOK_TAG_ERROR = '[Data Insights / Dashboards] Save Workbook Tag Error';
export const SAVE_WORKBOOK_ORDER = '[Data Insights / Dashboards] Save Workbook Order';
export const SAVE_WORKBOOK_ORDER_SUCCESS = '[Data Insights / Dashboards] Save Workbook Order Success';
export const SAVE_WORKBOOK_ORDER_ERROR = '[Data Insights / Dashboards] Save Workbook Order Error';
export const PERSIST_DASHBOARD_VIEW_SUCCESS = '[Data Insights / Dashboards] Persist Dashboard View Success';
export const PERSIST_DASHBOARD_VIEW_ERROR = '[Data Insights / Dashboards] Persist Dashboard View Error';
export const GET_DASHBOARD_VIEW = '[Data Insights / Dashboards] Get Dashboard View]';
export const GET_DASHBOARD_VIEW_SUCCESS = '[Data Insights / Dashboards] Get Dashboard View Success';
export const GET_DASHBOARD_VIEW_ERROR = '[Data Insights / Dashboards] Get Dashboard View Error';

export class GetCompanyWorkbooks implements Action {
  readonly type = GET_COMPANY_WORKBOOKS;

  constructor() {}
}

export class GetCompanyWorkbooksSuccess implements Action {
  readonly type = GET_COMPANY_WORKBOOKS_SUCCESS;

  constructor( public payload: Workbook[]) {}
}

export class GetCompanyWorkbooksError implements Action {
  readonly type = GET_COMPANY_WORKBOOKS_ERROR;

  constructor() {}
}

export class AddWorkbookFavorite implements Action {
  readonly type = ADD_WORKBOOK_FAVORITE;

  constructor(public payload: { workbookId: string }) {}
}

export class AddWorkbookFavoriteSuccess implements Action {
  readonly type = ADD_WORKBOOK_FAVORITE_SUCCESS;

  constructor() {}
}

export class AddWorkbookFavoriteError implements Action {
  readonly type = ADD_WORKBOOK_FAVORITE_ERROR;

  constructor() {}
}

export class RemoveWorkbookFavorite implements Action {
  readonly type = REMOVE_WORKBOOK_FAVORITE;

  constructor(public payload: { workbookId: string }) {}
}

export class RemoveWorkbookFavoriteSuccess implements Action {
  readonly type = REMOVE_WORKBOOK_FAVORITE_SUCCESS;

  constructor() {}
}

export class RemoveWorkbookFavoriteError implements Action {
  readonly type = REMOVE_WORKBOOK_FAVORITE_ERROR;

  constructor() {}
}

export class ToggleDashboardView implements Action {
  readonly type = TOGGLE_DASHBOARD_VIEW;

  constructor(public payload: { view: DashboardView }) {}
}

export class SaveWorkbookTag implements Action {
  readonly type = SAVE_WORKBOOK_TAG;

  constructor(public payload: SaveWorkbookTagObj ) {}
}

export class SaveWorkbookTagSuccess implements Action {
  readonly type = SAVE_WORKBOOK_TAG_SUCCESS;

  constructor() {}
}

export class SaveWorkbookTagError implements Action {
  readonly type = SAVE_WORKBOOK_TAG_ERROR;

  constructor() {}
}

export class SaveWorkbookOrder implements Action {
  readonly type = SAVE_WORKBOOK_ORDER;

  constructor(public payload: { workbookIds: string[], workbookOrderType?: WorkbookOrderType }) {}
}

export class SaveWorkbookOrderSuccess implements Action {
  readonly type = SAVE_WORKBOOK_ORDER_SUCCESS;

  constructor(public payload: { workbookIds: string[], workbookOrderType?: WorkbookOrderType }) {}
}

export class SaveWorkbookOrderError implements Action {
  readonly type = SAVE_WORKBOOK_ORDER_ERROR;

  constructor() {}
}

export class GetCompanyWorkbookViews implements Action {
  readonly type = GET_COMPANY_WORKBOOK_VIEWS;

  constructor(public payload: { workbookId: string }) {}
}

export class GetCompanyWorkbookViewsSuccess implements Action {
  readonly type = GET_COMPANY_WORKBOOK_VIEWS_SUCCESS;

  constructor(public payload: { workbookId: string, views: View[] }) {}
}

export class GetCompanyWorkbookViewsError implements Action {
  readonly type = GET_COMPANY_WORKBOOK_VIEWS_ERROR;

  constructor(public payload: { workbookId: string }) {}
}

export class PersistDashboardViewSuccess implements Action {
  readonly type = PERSIST_DASHBOARD_VIEW_SUCCESS;
  constructor() {}
}
export class PersistDashboardViewError implements Action {
  readonly type = PERSIST_DASHBOARD_VIEW_ERROR;
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

export type Actions
  = GetCompanyWorkbooks
  | GetCompanyWorkbooksSuccess
  | GetCompanyWorkbooksError
  | AddWorkbookFavorite
  | AddWorkbookFavoriteSuccess
  | AddWorkbookFavoriteError
  | RemoveWorkbookFavorite
  | RemoveWorkbookFavoriteSuccess
  | RemoveWorkbookFavoriteError
  | ToggleDashboardView
  | SaveWorkbookTag
  | SaveWorkbookTagSuccess
  | SaveWorkbookTagError
  | SaveWorkbookOrder
  | SaveWorkbookOrderSuccess
  | SaveWorkbookOrderError
  | GetCompanyWorkbookViews
  | GetCompanyWorkbookViewsSuccess
  | GetCompanyWorkbookViewsError
  | PersistDashboardViewSuccess
  | PersistDashboardViewError
  | GetDashboardView
  | GetDashboardViewSuccess
  | GetDashboardViewError;
