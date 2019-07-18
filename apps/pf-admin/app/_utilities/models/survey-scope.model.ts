import { FilterableName } from 'libs/core/interfaces/FilterableName';

export interface SurveyScope extends FilterableName {
  Id: string;
  Name: string;
  WeightingType: string;
  Selected: boolean;
  Scope1: string;
  Scope2: string;
  Scope3: string;
}

export function generateMockSurveyScope(): SurveyScope {
  return {
    Id: '239048',
    Name: 'All///I',
    WeightingType: 'I',
    Selected: true,
    Scope1: 'All',
    Scope2: '',
    Scope3: ''
  };
}
