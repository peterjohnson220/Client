import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SearchFilter, SearchRequest, SurveyDataFilterRequest, SurveyDataCut } from 'libs/models/survey-search';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class SurveySearchApiService {
  private endpoint = 'SurveySearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getDefaultSurveyScopesFilter(companyPayMarketId: number): Observable<SearchFilter> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetDefaultSurveyScopesFilter`, { params: { companyPayMarketId } });
  }

  searchSurveyJobs(searchRequest: SearchRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchSurveyJobs`, searchRequest);
  }

  searchDataCuts(surveyDataFilter: SurveyDataFilterRequest): Observable<SurveyDataCut[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetSurveyJobData`, surveyDataFilter);
  }
}
