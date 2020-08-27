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

export interface ExchangeJobDailyNatAvgOrg50thDetails {
  ExchangeJobId: number;
  Base50th: number;
  TCC50th: number;
  Orgs: number;
}
