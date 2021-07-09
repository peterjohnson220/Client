import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ExchangeJobSearchAutocompleteRequest,
  RelationalExchangeJobSearchAggregationRequest,
  RelationalExchangeJobSearchRequest,
  RelationalExchangeJobSearchResponse
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

  getRelationalExchangeJobSearchResults(request: RelationalExchangeJobSearchRequest): Observable<RelationalExchangeJobSearchResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetRelationalExchangeJobSearchResults`, request);
  }

  getRelationalExchangeJobSearchAggregationResults(request: RelationalExchangeJobSearchAggregationRequest): Observable<SearchFilter> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetRelationalExchangeJobSearchAggregationResults`, request);
  }

}
