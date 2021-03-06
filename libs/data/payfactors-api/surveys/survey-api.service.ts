import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { YoyDsSurveysResponse, YoyDsToMapResponse, YoySurveyScopesResponse, YoyDsMapRequest,
  GetCompanySurveysRequest, GetCompanySurveysResponse
} from '../../../models/payfactors-api';
import { UdfDataResponse } from '../../../models/payfactors-api/survey/response/udf-data-response.model';
import { CombinedScopeViewModel, SurveyDataCountryAccessDto, SurveyInfoByCompanyDto, SurveyJobDetails, SurveyParticipation } from 'libs/models';

@Injectable({
  providedIn: 'root',
})
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

  getCompanySurveys(request: GetCompanySurveysRequest): Observable<GetCompanySurveysResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.GetCompanySurveys`, request);
  }

  getScopesBySurvey(surveyId: number): Observable<CombinedScopeViewModel[]> {
    return this.payfactorsApiService.get<CombinedScopeViewModel[]>(`${this.endpoint}(${surveyId})/Default.GetScopesBySurvey`);
  }

  getSurveyParticipants(surveyId: number): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>(`${this.endpoint}/Default.GetSurveyParticipants`, {
      params: { surveyId: surveyId }
    });
  }

  getAccessibleSurveyCountries(): Observable<SurveyDataCountryAccessDto[]> {
    return this.payfactorsApiService.get<SurveyDataCountryAccessDto[]>(`${this.endpoint}/Default.GetAccessibleSurveyCountries`);
  }

  getSurveyYears(): Observable<number[]> {
    return this.payfactorsApiService.get<number[]>(`${this.endpoint}/Default.GetSurveyYears`);
  }

  getSurveyInfo(): Observable<SurveyInfoByCompanyDto[]> {
    return this.payfactorsApiService.get<SurveyInfoByCompanyDto[]>(`${this.endpoint}/Default.GetSurveyInfo`);
  }

  getSurveyJobDetails(surveyJobId: number): Observable<SurveyJobDetails> {
    return this.payfactorsApiService.get<SurveyJobDetails>(`${this.endpoint}/Default.GetSurveyJobDetails`, { params: { surveyJobId } });
  }

  saveSurveyParticipation(surveyInfo: SurveyInfoByCompanyDto): Observable<SurveyParticipation> {
    return this.payfactorsApiService.post<SurveyParticipation>(`${this.endpoint}/Default.SaveSurveyParticipation`,
      { SurveyInfo: surveyInfo });
  }
}
