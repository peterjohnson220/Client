import { Action } from '@ngrx/store';

import { Workbook } from 'libs/features/reports/models';

export const LOAD_PEER_TREND_REPORT  = '[Peer Dashboard/Page] Load Peer Trend Report';
export const LOAD_PEER_TREND_REPORT_SUCCESS  = '[Peer Dashboard/Page] Load Peer Trend Report Success';
export const LOAD_PEER_TREND_REPORT_ERROR  = '[Peer Dashboard/Page] Load Peer Trend Report Error';

export class LoadPeerTrendReport implements Action {
  readonly type = LOAD_PEER_TREND_REPORT;
}

export class LoadPeerTrendReportSuccess implements Action {
  readonly type = LOAD_PEER_TREND_REPORT_SUCCESS;

  constructor(public payload: Workbook) {}
}

export class LoadPeerTrendReportError implements Action {
  readonly type = LOAD_PEER_TREND_REPORT_ERROR;
}

export type Actions
  = LoadPeerTrendReport
  | LoadPeerTrendReportSuccess
  | LoadPeerTrendReportError;
