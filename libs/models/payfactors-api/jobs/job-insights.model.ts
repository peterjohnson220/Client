import { CompanyJob, GenericKeyValue } from 'libs/models';

export interface JobInsights {
  JobSummary: string;
  Job: CompanyJob;
  JobPricingId: number;
  JobPricingRate: string;
  JobPricingEffectiveDate: Date;
  LinkedPayMarketName: string;
  PayMarketName: string;
  RequestedBy?: string;
  CustomFields?: GenericKeyValue<string, string>[];
  PricingMatches?: PricingMatchForJobInsights[];
}

export interface GetJobInsightsRequest {
  CompanyJobId: number;
  CompanyPayMarketId: number;
}

export interface PricingMatchForJobInsights {
  JobTitle: string;
  JobCode: string;
  JobSummary: string;
  Source: string;
  EffectiveDate: Date;
  MDJobCode: string;
  SlottedCompanyJobId: number;
  ExchangeDataCutFilterGUID: string;
  Base10: number;
  Base25: number;
  Base50: number;
  Base75: number;
  Base90: number;
  TCC10: number;
  TCC25: number;
  TCC50: number;
  TCC75: number;
  TCC90: number;
  Rate: string;
  MatchWeight: number;
  MatchAdjustment: number;
}
