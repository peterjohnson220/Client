import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SearchFilter } from 'libs/models/search';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class SurveySearchApiService {
  private endpoint = 'SurveySearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getDefaultSurveyScopesFilter(companyPayMarketId: number): Observable<SearchFilter> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetDefaultSurveyScopesFilter`, { params: { companyPayMarketId } });
  }
}
