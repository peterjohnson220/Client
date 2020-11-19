import { Action } from '@ngrx/store';
import { JdmListFilter } from 'libs/models/user-profile';

export const LOADING_FILTERS  = '[Bulk Jobs Export Scheduler Feature / Filter] Loading Filters';
export const LOADING_FILTERS_SUCCESS  = '[Bulk Jobs Export Scheduler Feature / Filter] Loading Filters Success';
export const LOADING_FILTERS_ERROR  = '[Bulk Jobs Export Scheduler Feature / Filter] Loading Filters Error';

export class LoadingFilters implements Action {
  readonly type = LOADING_FILTERS;

  constructor(public payload: any = null) { }
}

export class LoadingFiltersSuccess implements Action {
  readonly type = LOADING_FILTERS_SUCCESS;

  constructor(public payload: {userFilters: JdmListFilter[]}) {}
}

export class LoadingFiltersError implements Action {
  readonly type = LOADING_FILTERS_ERROR;

  constructor(public payload: any) {
  }
}

export type BulkExportJobsSchedulerFilterActions
  = LoadingFilters
  | LoadingFiltersSuccess
  | LoadingFiltersError;
