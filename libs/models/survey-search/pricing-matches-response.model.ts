export interface PricingMatchesResponse {
  PFJobsMatches: PFJobMatches[];
  SurveyJobsMatches: SurveyJobsMatches[];
}

export interface PFJobMatches {
  JobCode: string;
  Matches: number;
}

export interface SurveyJobsMatches {
  SurveyJobId: number;
  Matches: number;
}
