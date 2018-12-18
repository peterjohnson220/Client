import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { JobSearchAggregationRequest, JobSearchRequest, JobSearchResponse, SearchFilter } from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../../payfactors-api.service';

@Injectable()
export class JobSearchApiService {
  private endpoint = 'JobSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getJobResults(searchRequest: JobSearchRequest): Observable<JobSearchResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetJobResults`, searchRequest);
  }

  searchJobAggregations(searchRequest: JobSearchAggregationRequest): Observable<SearchFilter> {
    return this.payfactorsApiService.post(`${this.endpoint}/SearchJobAggregations`, searchRequest);
  }
}
