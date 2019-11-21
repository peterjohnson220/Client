export interface JobMatchResult {
  Code: string;
  EffectiveDate: string;
  Id: number;
  IsSurvey: boolean;
  MatchStrength: number;
  Name: string;
  SurveyId: number;
  SurveyName: string;
  SurveyPublisher: string;
  JobDescription: string;
  Selected?: boolean;
}
