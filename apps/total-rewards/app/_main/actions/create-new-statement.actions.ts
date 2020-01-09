import { Action } from '@ngrx/store';

export const RESET_FORM = '[Total Rewards/Create New Statement] Reset Form';
export const UPDATE_NAME = '[Total Rewards/Create New Statement] Update Name';
export const UPDATE_TEMPLATE = '[Total Rewards/Create New Statement] Update Template';

export const VALIDATE_STATEMENT_NAME = '[Total Rewards/Create New Statement] Validate Statement Name';
export const VALIDATE_STATEMENT_NAME_SUCCESS = '[Total Rewards/Create New Statement] Validate Statement Name Success';
export const VALIDATE_STATEMENT_NAME_ERROR = '[Total Rewards/Create New Statement] Validate Statement Name Error';

export const CREATE = '[Total Rewards/Create New Statement] Create';
export const CREATE_SUCCESS = '[Total Rewards/Create New Statement] Create Success';
export const CREATE_ERROR = '[Total Rewards/Create New Statement] Create Error';

export class ResetForm implements Action {
  readonly type = RESET_FORM;
}

export class UpdateName implements Action {
  readonly type = UPDATE_NAME;
  constructor(public payload: string) {}
}

export class UpdateTemplate implements Action {
  readonly type = UPDATE_TEMPLATE;
  constructor(public payload: number) {}
}

export class ValidateStatementName implements Action {
  readonly type = VALIDATE_STATEMENT_NAME;
}

export class ValidateStatementNameSuccess implements Action {
  readonly type = VALIDATE_STATEMENT_NAME_SUCCESS;
  constructor(public payload: boolean) {}
}

export class ValidateStatementNameError implements Action {
  readonly type = VALIDATE_STATEMENT_NAME_ERROR;
}

export class Create implements Action {
  readonly type = CREATE;
}

export class CreateSuccess implements Action {
  readonly type = CREATE_SUCCESS;
  constructor(public payload: number) {}
}

export class CreateError implements Action {
  readonly type = CREATE_ERROR;
}

export type Actions =
  ResetForm |
  UpdateName |
  UpdateTemplate |
  ValidateStatementName |
  ValidateStatementNameSuccess |
  ValidateStatementNameError |
  Create |
  CreateSuccess |
  CreateError;
