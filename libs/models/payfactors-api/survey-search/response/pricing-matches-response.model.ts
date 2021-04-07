import { ExchangeJobDailyNatAvgOrg50thDetails } from 'libs/models/payfactors-api';

export interface PricingMatchesResponse {
  PFJobsMatches: PFJobMatches[];
  SurveyJobsMatches: SurveyJobsMatches[];
  ExchangeJobDailyNatAvgOrg50thDetails: ExchangeJobDailyNatAvgOrg50thDetails[];
}

export interface PFJobMatches {
  JobCode: string;
  Matches: number;
}

export interface SurveyJobsMatches {
  SurveyJobId: number;
  Matches: number;
}
