import { Action } from '@ngrx/store';

export const LOAD_TEMPLATES = '[Total Rewards/Statement List/Template Selector] Load Templates';
export const LOAD_TEMPLATES_SUCCESS = '[Total Rewards/Statement List/Template Selector] Load Templates Success';
export const LOAD_TEMPLATES_ERROR = '[Total Rewards/Statement List/Template Selector] Load Templates Error';

export const CREATE_STATEMENT = '[Total Rewards/Statement List/Template Selector] Create Statement';
export const CREATE_STATEMENT_SUCCESS = '[Total Rewards/Statement List/Template Selector] Create Statement Success';
export const CREATE_STATEMENT_ERROR = '[Total Rewards/Statement List/Template Selector] Create Statement Error';

export class LoadTemplates implements Action {
  readonly type = LOAD_TEMPLATES;
}

export class LoadTemplatesSuccess implements Action {
  readonly type = LOAD_TEMPLATES_SUCCESS;
  constructor(public payload: any[]) {}
}

export class LoadTemplatesError implements Action {
  readonly type = LOAD_TEMPLATES_ERROR;
}

export class CreateStatement implements Action {
  readonly type = CREATE_STATEMENT;
  constructor(public payload: { templateId: string }) {}
}

export class CreateStatementSuccess implements Action {
  readonly type = CREATE_STATEMENT_SUCCESS;
  constructor(public payload: { statementId: string }) {}
}

export class CreateStatementError implements Action {
  readonly type = CREATE_STATEMENT_ERROR;
}

export type TemplateSelectorActions =
  LoadTemplates |
  LoadTemplatesSuccess |
  LoadTemplatesError |
  CreateStatement |
  CreateStatementSuccess |
  CreateStatementError;
