import { CompanyJob } from 'libs/models';

export interface JobInsights {
  JobSummary: string;
  Job: CompanyJob;
}

export interface GetJobInsightsRequest {
  CompanyJobId: number;
  CompanyPayMarketId: number;
}
