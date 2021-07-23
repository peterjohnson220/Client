import { DataCutSummaryEntityTypes } from 'libs/constants';

export interface TempDataCutIdentity {
  MatchId?: number|string;
  MatchType: DataCutSummaryEntityTypes;
  JobId?: number;
  ExchangeJobId?: number;
  FilterContext?: any;
}
