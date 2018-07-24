export interface SurveyDataFilterRequest {
    SurveyJobId: number;
    DefaultScopes?: SurveyScope[];
    CombinedScope?: string;
  }

  export interface SurveyScope {
    SurveyId?: number;
    CombinedScope: string;
  }
