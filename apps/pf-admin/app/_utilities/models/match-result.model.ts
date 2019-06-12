export interface MatchResult {
  Id: string;
  CombinedScope: string;
  Selected: boolean;
  OldSurveyId: number;
  Scope1: string;
  Scope2: string;
  Scope3: string;
  WeightingType: string;
  NewSurveyId: number;
  NewScope1: string;
  NewScope2: string;
  NewScope3: string;
  NewWeightingType: string;
  IsExactMatch: boolean;
}
