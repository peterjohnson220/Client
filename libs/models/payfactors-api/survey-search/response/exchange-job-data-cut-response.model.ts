import { DataCutResponse } from './data-cut-response.model';

export interface ExchangeJobDataCutResponse extends DataCutResponse {
  ExchangeJobId: number;
  DailyNatAvgId: number;
  DailyScopeAvgId: number;
  Incs: number;
  Orgs: number;
}

export interface ExchangeJobDataResponse {
  DataCuts: ExchangeJobDataCutResponse[];
}
