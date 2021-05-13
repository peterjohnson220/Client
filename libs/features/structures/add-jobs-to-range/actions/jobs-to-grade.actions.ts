import { Action } from '@ngrx/store';

import { Grade, GradeRangeGroupDetails, GradeJobs, GetGradeJobsModel, GradeJob } from '../models';

export const GET_GRADES = '[Project Add Jobs to Grade] Get Grades';
export const GET_GRADES_SUCCESS = '[Project Add Jobs to Grade] Get Grades Success';
export const GET_GRADES_ERROR = '[Project Add Jobs to Grade] Get Grades Error';
export const GET_GRADE_JOBS = '[Project Add Jobs to Grade] Get Grade Jobs';
export const GET_GRADE_JOBS_SUCCESS = '[Project Add Jobs to Grade] Get Grade Jobs Success';
export const GET_GRADE_JOBS_ERROR = '[Project Add Jobs to Grade] Get Grade Jobs Error';
export const ADD_JOBS_TO_GRADE = '[Project Add Jobs to Grade] Add New Jobs To Grade';
export const REMOVE_JOB = '[Project Add Jobs to Grade] Remove Job From Grade';
export const SAVE_GRADE_JOB_MAPS = '[Project Add Jobs to Grade] Save Grade Job Maps';
export const SAVE_GRADE_JOB_MAPS_SUCCESS = '[Project Add Jobs to Grade] Save Grade Job Maps Success';
export const SAVE_GRADE_JOB_MAPS_ERROR = '[Project Add Jobs to Grade] Save Grade Job Maps Error';
export const AUTO_GRADE_JOBS = '[Project Add Jobs to Grade] Auto Grade Jobs';
export const AUTO_GRADE_JOBS_SUCCESS = '[Project Add Jobs to Grade] Auto Grade Jobs Success';
export const AUTO_GRADE_JOBS_ERROR = '[Project Add Jobs to Grade] Auto Grade Jobs Error';

export class GetGrades implements Action {
  readonly type = GET_GRADES;

  constructor(public payload: GradeRangeGroupDetails) {}
}

export class GetGradesSuccess implements Action {
  readonly type = GET_GRADES_SUCCESS;

  constructor(public payload: Grade[]) {}
}

export class GetGradesError implements Action {
  readonly type = GET_GRADES_ERROR;

  constructor() {}
}

export class GetGradeJobs implements Action {
  readonly type = GET_GRADE_JOBS;

  constructor(public payload: GetGradeJobsModel) {}
}

export class GetGradeJobsError implements Action {
  readonly type = GET_GRADE_JOBS_ERROR;

  constructor(public payload: GradeJobs) {}
}

export class GetGradeJobsSuccess implements Action {
  readonly type = GET_GRADE_JOBS_SUCCESS;

  constructor(public payload: GradeJobs) {}
}

export class AddJobsToGrade implements Action {
  readonly type = ADD_JOBS_TO_GRADE;

  constructor(public payload: GradeJobs) {}
}

export class RemoveJob implements Action {
  readonly type = REMOVE_JOB;

  constructor(public payload: {GradeId: number, Job: GradeJob}) {}
}

export class SaveGradeJobMaps implements Action {
  readonly type = SAVE_GRADE_JOB_MAPS;

  constructor(public payload: Grade[]) {}
}

export class SaveGradeJobMapsSuccess implements Action {
  readonly type = SAVE_GRADE_JOB_MAPS_SUCCESS;

  constructor() {}
}

export class SaveGradeJobMapsError implements Action {
  readonly type = SAVE_GRADE_JOB_MAPS_ERROR;

  constructor() {}
}

export class AutoGradeJobs implements Action {
  readonly type = AUTO_GRADE_JOBS;

  constructor(public gradeRangeGroupDetails: GradeRangeGroupDetails) {}
}

export class AutoGradeJobsSuccess implements Action {
  readonly type = AUTO_GRADE_JOBS_SUCCESS;

  constructor() {}
}

export class AutoGradeJobsError implements Action {
  readonly type = AUTO_GRADE_JOBS_ERROR;

  constructor() {}
}

export type JobsToGradeActions
  = GetGrades
  | GetGradesSuccess
  | GetGradesError
  | GetGradeJobs
  | GetGradeJobsSuccess
  | GetGradeJobsError
  | AddJobsToGrade
  | RemoveJob
  | SaveGradeJobMaps
  | SaveGradeJobMapsSuccess
  | SaveGradeJobMapsError
  | AutoGradeJobs
  | AutoGradeJobsSuccess
  | AutoGradeJobsError;
