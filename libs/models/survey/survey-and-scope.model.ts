import { SurveyScope } from './survey-scope.model';
import { Survey } from './survey.model';

export interface SurveyAndScope {
  DefaultScopeDto: SurveyScope;
  SurveyInfo: Survey;
}
