import { Action } from '@ngrx/store';
import { SelectedJobFamily } from 'libs/models/jobs-hierarchy';

export const GET_JOB_FAMILIES = '[Admin/Jobs Hierarchy] Get Job Families';
export const GET_JOB_FAMILIES_SUCCESS = '[Admin/Jobs Hierarchy] Get Job Families Success';
export const GET_JOB_FAMILIES_ERROR = '[Admin/Jobs Hierarchy] Get Job Families Error';
export const SET_NEW_FAMILY_SELECTION = '[Admin/Jobs Hierarchy] Set New Family Selection';
export const GET_JOB_LEVELS_FOR_JOB_FAMILY_SUCCESS = '[Admin/Jobs Hierarchy] Get Job Levels for Job Family Success';
export const GET_JOB_LEVELS_FOR_JOB_FAMILY_ERROR = '[Admin/Jobs Hierarchy] Get Job Levels for Job Family Error';


export class GetJobFamilies implements Action {
  readonly type = GET_JOB_FAMILIES;

  constructor() {}
}

export class GetJobFamiliesSuccess implements Action {
  readonly type = GET_JOB_FAMILIES_SUCCESS;

  constructor(public payload: string[]) {}
}

export class GetJobFamiliesError implements Action {
  readonly type = GET_JOB_FAMILIES_ERROR;

  constructor(public payload: any) {}
}

export class SetJobFamilySelection implements Action {
  readonly type = SET_NEW_FAMILY_SELECTION;

  constructor(public payload: SelectedJobFamily[]) {}
}

export class GetJobLevelsForJobFamiliesSuccess implements Action {
  readonly type = GET_JOB_LEVELS_FOR_JOB_FAMILY_SUCCESS;

  constructor(public payload: string[]) {}
}

export class GetJobLevelsForJobFamiliesError implements Action {
  readonly type = GET_JOB_LEVELS_FOR_JOB_FAMILY_ERROR;

  constructor(public payload: any) {}
}

export type Actions
  = GetJobFamilies
  | GetJobFamiliesSuccess
  | GetJobFamiliesError
  | SetJobFamilySelection
  | GetJobLevelsForJobFamiliesSuccess
  | GetJobLevelsForJobFamiliesError;
