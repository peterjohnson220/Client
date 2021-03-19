import { Action } from '@ngrx/store';

export const GET_GRADE_RANGE_DETAILS = '[Structures - Grade Based Range - Shared] Get Grade Range Details';
export const GET_GRADE_RANGE_DETAILS_SUCCESS = '[Structures - Grade Based Range - Shared] Get Grade Range Details Success';
export const GET_GRADE_RANGE_DETAILS_ERROR = '[Structures - Grade Based Range - Shared] Get Grade Range Details Error';
export const GET_GRADES_DETAILS = '[Structures - Grade Based Range - Shared] Get Grades Details';
export const GET_GRADES_DETAILS_SUCCESS = '[Structures - Grade Based Range - Shared] Get Grades Details Success';
export const GET_GRADES_DETAILS_ERROR = '[Structures - Grade Based Range - Shared] Get Grades Details Error';

export class GetGradeRangeDetails implements Action {
  readonly type = GET_GRADE_RANGE_DETAILS;

  constructor(public payload: any) {}
}

export class GetGradeRangeDetailsSuccess implements Action {
  readonly type = GET_GRADE_RANGE_DETAILS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetGradeRangeDetailsError implements Action {
  readonly type = GET_GRADE_RANGE_DETAILS_ERROR;

  constructor(public payload: any) {}
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

export type SharedActions
  = GetGradeRangeDetails
  | GetGradeRangeDetailsSuccess
  | GetGradeRangeDetailsError
  | GetGradesDetails
  | GetGradesDetailsSuccess
  | GetGradesDetailsError;


