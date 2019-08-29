import { Action } from '@ngrx/store';

import { Workbook } from '../models';

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
  | RemoveViewFavoriteError;
