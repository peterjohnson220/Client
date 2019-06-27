import { Action } from '@ngrx/store';

import { DashboardView, Workbook } from '../models';

export const GET_COMPANY_WORKBOOKS = '[Data Insights / Dashboards] Get Company Workbooks';
export const GET_COMPANY_WORKBOOKS_SUCCESS = '[Data Insights / Dashboards] Get Company Workbooks Success';
export const GET_COMPANY_WORKBOOKS_ERROR = '[Data Insights / Dashboards] Get Company Workbooks Error';
export const ADD_WORKBOOK_FAVORITE = '[Data Insights / Dashboards] Add Workbook Favorite';
export const ADD_WORKBOOK_FAVORITE_SUCCESS = '[Data Insights / Dashboards] Add Workbook Favorite Success';
export const ADD_WORKBOOK_FAVORITE_ERROR = '[Data Insights / Dashboards] Add Workbook Favorite Error';
export const REMOVE_WORKBOOK_FAVORITE = '[Data Insights / Dashboards] Remove Workbook Favorite';
export const REMOVE_WORKBOOK_FAVORITE_SUCCESS = '[Data Insights / Dashboards] Remove Workbook Favorite Success';
export const REMOVE_WORKBOOK_FAVORITE_ERROR = '[Data Insights / Dashboards] Remove Workbook Favorite Error';
export const TOGGLE_DASHBOARD_VIEW = '[Data Insights / Dashboards] Toggle Dashboard View';

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
  | ToggleDashboardView;
