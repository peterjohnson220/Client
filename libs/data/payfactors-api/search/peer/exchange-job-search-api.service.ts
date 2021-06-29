import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ExchangeJobSearchAutocompleteRequest,
  MdJobExchangeJobSearchAggregationRequest,
  MdJobExchangeJobSearchRequest,
  MDJobExchangeJobSearchResponse
} from 'libs/models/payfactors-api/exchange-job-search';
import { SearchFilter } from 'libs/models/payfactors-api';
import { ExchangeJobSearchOption } from 'libs/models/peer/ExchangeJobSearchOption';

import { PayfactorsApiService } from '../../payfactors-api.service';



@Injectable({
  providedIn: 'root',
})
export class ExchangeJobSearchApiService {
  private endpoint = 'ExchangeJobSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getJobSearchAutocompleteResults(autocompleteRequest: ExchangeJobSearchAutocompleteRequest): Observable<ExchangeJobSearchOption[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetAutocompleteSuggestions`, autocompleteRequest);
  }

  getMDJobExchangeJobSearchResults(request: MdJobExchangeJobSearchRequest): Observable<MDJobExchangeJobSearchResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetMDJobExchangeJobSearchResults`, request);
  }
  getMDJobExchangeJobSearchAggregationResults(request: MdJobExchangeJobSearchAggregationRequest): Observable<SearchFilter> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetMDJobExchangeJobSearchAggregationResults`, request);
  }

}
