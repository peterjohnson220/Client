import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  SearchFilter,
  SearchRequest,
  SurveyDataFilterRequest,
  SurveyDataResponse,
  AddSurveyDataCutRequest,
  AddSurveyDataCutMatchResponse,
  PricingMatchesResponse,
  PricingMatchesRequest,
  PricingMatchesDetailsRequest,
  SaveSearchFiltersRequest,
  SearchContextResponse,
  SearchSurveyAggregationsRequest,
  JobsToPriceRequest,
  MatchedSurveyJob
} from 'libs/models/survey-search';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class SurveySearchApiService {
  private endpoint = 'SurveySearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getDefaultSurveyScopesFilter(companyPayMarketId: number): Observable<SearchFilter> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetDefaultSurveyScopesFilter`, { params: { companyPayMarketId } });
  }

  getProjectSearchContext(projectId: number): Observable<SearchContextResponse> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetProjectSearchContext`, { params: { projectId } });
  }

  searchSurveyJobs(searchRequest: SearchRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchSurveyJobs`, searchRequest);
  }

  searchDataCuts(surveyDataFilter: SurveyDataFilterRequest): Observable<SurveyDataResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetSurveyJobData`, surveyDataFilter);
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

  saveSearchFilters(request: SaveSearchFiltersRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveSearchFilters`, request);
  }

  getSavedFilters(payMarketId: number): Observable<SearchFilter[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetSavedFilters`, { params: { payMarketId } });
  }

  getJobsToPrice(request: JobsToPriceRequest): Observable<MatchedSurveyJob[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetMatchedSurveyJobs`, request );
  }
}
