import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { YoyDsSurveysResponse, YoyDsToMapResponse, YoySurveyScopesResponse, YoyDsMapRequest } from '../../../models/payfactors-api';
import { UdfDataResponse } from '../../../models/payfactors-api/survey/response/udf-data-response.model';

@Injectable()
export class SurveyApiService {
  private endpoint = 'Survey';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getYoyDSSurveys(companyId: number): Observable<YoyDsSurveysResponse[]> {
    return this.payfactorsApiService.get<YoyDsSurveysResponse[]>(
      `${this.endpoint}/Default.GetYoyDSSurveys`, { params: { companyId } });
  }

  getYoyDSToMap(companyId: number, surveyId: number): Observable<YoyDsToMapResponse[]> {
    return this.payfactorsApiService.get<YoyDsToMapResponse[]>(
      `${this.endpoint}/Default.GetYoyDSToMap`, { params: { companyId, surveyId } });
  }

  getYoySurveyScopes(surveyId: number): Observable<YoySurveyScopesResponse[]> {
    return this.payfactorsApiService.get<YoySurveyScopesResponse[]>(
      `${this.endpoint}/Default.GetListOfYoySurveyScopes`, { params: { surveyId } });
  }

  getUdfData(companyId: number): Observable<UdfDataResponse> {
    return this.payfactorsApiService.post(
      `${this.endpoint}/GetUdfData?companyId=${companyId}`);
  }

  mapDefaultScopesYoy(request: YoyDsMapRequest) {
    return this.payfactorsApiService.post(`${this.endpoint}(0)/Default.MapDefaultScopesYOY`, request);
  }
}
