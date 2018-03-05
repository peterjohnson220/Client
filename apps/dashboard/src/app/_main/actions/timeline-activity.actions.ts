import { Action } from '@ngrx/store';
import { TimelineActivityResponse, TimelineActivityRequest } from 'libs/models/dashboard';
import { TimelineActivityFilter } from '../models';


export const SET_ACTIVITY_FILTERS = '[Dashboard Main/Activity Timeline] Set Activity Filters';
export const LOADING_ACTIVITY = '[Dashboard Main/Activity Timeline] Loading Activity';
export const LOADING_ACTIVITY_SUCCESS = '[Dashboard Main/Activity Timeline] Loading Activity Success';
export const LOADING_ACTIVITY_ERROR = '[Dashboard Main/Activity Timeline] Loading Activity Error';
export const FILTER_ACTIVITY = '[Dashboard Main/Activity Timeline] Filter Activity';

export class LoadingActivity implements Action {
  readonly type = LOADING_ACTIVITY;
  constructor(public payload: TimelineActivityRequest) {}
}

export class LoadingActivitySuccess implements Action {
  readonly type = LOADING_ACTIVITY_SUCCESS;
  constructor(public payload: TimelineActivityResponse) {}
}

export class LoadingActivityError implements Action {
  readonly type = LOADING_ACTIVITY_ERROR;

  constructor(public any: Error) {}
}

export class SetActivityFilters implements Action {
  readonly type = SET_ACTIVITY_FILTERS;
  constructor(public payload: TimelineActivityFilter[]) {}
}

export class FilterActivity implements Action {
  readonly type = FILTER_ACTIVITY;
  constructor(public payload: string) {}
}

export type Actions
  = LoadingActivity
  | LoadingActivitySuccess
  | LoadingActivityError
  | SetActivityFilters
  | FilterActivity;
