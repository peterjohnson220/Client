import { Action } from '@ngrx/store';
import { Statement, StatementModeEnum } from '../../../shared/models';

// STATEMENT
export const CLONE_STATEMENT_FROM_TEMPLATE = '[Total Rewards/Edit Statement] Clone Statement from Template';
export const CLONE_STATEMENT_FROM_TEMPLATE_SUCCESS = '[Total Rewards/Edit Statement] Clone Statement from Template Success';
export const CLONE_STATEMENT_FROM_TEMPLATE_ERROR = '[Total Rewards/Edit Statement] Clone Statement from Template Error';
export const LOAD_STATEMENT = '[Total Rewards/Edit Statement] Load Statement';
export const LOAD_STATEMENT_SUCCESS = '[Total Rewards/Edit Statement] Load Statement Success';
export const LOAD_STATEMENT_ERROR = '[Total Rewards/Edit Statement] Load Statement Error';
export const SAVE_STATEMENT = '[Total Rewards/Edit Statement] Save Statement';
export const SAVE_STATEMENT_SUCCESS = '[Total Rewards/Edit Statement] Save Statement Success';
export const SAVE_STATEMENT_ERROR = '[Total Rewards/Edit Statement] Save Statement Error';
export const TOGGLE_STATEMENT_EDIT_MODE = '[Total Rewards/Edit Statement] Toggle Statement Edit Mode';

export class CloneStatementFromTemplate implements Action {
  readonly type = CLONE_STATEMENT_FROM_TEMPLATE;
  constructor(public templateId: string) {}
}

export class CloneStatementFromTemplateSuccess implements  Action {
  readonly type = CLONE_STATEMENT_FROM_TEMPLATE_SUCCESS;
  constructor(public payload: any) {}
}

export class CloneStatementFromTemplateError implements  Action {
  readonly type = CLONE_STATEMENT_FROM_TEMPLATE_ERROR;
  constructor(public error: any) {}
}

export class LoadStatement implements Action {
  readonly type = LOAD_STATEMENT;
  constructor(public payload: string) {}
}

export class LoadStatementSuccess implements Action {
  readonly type = LOAD_STATEMENT_SUCCESS;
  constructor(public payload: Statement) {}
}

export class LoadStatementError implements Action {
  readonly type = LOAD_STATEMENT_ERROR;
  constructor(public payload: any) {}
}

export class SaveStatement implements Action {
  readonly type = SAVE_STATEMENT;
  constructor() {}
}

export class SaveStatementSuccess implements Action {
  readonly type = SAVE_STATEMENT_SUCCESS;
  constructor(public payload: Statement) {}
}

export class SaveStatementError implements Action {
  readonly type = SAVE_STATEMENT_ERROR;
  constructor(public payload: any) {}
}

export class ToggleStatementEditMode implements Action {
  readonly type = TOGGLE_STATEMENT_EDIT_MODE;
  constructor(public payload: StatementModeEnum) {}
}

export type StatementActions =
  CloneStatementFromTemplate |
  CloneStatementFromTemplateSuccess |
  CloneStatementFromTemplateError |
  ToggleStatementEditMode |
  LoadStatement |
  LoadStatementSuccess |
  LoadStatementError |
  SaveStatement |
  SaveStatementSuccess |
  SaveStatementError;
