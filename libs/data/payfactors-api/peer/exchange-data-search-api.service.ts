import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ExchangeMapFilter, InitialMapFilterRequest } from '../../../models/peer';
import { PayfactorsApiService } from '../payfactors-api.service';


@Injectable()
export class ExchangeDataSearchApiService {
  private endpoint = 'ExchangeDataSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getInitialMapFilter(initialMapFilterRequest: InitialMapFilterRequest): Observable<ExchangeMapFilter> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetInitialMapFilter`, {
      params: {
        CompanyJobId: initialMapFilterRequest.CompanyJobId,
        CompanyPayMarketId: initialMapFilterRequest.CompanyPayMarketId
      }
    });
  }
  getMapData(exchangeMapFilter: ExchangeMapFilter): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetMapData`, exchangeMapFilter);
  }

  // TODO: Response model
  getMapFilters(exchangeMapFilter: ExchangeMapFilter): Observable<any[]> {
   return this.payfactorsApiService.post(`${this.endpoint}/GetMapFilters`, exchangeMapFilter);
  }
}
