import { Action } from '@ngrx/store';

import { Statement, SaveImageRequest, UpdateStringPropertyRequest, DeleteImageRequest } from 'libs/features/total-rewards/total-rewards-statement/models';
import * as requestModels from 'libs/features/total-rewards/total-rewards-statement/models/request-models';

// CONTROL UPDATES
export const UPDATE_STATEMENT_NAME = '[Total Rewards/Edit Statement] Update Statement Name';
export const UPDATE_STATEMENT_CONTROL_TITLE = '[Total Rewards/Edit Statement] Update Statement Control Title';
export const UPDATE_CALCULATION_CONTROL_FIELD_TITLE = '[Total Rewards/Edit Statement] Update Calculation Control Field Title';
export const UPDATE_CALCULATION_CONTROL_SUMMARY_TITLE = '[Total Rewards/Edit Statement] Update Calculation Control Summary Title';
export const ADD_CALCULATION_CONTROL_COMPENSATION_FIELD = '[Total Rewards/Edit Statement] Add Calculation Control Compensation Field';
export const REMOVE_CALCULATION_CONTROL_COMPENSATION_FIELD = '[Total Rewards/Edit Statement] Remove Calculation Control Compensation Field';
export const UPDATE_RICH_TEXT_CONTROL_CONTENT = '[Total Rewards/Edit Statement] Update Rich Text Control Content';
export const SAVE_IMAGE_CONTROL_IMAGE = '[Total Rewards/Edit Statement] Save Image Control Image';
export const REMOVE_IMAGE_CONTROL_IMAGE = '[Total Rewards/Edit Statement] Remove Image Control Image';

export class UpdateStatementName implements Action {
  readonly type = UPDATE_STATEMENT_NAME;
  constructor(public payload: string) {}
}

export class UpdateStatementControlTitle implements Action {
  readonly type = UPDATE_STATEMENT_CONTROL_TITLE;
  constructor(public payload: requestModels.UpdateTitleRequest) {}
}

export class UpdateCalculationControlSummaryTitle implements Action {
  readonly type = UPDATE_CALCULATION_CONTROL_SUMMARY_TITLE;
  constructor(public payload: requestModels.UpdateTitleRequest) {}
}

export class UpdateCalculationControlFieldTitle implements Action {
  readonly type = UPDATE_CALCULATION_CONTROL_FIELD_TITLE;
  constructor(public payload: requestModels.UpdateFieldOverrideNameRequest) {}
}

export class RemoveCalculationControlCompensationField implements Action {
  readonly type = REMOVE_CALCULATION_CONTROL_COMPENSATION_FIELD;
  constructor(public payload: requestModels.UpdateFieldVisibilityRequest) {}
}

export class AddCalculationControlCompensationField implements Action {
  readonly type = ADD_CALCULATION_CONTROL_COMPENSATION_FIELD;
  constructor(public payload: requestModels.UpdateFieldVisibilityRequest) {}
}

export class UpdateRichTextControlContent implements Action {
  readonly type = UPDATE_RICH_TEXT_CONTROL_CONTENT;
  constructor(public payload: UpdateStringPropertyRequest) {}
}

export class SaveImageControlImage implements Action {
  readonly type = SAVE_IMAGE_CONTROL_IMAGE;
  constructor(public payload: SaveImageRequest) {}
}

export class RemoveImageControlImage implements Action {
  readonly type = REMOVE_IMAGE_CONTROL_IMAGE;
  constructor(public payload: DeleteImageRequest) {}
}


export type ControlActions =
  UpdateStatementName |
  UpdateStatementControlTitle |
  UpdateCalculationControlFieldTitle |
  UpdateCalculationControlSummaryTitle |
  AddCalculationControlCompensationField |
  RemoveCalculationControlCompensationField |
  UpdateRichTextControlContent |
  AddCalculationControlCompensationField |
  SaveImageControlImage |
  RemoveImageControlImage;
