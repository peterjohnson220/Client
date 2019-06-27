import {
  CompanyListResponseModel, YoyDsMapRequest,
  YoyDsSurveysResponse,
  YoyDsToMapResponse,
  YoySurveyScopesResponse
} from 'libs/models/payfactors-api';
import { generateGuid } from 'libs/core/functions';

import { DataListItem, MatchResult, SurveyScope } from '../models';

export class PayfactorsApiModelMapper {

  ///
  /// IN
  ///
  static mapCompanyListResponseToCompanyListItem(response: CompanyListResponseModel[]): DataListItem[] {
    return response.map((r) => {
      return {
        Id: r.CompanyId,
        Name: r.CompanyName,
        Selected: false
      };
    });
  }

  static mapYoyDsSurveysResponseToSurveyListItem(response: YoyDsSurveysResponse[]): DataListItem[] {
    return response.map((r) => {
      return {
        Id: r.SurveyId,
        Name: `${r.SurveyPublisher} - ${r.SurveyName}`,
        Selected: false
      };
    });
  }

  static mapYoyDsToMapResponseToMatchResult(response: YoyDsToMapResponse[]): MatchResult[] {
    return response.map((r) => {
      return {
        Id: generateGuid(),
        CombinedScope: `${r.Scope1 || ''}/${r.Scope2 || ''}/${r.Scope3 || ''} - ${r.WeightingType || ''}`,
        Selected: false,
        IsExactMatch: r.IsExactMatch,
        OldSurveyId: r.OldSurveyId,
        Scope1: r.Scope1,
        Scope2: r.Scope2,
        Scope3: r.Scope3,
        WeightingType: r.WeightingType,
        NewSurveyId: r.NewSurveyID,
        NewScope1: r.NewScope1,
        NewScope2: r.NewScope2,
        NewScope3: r.NewScope3,
        NewWeightingType: r.NewWeightingType
      };
    });
  }

  static mapYoySurveyScopesResponseToSurveyScope(response: YoySurveyScopesResponse[]): SurveyScope[] {
    return response.map((r) => {
      return {
        Id: generateGuid(),
        Name: `${r.Scope1 || ''}/${r.Scope2 || ''}/${r.Scope3 || ''}`,
        WeightingType: r.WeightingType,
        Selected: false,
        Scope1: r.Scope1,
        Scope2: r.Scope2,
        Scope3: r.Scope3
      };
    });
  }


  ///
  /// OUT
  ///
  static mapMatchResultToYoyDsToMapResponse(mr: MatchResult): YoyDsToMapResponse {
    return {
      OldSurveyId: mr.OldSurveyId,
      Scope1: mr.Scope1,
      Scope2: mr.Scope2,
      Scope3: mr.Scope3,
      WeightingType: mr.WeightingType,
      NewSurveyID: mr.NewSurveyId,
      NewScope1: mr.NewScope1,
      NewScope2: mr.NewScope2,
      NewScope3: mr.NewScope3,
      NewWeightingType: mr.NewWeightingType,
      IsExactMatch: mr.IsExactMatch
    };
  }
  static buildYoYDsMapRequest(match: MatchResult, companyId: number): YoyDsMapRequest {
    return {
      companyId: companyId,
      yoyDSToMap: this.mapMatchResultToYoyDsToMapResponse(match)
    };
  }
}
