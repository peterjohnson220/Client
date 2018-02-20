import { Action } from '@ngrx/store';
import { TimelineActivity } from '../models';

export const LOADING_ACTIVITY = '[Dashboard Main/Activity Timeline] Loading Activity';
export const LOADING_ACTIVITY_SUCCESS = '[Dashboard Main/Activity Timeline] Loading Activity Success';
export const LOADING_ACTIVITY_ERROR = '[Dashboard Main/Activity Timeline] Loading Activity Error';
export const FILTER_ACTIVITY = '[Dashboard Main/Activity Timeline] Filter Activity';
export const FILTER_ACTIVITY_SUCCESS = '[Dashboard Main/Activity Timeline] Filter Activity Success';
export const FILTER_ACTIVITY_ERROR = '[Dashboard Main/Activity Timeline] Filter Activity Error';

export class LoadingActivity implements Action {
  readonly type = LOADING_ACTIVITY;
}

export class LoadingActivitySuccess implements Action {
  readonly type = LOADING_ACTIVITY_SUCCESS;
  constructor(public payload: TimelineActivity[]) {}
}

export class LoadingActivityError implements Action {
  readonly type = LOADING_ACTIVITY_ERROR;

  constructor(public any: Error) {}
}

export class FilterActivity implements Action {
  readonly type = FILTER_ACTIVITY;
}

export class FilterActivitySuccess implements Action {
  readonly type = FILTER_ACTIVITY_SUCCESS;

  constructor(public payload: string[]) {}
}

export class FilterActivityError implements Action {
  readonly type = FILTER_ACTIVITY_ERROR;

  constructor(public any: Error) {}
}

export type Actions
  = LoadingActivity
  | LoadingActivitySuccess
  | LoadingActivityError
  | FilterActivity
  | FilterActivitySuccess
  | FilterActivityError;
