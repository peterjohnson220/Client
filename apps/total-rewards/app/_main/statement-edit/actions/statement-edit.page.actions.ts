import { Action } from '@ngrx/store';
import { Statement, UpdateStringPropertyRequest } from '../../../shared/models';
import { UpdateTitleRequest, UpdateFieldOverrideNameRequest, UpdateFieldVisibilityRequest } from '../../../shared/models/request-models';

export const CLONE_STATEMENT_FROM_TEMPLATE = '[Total Rewards/Edit Statement] Clone Statement from Template';
export const CLONE_STATEMENT_FROM_TEMPLATE_SUCCESS = '[Total Rewards/Edit Statement] Clone Statement from Template Success';
export const CLONE_STATEMENT_FROM_TEMPLATE_ERROR = '[Total Rewards/Edit Statement] Clone Statement from Template Error';
export const LOAD_STATEMENT = '[Total Rewards/Edit Statement] Load Statement';
export const LOAD_STATEMENT_SUCCESS = '[Total Rewards/Edit Statement] Load Statement Success';
export const LOAD_STATEMENT_ERROR = '[Total Rewards/Edit Statement] Load Statement Error';
export const SAVE_STATEMENT = '[Total Rewards/Edit Statement] Save Statement';
export const SAVE_STATEMENT_SUCCESS = '[Total Rewards/Edit Statement] Save Statement Success';
export const SAVE_STATEMENT_ERROR = '[Total Rewards/Edit Statement] Save Statement Error';
export const UPDATE_STATEMENT_NAME = '[Total Rewards/Edit Statement] Update Statement Name';
export const UPDATE_STATEMENT_CONTROL_TITLE = '[Total Rewards/Edit Statement] Update Statement Control Title';
export const UPDATE_CALCULATION_CONTROL_FIELD_TITLE = '[Total Rewards/Edit Statement] Update Calculation Control Field Title';
export const UPDATE_CALCULATION_CONTROL_SUMMARY_TITLE = '[Total Rewards/Edit Statement] Update Calculation Control Summary Title';
export const ADD_CALCULATION_CONTROL_COMPENSATION_FIELD = '[Total Rewards/Edit Statement] Add Calculation Control Compensation Field';
export const REMOVE_CALCULATION_CONTROL_COMPENSATION_FIELD = '[Total Rewards/Edit Statement] Remove Calculation Control Compensation Field';
export const UPDATE_RICH_TEXT_CONTROL_CONTENT = '[Total Rewards/Edit Statement] Update Rich Text Control Content';

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

export class UpdateStatementName implements Action {
  readonly type = UPDATE_STATEMENT_NAME;
  constructor(public payload: string) {}
}
export class UpdateStatementControlTitle implements Action {
  readonly type = UPDATE_STATEMENT_CONTROL_TITLE;
  constructor(public payload: UpdateTitleRequest) {}
}

export class UpdateCalculationControlSummaryTitle implements Action {
  readonly type = UPDATE_CALCULATION_CONTROL_SUMMARY_TITLE;
  constructor(public payload: UpdateTitleRequest) {}
}

export class UpdateCalculationControlFieldTitle implements Action {
  readonly type = UPDATE_CALCULATION_CONTROL_FIELD_TITLE;
  constructor(public payload: UpdateFieldOverrideNameRequest) {}
}

export class RemoveCalculationControlCompensationField implements Action {
  readonly type = REMOVE_CALCULATION_CONTROL_COMPENSATION_FIELD;
  constructor(public payload: UpdateFieldVisibilityRequest) {}
}

export class AddCalculationControlCompensationField implements Action {
  readonly type = ADD_CALCULATION_CONTROL_COMPENSATION_FIELD;
  constructor(public payload: UpdateFieldVisibilityRequest) {}
}

export class UpdateRichTextControlContent implements Action {
  readonly type = UPDATE_RICH_TEXT_CONTROL_CONTENT;
  constructor(public payload: UpdateStringPropertyRequest) {}
}

export type StatementEditPageActions =
  CloneStatementFromTemplate |
  CloneStatementFromTemplateSuccess |
  CloneStatementFromTemplateError |
  LoadStatement |
  LoadStatementSuccess |
  LoadStatementError |
  SaveStatement |
  SaveStatementSuccess |
  SaveStatementError |
  UpdateStatementName |
  UpdateStatementControlTitle |
  UpdateCalculationControlFieldTitle |
  UpdateCalculationControlSummaryTitle |
  AddCalculationControlCompensationField |
  RemoveCalculationControlCompensationField |
  UpdateRichTextControlContent;
