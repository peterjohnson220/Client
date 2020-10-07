import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  SearchFilter,
  SurveyDataFilterRequest,
  SurveyJobDataResponse,
  AddSurveyDataCutRequest,
  AddSurveyDataCutMatchResponse,
  PricingMatchesResponse,
  PricingMatchesRequest,
  PricingMatchesDetailsRequest,
  SearchContextResponse,
  SearchSurveyAggregationsRequest,
  JobsToPriceRequest,
  MatchedSurveyJob,
  JobMatchCutsRequest,
  JobMatchCutsResponse,
  UpdateUserJobMatchesRequest,
  SurveySearchRequest,
  ExchangeDataFilterRequest, ExchangeJobDataResponse
} from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class SurveySearchApiService {
  private endpoint = 'SurveySearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getDefaultSurveyScopesFilter(companyPayMarketId: number): Observable<SearchFilter> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetDefaultSurveyScopesFilter`, { params: { companyPayMarketId } });
  }

  getProjectSearchContext(projectId: number): Observable<SearchContextResponse> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetProjectSearchContext`, { params: { projectId } });
  }

  searchSurveyJobs(searchRequest: SurveySearchRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchSurveyJobs`, searchRequest);
  }

  searchDataCuts(surveyDataFilter: SurveyDataFilterRequest): Observable<SurveyJobDataResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetSurveyJobData`, surveyDataFilter);
  }

  getExchangeJobData(exchangeDataFilter: ExchangeDataFilterRequest): Observable<ExchangeJobDataResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetExchangeJobData`, exchangeDataFilter);
  }

  addSurveyDataCuts(addDataRequest: AddSurveyDataCutRequest): Observable<AddSurveyDataCutMatchResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/AddSurveyDataCut`, addDataRequest);
  }

  getPricingMatches(pricingMatchesRequest: PricingMatchesRequest): Observable<PricingMatchesResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetPricingMatches`, pricingMatchesRequest);
  }

  getPricingMatchesDetails(pricingMatchesDetailsRequest: PricingMatchesDetailsRequest): Observable<string[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetPricingMatchesDetails`, pricingMatchesDetailsRequest);
  }

  searchSurveyAggregations(request: SearchSurveyAggregationsRequest): Observable<SearchFilter> {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchSurveyAggregations`, request);
  }

  getJobsToPrice(request: JobsToPriceRequest): Observable<MatchedSurveyJob[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetMatchedSurveyJobs`, request );
  }

  getJobMatchCuts(request: JobMatchCutsRequest): Observable<JobMatchCutsResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetMatchJobCuts`, request );
  }

  updateUserJobMatches(request: UpdateUserJobMatchesRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/UpdateUserJobMatches`, request );
  }
}
