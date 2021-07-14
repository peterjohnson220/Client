import { CompanyJob } from 'libs/models';

export interface JobInsights {
  JobSummary: string;
  Job: CompanyJob;
  JobPricingId: number;
  JobPricingRate: string;
}

export interface GetJobInsightsRequest {
  CompanyJobId: number;
  CompanyPayMarketId: number;
}
