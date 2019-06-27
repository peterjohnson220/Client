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
