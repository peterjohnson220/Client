import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  JobSearchAggregationRequest,
  JobSearchPricingDataRequest,
  JobSearchPricingDataResponse,
  JobSearchRequest,
  JobSearchRequestStructuresRangeGroup,
  JobSearchResponse,
  SearchFilter,
  JobSearchAutocompleteRequest,
  JobBasedRangeJobSearchResponse,
  JobSearchStructuresAggregationRequest,
  ProjectJobSearchPricingDataRequest,
  StructuresJobSearchPricingDataRequest
} from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../../payfactors-api.service';

@Injectable()
export class JobSearchApiService {
  private endpoint = 'JobSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getModelBasedJobResults(searchRequest: JobSearchRequestStructuresRangeGroup): Observable<JobBasedRangeJobSearchResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetStructureRangeGroupJobResults`, searchRequest);
  }

  getJobResults(searchRequest: JobSearchRequest): Observable<JobSearchResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetJobResults`, searchRequest);
  }

  searchStructuresJobAggregations(searchRequest: JobSearchStructuresAggregationRequest): Observable<SearchFilter> {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchJobAggregations`, searchRequest);
  }

  searchJobAggregations(searchRequest: JobSearchAggregationRequest): Observable<SearchFilter> {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchJobAggregations`, searchRequest);
  }

  getJobPricingData(jobPriceRequest: ProjectJobSearchPricingDataRequest): Observable<JobSearchPricingDataResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetJobPriceData`, jobPriceRequest);
  }

  getStructureJobPricingData(jobPriceRequest: StructuresJobSearchPricingDataRequest): Observable<JobSearchPricingDataResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetJobPriceData`, jobPriceRequest);
  }

  getJobSearchAutocompleteResults(autocompleteRequest: JobSearchAutocompleteRequest): Observable<string[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetAutocompleteSuggestions`, autocompleteRequest);
  }
}
