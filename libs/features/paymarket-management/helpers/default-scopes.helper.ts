import { Survey, CombinedScopeViewModel, SurveyAndScope, SurveyScope } from 'libs/models/survey';

import { CompanySurvey, CombinedScope, DefaultScope } from '../models';

export class DefaultScopesHelper {
  static mapSurveysToCompanySurveys(surveys: Survey[]): CompanySurvey[] {
    return surveys.map(s => this.mapSurveyToCompanySurvey(s));
  }

  static mapSurveyToCompanySurvey(survey: Survey): CompanySurvey {
    const effectiveDate = new Date(survey.EffectiveDate);
    const formattedDate = `${effectiveDate.getMonth() + 1}/${effectiveDate.getDay()}/${effectiveDate.getFullYear()}`;
    return {
      Id: survey.SurveyId,
      Title: survey.SurveyName,
      Publisher: survey.SurveyPublisher,
      EffectiveDate: survey.EffectiveDate,
      DisplayName: `${survey.SurveyPublisher} - ${survey.SurveyName} (${formattedDate})`
    };
  }

  static mapCombinedScopeViewModelsToCombinedScopes(response: CombinedScopeViewModel[]): CombinedScope[] {
    return response.map(s => {
      return {
        Name: s.CombinedScopeDisplay,
        Value: s.CombinedScopeValue
      };
    });
  }

  static mapSurveyScopeToCombinedScope(scope: SurveyScope): CombinedScope {
    return {
      Name: scope.CombinedScope,
      Value: scope.CombinedScope,
      CompanySurveyScopesId: scope.CompanySurveyScopesId
    };
  }

  static mapSurveyAndScopesToDefaultScopes(response: SurveyAndScope[]): DefaultScope[] {
    return response.map(i => {
      return {
        Survey: this.mapSurveyToCompanySurvey(i.SurveyInfo),
        Scope: this.mapSurveyScopeToCombinedScope(i.DefaultScopeDto)
      };
    });
  }

  static removeDefaultScope(defaultScopes: DefaultScope[], scopeToRemove: DefaultScope): DefaultScope[] {
    return defaultScopes.filter(x =>
      x.Survey.Id !== scopeToRemove.Survey.Id && x.Scope.Value !== scopeToRemove.Scope.Value);
  }
}
