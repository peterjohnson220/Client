import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ExchangeMapFilter, InitialMapFilterRequest } from '../../../models/peer';
import { PayfactorsApiService } from '../payfactors-api.service';


@Injectable()
export class ExchangeDataSearchApiService {
  private endpoint = 'ExchangeDataSearch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  // TODO: request model
  getInitialMapFilter(initialMapFilterRequest: InitialMapFilterRequest): Observable<ExchangeMapFilter> {
    console.log('payload: ', initialMapFilterRequest);
    return this.payfactorsApiService.get(`${this.endpoint}/GetInitialMapFilter`, {
      params: {
        CompanyJobId: initialMapFilterRequest.CompanyJobId,
        CompanyPayMarketId: initialMapFilterRequest.CompanyPayMarketId
      }
    });
  }
  getMapData(exchangeMapFilter: ExchangeMapFilter): Observable<any> {
    console.log('getMapData: ', exchangeMapFilter);
    return this.payfactorsApiService.post(`${this.endpoint}/GetMapData`, exchangeMapFilter);
  }
}
