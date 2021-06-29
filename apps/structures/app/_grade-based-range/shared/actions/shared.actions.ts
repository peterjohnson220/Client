import { Action } from '@ngrx/store';

import { Grade, GradeJob } from 'libs/features/structures/add-jobs-to-range/models';


export const GET_GRADES_DETAILS = '[Structures - Grade Based Range - Shared] Get Grades Details';
export const GET_GRADES_DETAILS_SUCCESS = '[Structures - Grade Based Range - Shared] Get Grades Details Success';
export const GET_GRADES_DETAILS_ERROR = '[Structures - Grade Based Range - Shared] Get Grades Details Error';
export const SET_CURRENT_REGRESSION_GRADE_INFO = '[Structures - Grade Based Range - Shared] Set Current Regression Grade Info';
export const SET_OPEN_ADD_JOBS = '[Structures - Grade Based Range - Shared] Set Open Add Jobs';
export const SET_SUMMARY_CHART_SVG = '[Structures - Grade Based Range - Shared] Set Summary Chart SVG';
export const SET_VERTICAL_CHART_SVG = '[Structures - Grade Based Range - Shared] Set Vertical Chart SVG';

export class SetCurrentRegressionGradeInfo implements Action {
  readonly type = SET_CURRENT_REGRESSION_GRADE_INFO;

  constructor(public payload: { grade: Grade, gradeJob: GradeJob }) {}
}

export class GetGradesDetails implements Action {
  readonly type = GET_GRADES_DETAILS;

  constructor(public payload: number) {}
}

export class GetGradesDetailsSuccess implements Action {
  readonly type = GET_GRADES_DETAILS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetGradesDetailsError implements Action {
  readonly type = GET_GRADES_DETAILS_ERROR;

  constructor(public payload: any) {}
}

export class SetOpenAddJobs implements Action {
  readonly type = SET_OPEN_ADD_JOBS;

  constructor(public payload: boolean) {}
}

export class SetSummaryChartSvg implements Action {
  readonly type = SET_SUMMARY_CHART_SVG;

  constructor(public payload: string) {}
}

export class SetVerticalChartSvg implements Action {
  readonly type = SET_VERTICAL_CHART_SVG;

  constructor(public payload: string) {}
}

export type SharedActions
  = GetGradesDetails
  | GetGradesDetailsSuccess
  | GetGradesDetailsError
  | SetCurrentRegressionGradeInfo
  | SetOpenAddJobs
  | SetSummaryChartSvg
  | SetVerticalChartSvg;


