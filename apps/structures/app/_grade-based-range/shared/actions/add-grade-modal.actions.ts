import { Action } from '@ngrx/store';

export const OPEN_MODAL = '[Structures - Grade Based Range - Add Grade] Open Modal';
export const CLOSE_MODAL = '[Structures - Grade Based Range - Add Grade] Close Modal';
export const ADD_GRADE = '[Structures - Grade Based Range - Add Grade] Add Grade';
export const ADD_GRADE_SUCCESS = '[Structures - Grade Based Range - Add Grade] Add Grade Success';
export const ADD_GRADE_ERROR = '[Structures - Grade Based Range - Add Grade] Add Grade Error';
export const GRADE_NAME_EXISTS_FAILURE = '[Structures - Grade Based Range - Add Grade] Grade Name Exists Failure';
export const CLEAR_GRADE_NAME_EXISTS_FAILURE = '[Structures - Grade Based Range - Add Grade] Clear Name Exists Failure';


export class OpenModal implements Action {
  readonly type = OPEN_MODAL;
}

export class CloseModal implements Action {
  readonly type = CLOSE_MODAL;
}

export class AddGrade implements Action {
  readonly type = ADD_GRADE;

  constructor(public payload: { rangeGroupId: number, gradeName: string }) {}
}

export class AddGradeSuccess implements Action {
  readonly type = ADD_GRADE_SUCCESS;
}

export class AddGradeError implements Action {
  readonly type = ADD_GRADE_ERROR;
}

export class GradeNameExistsFailure implements Action {
  readonly type = GRADE_NAME_EXISTS_FAILURE;
}

export class ClearGradeNameExistsFailure implements Action {
  readonly type = CLEAR_GRADE_NAME_EXISTS_FAILURE;
}

export type AddGradeModalActions
  = OpenModal
  | CloseModal
  | AddGrade
  | AddGradeSuccess
  | AddGradeError
  | GradeNameExistsFailure
  | ClearGradeNameExistsFailure;