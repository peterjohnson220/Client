import { Action } from '@ngrx/store';
import { TimelineActivity } from '../models';
import { TimelineActivityResponse } from '../../../../../../libs/models/dashboard/timeline-activity-response.model';

export const LOADING_ACTIVITY = '[Dashboard Main/Activity Timeline] Loading Activity';
export const LOADING_ACTIVITY_SUCCESS = '[Dashboard Main/Activity Timeline] Loading Activity Success';
export const LOADING_ACTIVITY_ERROR = '[Dashboard Main/Activity Timeline] Loading Activity Error';
export const FILTER_ACTIVITY = '[Dashboard Main/Activity Timeline] Filter Activity';

export class LoadingActivity implements Action {
  readonly type = LOADING_ACTIVITY;
  constructor(public payload: string[]) {}
}

export class LoadingActivitySuccess implements Action {
  readonly type = LOADING_ACTIVITY_SUCCESS;
  constructor(public payload: TimelineActivityResponse) {}
}

export class LoadingActivityError implements Action {
  readonly type = LOADING_ACTIVITY_ERROR;

  constructor(public any: Error) {}
}

export class FilterActivity implements Action {
  readonly type = FILTER_ACTIVITY;
  constructor(public payload: TimelineActivity[]) {}
}

export type Actions
  = LoadingActivity
  | LoadingActivitySuccess
  | LoadingActivityError
  | FilterActivity;
