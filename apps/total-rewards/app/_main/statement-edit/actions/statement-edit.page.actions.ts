import { Action } from '@ngrx/store';
import { BaseControl, Statement } from '../../../shared/models';
import { UpdateTitleRequest } from '../../../shared/models/request-models/update-title-request';
import { UpdateFieldOverrideNameRequest } from '../../../shared/models/request-models/update-field-override-name-request';
import { UpdateFieldVisibilityRequest } from '../../../shared/models/request-models/update-field-visibility-request';

export const LOAD_STATEMENT = '[Total Rewards/Edit Statement] Load Statement';
export const LOAD_STATEMENT_SUCCESS = '[Total Rewards/Edit Statement] Load Statement Success';
export const LOAD_STATEMENT_ERROR = '[Total Rewards/Edit Statement] Load Statement Error';
export const SAVE_STATEMENT = '[Total Rewards/Edit Statement] Save Statement';
export const SAVE_STATEMENT_SUCCESS = '[Total Rewards/Edit Statement] Save Statement Success';
export const SAVE_STATEMENT_ERROR = '[Total Rewards/Edit Statement] Save Statement Error';
export const UPDATE_STATEMENT_CONTROL_TITLE = '[Total Rewards/Edit Statement] Update Control Title';
export const UPDATE_CALCULATION_CONTROL_FIELD_TITLE = '[Total Rewards/Edit Statement] Update Calculation Control Field Title';
export const UPDATE_STATEMENT_CONTROL_SUMMARY_TITLE = '[Total Rewards/Edit Statement] Update Control Summary Title';
export const REMOVE_CALCULATION_CONTROL_COMPENSATION_FIELD = '[Total Rewards/Edit Statement] Remove Calculation Control Compensation Field';
export const ADD_CALCULATION_CONTROL_COMPENSATION_FIELD = '[Total Rewards/Edit Statement] Add Calculation Control Compensation Field';

export class LoadStatement implements Action {
  readonly type = LOAD_STATEMENT;
  constructor(public payload: number) {}
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
  constructor(public payload: Statement) {}
}

export class SaveStatementSuccess implements Action {
  readonly type = SAVE_STATEMENT_SUCCESS;
}

export class SaveStatementError implements Action {
  readonly type = SAVE_STATEMENT_ERROR;
  constructor(public payload: any) {}
}

export class UpdateStatementControlTitle implements Action {
  readonly type = UPDATE_STATEMENT_CONTROL_TITLE;
  constructor(public payload: UpdateTitleRequest) {}
}

export class UpdateCalculationControlSummaryTitle implements Action {
  readonly type = UPDATE_STATEMENT_CONTROL_SUMMARY_TITLE;
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

export type Actions =
  LoadStatement |
  LoadStatementSuccess |
  LoadStatementError |
  SaveStatement |
  SaveStatementSuccess |
  SaveStatementError |
  UpdateStatementControlTitle |
  UpdateCalculationControlFieldTitle |
  UpdateCalculationControlSummaryTitle |
  RemoveCalculationControlCompensationField |
  AddCalculationControlCompensationField;
