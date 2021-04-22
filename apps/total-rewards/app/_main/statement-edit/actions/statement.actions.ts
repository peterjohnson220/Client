import { Action } from '@ngrx/store';

import { Statement, StatementModeEnum } from 'libs/features/total-rewards/total-rewards-statement/models';

// STATEMENT
export const LOAD_STATEMENT = '[Total Rewards/Edit Statement] Load Statement';
export const LOAD_STATEMENT_SUCCESS = '[Total Rewards/Edit Statement] Load Statement Success';
export const LOAD_STATEMENT_ERROR = '[Total Rewards/Edit Statement] Load Statement Error';
export const RESET_STATEMENT = '[Total Rewards/Edit Statement] Reset Statement';
export const SAVE_STATEMENT = '[Total Rewards/Edit Statement] Save Statement';
export const SAVE_STATEMENT_SUCCESS = '[Total Rewards/Edit Statement] Save Statement Success';
export const SAVE_STATEMENT_ERROR = '[Total Rewards/Edit Statement] Save Statement Error';
export const TOGGLE_STATEMENT_EDIT_MODE = '[Total Rewards/Edit Statement] Toggle Statement Edit Mode';
export const UPDATE_EFFECTIVE_DATE = '[Total Rewards/Edit Statement] Update Effective Date';
export const PAGE_SCROLL = '[Total Rewards/Edit Statement] Page Scroll';
export const GENERATE_STATEMENT_PREVIEW = '[Total Rewards/Edit Statement] Generate Statement Preview';
export const GENERATE_STATEMENT_PREVIEW_ERROR = '[Total Rewards/Edit Statement] Generate Statement Preview Error';
export const GENERATE_STATEMENT_PREVIEW_SUCCESS = '[Total Rewards/Edit Statement] Generate Statement Preview Success';
export const GENERATE_STATEMENT_PREVIEW_COMPLETE = '[Total Rewards/Edit Statement] Generate Statement Preview Complete';

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

export class ResetStatement implements Action {
  readonly type = RESET_STATEMENT;
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

export class UpdateEffectiveDate implements Action {
  readonly type = UPDATE_EFFECTIVE_DATE;
  constructor(public payload: { effectiveDate: Date }) {}
}

export class PageScroll implements Action {
  readonly type = PAGE_SCROLL;
  constructor(public payload: { isScrolling: boolean }) {}
}

export class GenerateStatementPreview implements Action {
  readonly type = GENERATE_STATEMENT_PREVIEW;
}
export class GenerateStatementPreviewSuccess implements Action {
  readonly type = GENERATE_STATEMENT_PREVIEW_SUCCESS;
  constructor(public payload: string) {}
}

export class GenerateStatementPreviewError implements Action {
  readonly type = GENERATE_STATEMENT_PREVIEW_ERROR;
  constructor(public payload: any) {}
}

export class GenerateStatementPreviewComplete implements Action {
  readonly type = GENERATE_STATEMENT_PREVIEW_COMPLETE;
}

export type StatementActions =
  ToggleStatementEditMode |
  LoadStatement |
  LoadStatementSuccess |
  LoadStatementError |
  ResetStatement |
  SaveStatement |
  SaveStatementSuccess |
  SaveStatementError |
  UpdateEffectiveDate |
  PageScroll;
