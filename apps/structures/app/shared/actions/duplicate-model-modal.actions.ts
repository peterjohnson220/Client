import { Action } from '@ngrx/store';

export const OPEN_MODAL = '[Structures - Job Based Range - Model Duplicate] Open Modal';
export const CLOSE_MODAL = '[Structures - Job Based Range - Model Duplicate] Close Modal';
export const DUPLICATE_MODEL = '[Structures - Job Based Range - Model Duplicate] Duplicate Model';
export const DUPLICATE_MODEL_SUCCESS = '[Structures - Job Based Range - Model Duplicate] Duplicate Model Success';
export const DUPLICATE_MODEL_ERROR = '[Structures - Job Based Range - Model Duplicate] Duplicate Model Error';
export const MODEL_NAME_EXISTS_FAILURE = '[Structures - Job Based Range - Model Duplicate] Model Name Exists Failure';
export const CLEAR_MODEL_NAME_EXISTS_FAILURE = '[Structures - Job Based Range - Model Duplicate] Clear Name Exists Failure';

export class OpenModal implements Action {
  readonly type = OPEN_MODAL;
}

export class CloseModal implements Action {
  readonly type = CLOSE_MODAL;
}

export class DuplicateModel implements Action {
  readonly type = DUPLICATE_MODEL;

  constructor(public payload: { rangeGroupId: number, modelName: string }) {}
}

export class DuplicateModelSuccess implements Action {
  readonly type = DUPLICATE_MODEL_SUCCESS;
}

export class DuplicateModelError implements Action {
  readonly type = DUPLICATE_MODEL_ERROR;
}

export class ModelNameExistsFailure implements Action {
  readonly type = MODEL_NAME_EXISTS_FAILURE;
}

export class ClearModelNameExistsFailure implements Action {
  readonly type = CLEAR_MODEL_NAME_EXISTS_FAILURE;
}

export type DuplicateModelModalActions
  = OpenModal
  | CloseModal
  | DuplicateModel
  | DuplicateModelSuccess
  | DuplicateModelError
  | ModelNameExistsFailure
  | ClearModelNameExistsFailure;
