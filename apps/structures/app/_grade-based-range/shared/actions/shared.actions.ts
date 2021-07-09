import { Action } from '@ngrx/store';

import { Grade, GradeJob } from 'libs/features/structures/add-jobs-to-range/models';


export const SET_CURRENT_REGRESSION_GRADE_INFO = '[Structures - Grade Based Range - Shared] Set Current Regression Grade Info';
export const SET_OPEN_ADD_JOBS = '[Structures - Grade Based Range - Shared] Set Open Add Jobs';
export const SET_SUMMARY_CHART_SVG = '[Structures - Grade Based Range - Shared] Set Summary Chart SVG';
export const SET_VERTICAL_CHART_SVG = '[Structures - Grade Based Range - Shared] Set Vertical Chart SVG';
export const SET_SHOW_VERTICAL_CHART = '[Structures - Grade Based Range - Shared] Set Show Vertical Chart';

export class SetCurrentRegressionGradeInfo implements Action {
  readonly type = SET_CURRENT_REGRESSION_GRADE_INFO;

  constructor(public payload: { grade: Grade, gradeJob: GradeJob }) {}
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

export class SetShowVerticalChart implements Action {
  readonly type = SET_SHOW_VERTICAL_CHART;

  constructor(public payload: boolean) {}
}

export type SharedActions
  = SetCurrentRegressionGradeInfo
  | SetOpenAddJobs
  | SetSummaryChartSvg
  | SetVerticalChartSvg
  | SetShowVerticalChart;


