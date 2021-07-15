import { Action } from '@ngrx/store';
import * as fromKendo from '@progress/kendo-data-query/';

import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { StatementHistoryListResponse } from 'libs/models/payfactors-api/total-rewards/response/statement-history-list-response.model';

export const LOAD_STATEMENT = '[Total Rewards/Statement History] Load Statement';
export const LOAD_STATEMENT_SUCCESS = '[Total Rewards/Statement History] Load Statement Success';
export const LOAD_STATEMENT_ERROR = '[Total Rewards/Statement History] Load Statement Error';

export const LOAD_STATEMENT_HISTORY = '[Total Rewards/Statement History] Load Statement History';
export const LOAD_STATEMENT_HISTORY_SUCCESS = '[Total Rewards/Statement History] Load Statement History Success';
export const LOAD_STATEMENT_HISTORY_ERROR = '[Total Rewards/Statement History] Load Statement History Error';

export const UPDATE_GRID_STATE = '[Total Rewards/Statement History] Update Grid State';

export const DOWNLOAD_HISTORICAL_STATEMENT = '[Total Rewards/Statement History] Download Historical Statement';
export const DOWNLOAD_HISTORICAL_STATEMENT_SUCCESS = '[Total Rewards/Statement History] Download Historical Statement Success';
export const DOWNLOAD_HISTORICAL_STATEMENT_ERROR = '[Total Rewards/Statement History] Download Historical Statement Error';
export const UPDATE_PDF_ID_TO_EXPORT = '[Total Rewards/Statement History] Update Pdf Id To Export';

export class LoadStatement implements Action {
  readonly type = LOAD_STATEMENT;
  constructor(public payload: { statementId: string }) {}
}

export class LoadStatementSuccess implements Action {
  readonly type = LOAD_STATEMENT_SUCCESS;
  constructor(public payload: Statement) {}
}

export class LoadStatementError implements Action {
  readonly type = LOAD_STATEMENT_ERROR;
  constructor(public payload: any) {}
}

export class LoadStatementHistory implements Action {
  readonly type = LOAD_STATEMENT_HISTORY;
  constructor() {}
}
export class UpdateGridState implements Action {
  readonly type = UPDATE_GRID_STATE;
  constructor(public payload: fromKendo.State) {}
}

export class LoadStatementHistorySuccess implements Action {
  readonly type = LOAD_STATEMENT_HISTORY_SUCCESS;
  constructor(public payload: StatementHistoryListResponse) {}
}

export class LoadStatementHistoryError implements Action {
  readonly type = LOAD_STATEMENT_HISTORY_ERROR;
  constructor(public payload: any) {}
}

export class DownloadHistoricalStatement implements Action {
  readonly type = DOWNLOAD_HISTORICAL_STATEMENT;
}

export class DownloadHistoricalStatementSuccess implements Action {
  readonly type = DOWNLOAD_HISTORICAL_STATEMENT_SUCCESS;
  constructor(public payload: { downloadUrl: string }) {}
}

export class DownloadHistoricalStatementError implements Action {
  readonly type = DOWNLOAD_HISTORICAL_STATEMENT_ERROR;
}

export class UpdatePdfIdToExport implements Action {
  readonly type = UPDATE_PDF_ID_TO_EXPORT;
  constructor(public payload: { pdfId: string }) {}
}

export type StatementHistoryPageActions =
  LoadStatement |
  LoadStatementSuccess |
  LoadStatementError |
  LoadStatementHistory |
  LoadStatementHistorySuccess |
  LoadStatementHistoryError |
  UpdateGridState |
  DownloadHistoricalStatement |
  DownloadHistoricalStatementSuccess |
  DownloadHistoricalStatementError |
  UpdatePdfIdToExport;
