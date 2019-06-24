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

export function generateMockMatchResult(): MatchResult {
  return {
    Id: '9999',
    CombinedScope: 'All/All//I',
    Selected: false,
    OldSurveyId: 555,
    Scope1: 'All',
    Scope2: 'All',
    Scope3: '',
    WeightingType: 'I',
    NewSurveyId: 666,
    NewScope1: 'All2',
    NewScope2: 'All2',
    NewScope3: '',
    NewWeightingType: 'I',
    IsExactMatch: false
  };
}
