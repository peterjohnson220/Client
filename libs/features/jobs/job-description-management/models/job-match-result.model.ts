export interface JobMatchResult {
  JobCode: string;
  EffectiveDate: string;
  Id: number;
  JobType: number;
  WeightedScore: number;
  JobTitle: string;
  SurveyId: number;
  SurveyName: string;
  SurveyPublisher: string;
  JobDescription: string;
  Selected?: boolean;
}
