export interface PricingMatchesDetailsRequest {
  JobId: string;
  JobType: number;
}

export enum MatchesDetailsRequestJobTypes {
  SurveyJob = 1,
  SurveyData = 2,
  PayfactorsJob = 3
}
