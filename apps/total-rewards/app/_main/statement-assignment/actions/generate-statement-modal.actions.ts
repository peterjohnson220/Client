import { Action } from '@ngrx/store';

import { StatementEmailTemplate } from 'libs/models/payfactors-api';

export const GET_STATEMENT_EMAIL_TEMPLATE = '[Total Rewards/Generate Statement Modal] Get Statement Email Template';
export const GET_STATEMENT_EMAIL_TEMPLATE_SUCCESS = '[Total Rewards/Generate Statement Modal] Get Statement Email Template Success';
export const GET_STATEMENT_EMAIL_TEMPLATE_ERROR = '[Total Rewards/Generate Statement Modal] Get Statement Email Template Error';
export const SAVE_STATEMENT_EMAIL_TEMPLATE = '[Total Rewards/Generate Statement Modal] Save Statement Email Template';
export const SAVE_STATEMENT_EMAIL_TEMPLATE_SUCCESS = '[Total Rewards/Generate Statement Modal] Save Statement Email Template Success';
export const SAVE_STATEMENT_EMAIL_TEMPLATE_ERROR = '[Total Rewards/Generate Statement Modal] Save Statement Email Template Error';

export class GetStatementEmailTemplate implements Action {
  readonly type = GET_STATEMENT_EMAIL_TEMPLATE;
  constructor(public payload: { statementId: string }) {}
}

export class GetStatementEmailTemplateSuccess implements Action {
  readonly type = GET_STATEMENT_EMAIL_TEMPLATE_SUCCESS;
  constructor(public payload: StatementEmailTemplate) {}
}

export class GetStatementEmailTemplateError implements Action {
  readonly type = GET_STATEMENT_EMAIL_TEMPLATE_ERROR;
  constructor() {}
}

export class SaveStatementEmailTemplate implements Action {
  readonly type = SAVE_STATEMENT_EMAIL_TEMPLATE;
  constructor(public payload: StatementEmailTemplate) {}
}

export class SaveStatementEmailTemplateSuccess implements Action {
  readonly type = SAVE_STATEMENT_EMAIL_TEMPLATE_SUCCESS;
  constructor(public payload: StatementEmailTemplate) {}
}

export class SaveStatementEmailTemplateError implements Action {
  readonly type = SAVE_STATEMENT_EMAIL_TEMPLATE_ERROR;
}

export type Actions
  = GetStatementEmailTemplate
  | GetStatementEmailTemplateSuccess
  | GetStatementEmailTemplateError
  | SaveStatementEmailTemplate
  | SaveStatementEmailTemplateSuccess
  | SaveStatementEmailTemplateError;
