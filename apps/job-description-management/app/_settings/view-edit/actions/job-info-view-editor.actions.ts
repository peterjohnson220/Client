import { Action } from '@ngrx/store';

import { JobInfoViewField } from '../models';

export const RESET = '[Job Description Management / Job Info View Editor] Reset';
export const GET_JOB_INFORMATION_FIELDS = '[Job Description Management / Job Info View Editor] Get Job Information Fields';
export const GET_JOB_INFORMATION_FIELDS_SUCCESS = '[Job Description Management / Job Info View Editor] Get Job Information Fields Success';
export const GET_JOB_INFORMATION_FIELDS_ERROR = '[Job Description Management / Job Info View Editor] Get Job Information Fields Error';
export const TOGGLE_JOB_INFO_VIEW_FIELD = '[Job Description Management / Job Info View Editor] Toggle Job Info View Field';
export const SET_ALL_JOB_INFO_VIEW_FIELDS = '[Job Description Management / Job Info View Editor] Set All Job Info View Fields';

export class Reset implements Action {
  readonly type = RESET;
}

export class GetJobInformationFields implements Action {
  readonly type = GET_JOB_INFORMATION_FIELDS;
}

export class GetJobInformationFieldsSuccess implements Action {
  readonly type = GET_JOB_INFORMATION_FIELDS_SUCCESS;

  constructor(public payload: JobInfoViewField[]) {}
}
export class GetJobInformationFieldsError implements Action {
  readonly type = GET_JOB_INFORMATION_FIELDS_ERROR;
}

export class ToggleJobInfoViewField implements Action {
  readonly type = TOGGLE_JOB_INFO_VIEW_FIELD;

  constructor(public payload: JobInfoViewField) {}
}

export class SetAllJobInfoViewFields implements Action {
  readonly type = SET_ALL_JOB_INFO_VIEW_FIELDS;

  constructor(public payload: { checked: boolean }) {}
}


export type Actions
  = Reset
  | GetJobInformationFields
  | GetJobInformationFieldsSuccess
  | GetJobInformationFieldsError
  | ToggleJobInfoViewField
  | SetAllJobInfoViewFields;

