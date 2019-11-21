import { Action } from '@ngrx/store';

import {
  GetAppliesToAttributesExistRequest
} from 'libs/models/payfactors-api/job-description/request/get-applies-to-attributes-exist-request.model';

import { JobDescriptionAppliesToItem } from '../models/job-description-appliesto-item.model';
import { AppliesToAttributesExist } from '../models/applies-to-attributes-exist.model';

export const GET_APPLIES_TO_ATTRIBUTES_EXIST = '[job-description-management / Job Description Applies To] Get Applies To Attributes Exist';
export const GET_APPLIES_TO_ATTRIBUTES_EXIST_ERROR =
  '[job-description-management / Job Description Applies To] Get Applies To Attributes Exist Error';
export const GET_APPLIES_TO_ATTRIBUTES_EXIST_SUCCESS =
  '[job-description-management / Job Description Applies To] Get Applies To Attributes Exist Success';
export const LOAD_JOB_DESCRIPTION_APPLIESTO = '[job-description-management / Job Description Applies To] Load Job Description Applies To';
export const LOAD_JOB_DESCRIPTION_APPLIESTO_ERROR =
  '[job-description-management / Job Description Applies To] Load Job Description Applies To Error';
export const LOAD_JOB_DESCRIPTION_APPLIESTO_SUCCESS =
  '[job-description-management / Job Description Applies To] Load Job Description Applies To Success';
export const LOAD_JOB_DESCRIPTION_APPLIESTO_VALUES =
  '[job-description-management / Job Description Applies To] Load Job Description Applies To Values';
export const LOAD_JOB_DESCRIPTION_APPLIESTO_VALUES_ERROR =
  '[job-description-management / Job Description Applies To] Load Job Description Applies To Error Values';
export const LOAD_JOB_DESCRIPTION_APPLIESTO_VALUES_SUCCESS =
  '[job-description-management / Job Description Applies To] Load Job Description Applies To Success Values';
export const RESET_APPLIES_TO_ATTRIBUTES_EXIST = '[job-description-management / Job Description Applies To] Reset Applies To Attributes Exist';

export class GetAppliesToAttributesExist implements Action {
  readonly type = GET_APPLIES_TO_ATTRIBUTES_EXIST;

  constructor(public payload: { JobDescriptionId: number, Request: GetAppliesToAttributesExistRequest }) {}
}

export class GetAppliesToAttributesExistError implements Action {
  readonly type = GET_APPLIES_TO_ATTRIBUTES_EXIST_ERROR;
}

export class GetAppliesToAttributesExistSuccess implements Action {
  readonly type = GET_APPLIES_TO_ATTRIBUTES_EXIST_SUCCESS;

  constructor(public payload: AppliesToAttributesExist) {}
}

export class LoadJobDescriptionAppliesTo implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_APPLIESTO;
}

export class LoadJobDescriptionAppliesToError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_APPLIESTO_ERROR;
}

export class LoadJobDescriptionAppliesToSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_APPLIESTO_SUCCESS;

  constructor(public payload: JobDescriptionAppliesToItem[]) {}
}

export class LoadJobDescriptionAppliesToValues implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_APPLIESTO_VALUES;

  constructor(public payload: { SearchTerm: string }) {}
}

export class LoadJobDescriptionAppliesToValuesError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_APPLIESTO_VALUES_ERROR;
}

export class LoadJobDescriptionAppliesToValuesSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_APPLIESTO_VALUES_SUCCESS;

  constructor(public payload: string[]) {}
}

export class ResetAppliesToAttributeExist implements Action {
  readonly type = RESET_APPLIES_TO_ATTRIBUTES_EXIST;

  constructor() {}
}

export type Actions
  = GetAppliesToAttributesExist
  | GetAppliesToAttributesExistError
  | GetAppliesToAttributesExistSuccess
  | LoadJobDescriptionAppliesTo
  | LoadJobDescriptionAppliesToError
  | LoadJobDescriptionAppliesToSuccess
  | LoadJobDescriptionAppliesToValues
  | LoadJobDescriptionAppliesToValuesError
  | LoadJobDescriptionAppliesToValuesSuccess
  | ResetAppliesToAttributeExist;
