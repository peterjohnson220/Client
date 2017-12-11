import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ExchangeListItem, Exchange } from '../../../models/peer';

import { PayfactorsApiService } from '../payfactors-api.service';
import { HttpParams } from '@angular/common/http';


@Injectable()
export class ExchangeApiService {
  private endpoint = 'Exchange';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getExchange(exchangeId: number): Observable<Exchange> {
    return this.payfactorsApiService.get<Exchange>(`${this.endpoint}/GetExchange`, { params: { exchangeId: exchangeId } });
  }

  getAllExchanges(): Observable<ExchangeListItem[]> {
    return this.payfactorsApiService.get<ExchangeListItem[]>(`${this.endpoint}/GetAllExchanges`);
  }
}
