import { SmartCodeMap } from "libs/models/payfactors-api/peer/exchange-data-search/response";

export interface TrendsSummaryDetails {
  BasePayPctChange: number;
  IncsPctChange: number;
  ContributingCompanyCount: number;
  ContributingCompanyJobCount: number;
  ContributingExchangeJobCount: number;
}
