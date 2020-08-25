import { Action } from '@ngrx/store';

import { TotalRewardsStatementPdf } from '../models';

export const GET_TOTAL_REWARDS_STATEMENT_PDFS = '[Notifications / Total Rewards Statement Pdf] Get Total Rewards Statement Pdfs';
export const GET_TOTAL_REWARDS_STATEMENT_PDFS_SUCCESS = '[Notifications / Total Rewards Statement Pdf] Get Total Rewards Statement Pdfs Success';
export const GET_TOTAL_REWARDS_STATEMENT_PDFS_ERROR = '[Notifications / Total Rewards Statement Pdf] Get Total Rewards Statement Pdfs Error';

export class GetTotalRewardsStatementPdfs implements Action {
  readonly type = GET_TOTAL_REWARDS_STATEMENT_PDFS;
}

export class GetTotalRewardsStatementPdfsSuccess implements Action {
  readonly type = GET_TOTAL_REWARDS_STATEMENT_PDFS_SUCCESS;
  constructor(public payload: TotalRewardsStatementPdf[]) {}
}

export class GetTotalRewardsStatementPdfsError implements Action {
  readonly type = GET_TOTAL_REWARDS_STATEMENT_PDFS_ERROR;
}

export type Actions =
  GetTotalRewardsStatementPdfs |
  GetTotalRewardsStatementPdfsSuccess |
  GetTotalRewardsStatementPdfsError;
