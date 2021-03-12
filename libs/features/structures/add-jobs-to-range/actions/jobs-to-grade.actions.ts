import { Action } from '@ngrx/store';

import { Grade, GradeRangeGroupDetails, GradeJobs, GetAddGradeJobsModel } from '../models';

export const GET_GRADES = '[Project Add Jobs to Grade] Get Grades';
export const GET_GRADES_SUCCESS = '[Project Add Jobs to Grade] Get Grades Success';
export const GET_GRADES_ERROR = '[Project Add Jobs to Grade] Get Grades Error';
export const GET_GRADE_JOBS = '[Project Add Jobs to Grade] Get Grade Jobs';
export const GET_GRADE_JOBS_SUCCESS = '[Project Add Jobs to Grade] Get Grade Jobs Success';
export const GET_GRADE_JOBS_ERROR = '[Project Add Jobs to Grade] Get Grade Jobs Error';
export const ADD_JOBS_TO_GRADE = '[Project Add Jobs to Grade] Add New Jobs To Grade';
export const ADD_JOBS_TO_GRADE_SUCCESS = '[Project Add Jobs to Grade] Add New Jobs To Grade Success';
export const ADD_JOBS_TO_GRADE_ERROR = '[Project Add Jobs to Grade] Add New Jobs To Grade Error';

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

  constructor(public payload: GetAddGradeJobsModel) {}
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

  constructor(public payload: GetAddGradeJobsModel) {}
}

export class AddJobsToGradeSuccess implements Action {
  readonly type = ADD_JOBS_TO_GRADE_SUCCESS;

  constructor(public payload: GetAddGradeJobsModel) {}
}

export class AddJobsToGradeError implements Action {
  readonly type = ADD_JOBS_TO_GRADE_ERROR;

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
  | AddJobsToGradeSuccess
  | AddJobsToGradeError;
