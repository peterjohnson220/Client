import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ExchangeJobSearchAutocompleteRequest } from '../../../../models/payfactors-api/exchange-job-search/request';
import { PayfactorsApiService } from '../../payfactors-api.service';
import {ExchangeJobSearchOption} from '../../../../models/peer/ExchangeJobSearchOption';

@Injectable()
export class ExchangeJobSearchApiService {
  private endpoint = 'ExchangeJobSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getJobSearchAutocompleteResults(autocompleteRequest: ExchangeJobSearchAutocompleteRequest): Observable<ExchangeJobSearchOption[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetAutocompleteSuggestions`, autocompleteRequest);
  }
}
