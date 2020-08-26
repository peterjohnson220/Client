import { SurveyScope } from 'libs/models/survey/survey-scope.model';

export interface ReScopeSurveyDataContext {
  CountryCode: string;
  CurrencyConversionFactor: number;
  DefaultScopes: SurveyScope[];
}
