import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  JobSearchAggregationRequest,
  JobSearchPricingDataRequest,
  JobSearchPricingDataResponse,
  JobSearchRequest,
  JobSearchResponse,
  SearchFilter,
  JobSearchAutocompleteRequest
} from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../../payfactors-api.service';

@Injectable()
export class JobSearchApiService {
  private endpoint = 'JobSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getModelBasedJobResults(searchRequest: JobSearchRequest): Observable<JobSearchResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetJobResults`, searchRequest);
  }

  getJobResults(searchRequest: JobSearchRequest): Observable<JobSearchResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetJobResults`, searchRequest);
  }

  searchJobAggregations(searchRequest: JobSearchAggregationRequest): Observable<SearchFilter> {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchJobAggregations`, searchRequest);
  }

  getJobPricingData(jobPriceRequest: JobSearchPricingDataRequest): Observable<JobSearchPricingDataResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetJobPriceData`, jobPriceRequest);
  }

  getJobSearchAutocompleteResults(autocompleteRequest: JobSearchAutocompleteRequest): Observable<string[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetAutocompleteSuggestions`, autocompleteRequest);
  }
}
