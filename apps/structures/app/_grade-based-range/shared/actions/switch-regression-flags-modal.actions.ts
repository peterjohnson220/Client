import { Action } from '@ngrx/store';

import { SwitchRegressionFlagsRequest } from 'libs/models/payfactors-api';

import { GradePoint } from '../models';

export const OPEN_MODAL = '[Structures - Grade Based Range - Regression] Open Modal';
export const CLOSE_MODAL = '[Structures - Grade Based Range - Regression] Close Modal';
export const SWITCH_REGRESSION_FLAGS = '[Structures - Grade Based Range - Regression] Switch Regression Flags';
export const SWITCH_REGRESSION_FLAGS_SUCCESS = '[Structures - Grade Based Range - Regression] Switch Regression Flags Success';
export const SWITCH_REGRESSION_FLAGS_ERROR = '[Structures - Grade Based Range - Regression] Switch Regression Flags Error';
export const SET_GRADE_POINTS = '[Structures - Grade Based Range - Regression] Set Grade Points';

export class OpenModal implements Action {
  readonly type = OPEN_MODAL;

  constructor() {}
}

export class CloseModal implements Action {
  readonly type = CLOSE_MODAL;

  constructor() {}
}

export class SwitchRegressionFlags implements Action {
  readonly type = SWITCH_REGRESSION_FLAGS;

  constructor(public payload: SwitchRegressionFlagsRequest ) {}
}

export class SwitchRegressionFlagsSuccess implements Action {
  readonly type = SWITCH_REGRESSION_FLAGS_SUCCESS;

  constructor(public rangeGroupId: number) {}
}

export class SwitchRegressionFlagsError implements Action {
  readonly type = SWITCH_REGRESSION_FLAGS_ERROR;

  constructor(public error: any) {}
}

export class SetGradePoints implements Action {
  readonly type = SET_GRADE_POINTS;

  constructor(public payload: GradePoint[]) {
  }
}

export type SwitchRegressionFlagsModalActions
  =  OpenModal
  | CloseModal
  | SwitchRegressionFlags
  | SwitchRegressionFlagsSuccess
  | SwitchRegressionFlagsError
  | SetGradePoints;


