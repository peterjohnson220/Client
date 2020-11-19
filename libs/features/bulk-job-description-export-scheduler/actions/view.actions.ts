import { Action } from '@ngrx/store';
import { JobDescriptionViewModel } from 'libs/models/jdm/job-description-view.model';

export const LOADING_VIEWS  = '[Bulk Jobs Export Scheduler Feature / View] Loading Views';
export const LOADING_VIEWS_SUCCESS  = '[Bulk Jobs Export Scheduler Feature / View] Loading Views Success';
export const LOADING_VIEWS_ERROR  = '[Bulk Jobs Export Scheduler Feature / View] Loading Views Error';

export class LoadingViews implements Action {
  readonly type = LOADING_VIEWS;

  constructor(public payload: any = null) { }
}

export class LoadingViewsSuccess implements Action {
  readonly type = LOADING_VIEWS_SUCCESS;

  constructor(public payload: { views: JobDescriptionViewModel[]}) {}
}

export class LoadingViewsError implements Action {
  readonly type = LOADING_VIEWS_ERROR;

  constructor(public payload: any) {
  }
}

export type BulkExportJobsSchedulerViewActions
  = LoadingViews
  | LoadingViewsSuccess
  | LoadingViewsError;
