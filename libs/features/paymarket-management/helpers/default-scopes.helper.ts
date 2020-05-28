import { Survey, CombinedScopeViewModel } from 'libs/models/survey';

import { CompanySurvey, CombinedScope } from '../models';

export class DefaultScopesHelper {
  static mapSurveysToCompanySurveys(surveys: Survey[]): CompanySurvey[] {
    return surveys.map(s => {
      const effectiveDate = new Date(s.EffectiveDate);
      const formattedDate = `${effectiveDate.getMonth() + 1}/${effectiveDate.getDay()}/${effectiveDate.getFullYear()}`;
      return {
        Id: s.SurveyId,
        Title: s.SurveyName,
        Publisher: s.SurveyPublisher,
        EffectiveDate: s.EffectiveDate,
        DisplayName: `${s.SurveyPublisher} - ${s.SurveyName} (${formattedDate})`
      };
    });
  }

  static mapCombinedScopeViewModelsToCombinedScopes(response: CombinedScopeViewModel[]): CombinedScope[] {
    return response.map(s => {
      return {
        Name: s.CombinedScopeDisplay,
        Value: s.CombinedScopeValue
      };
    });
  }
}
