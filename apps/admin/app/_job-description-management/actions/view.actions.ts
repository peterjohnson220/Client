import { Action } from '@ngrx/store';

export const LOADING_VIEWS  = '[Jdm Admin/Bulk Export Schedule] Loading Views';
export const LOADING_VIEWS_SUCCESS  = '[Jdm Admin/Bulk Export Schedule] Loading Views Success';
export const LOADING_VIEWS_ERROR  = '[Jdm Admin/Bulk Export Schedule] Loading Views Error';

export class LoadingViews implements Action {
  readonly type = LOADING_VIEWS;

  constructor(public payload: any = null) { }
}

export class LoadingViewsSuccess implements Action {
  readonly type = LOADING_VIEWS_SUCCESS;

  constructor(public payload: {viewNames: string[]}) {}
}

export class LoadingViewsError implements Action {
  readonly type = LOADING_VIEWS_ERROR;

  constructor(public payload: any) {
  }
}

export type Actions
  = LoadingViews
  | LoadingViewsSuccess
  | LoadingViewsError;
