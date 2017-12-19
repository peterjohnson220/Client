import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ExchangeListItem, Exchange, ExchangeCompany, UpsertExchangeRequest } from '../../../models/peer';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ExchangeApiService {
  private endpoint = 'Exchange';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  upsertExchange(exchangeListItem: UpsertExchangeRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/UpsertExchange`, exchangeListItem);
  }

  getAllExchanges(): Observable<ExchangeListItem[]> {
    return this.payfactorsApiService.get<ExchangeListItem[]>(`${this.endpoint}/GetAllExchanges`);
  }

  getCompanies(exchangeId: number): Observable<ExchangeCompany[]> {
    return this.payfactorsApiService.get<ExchangeCompany[]>(`${this.endpoint}/GetCompanies`, { params: { exchangeId: exchangeId } });
  }

  getExchange(exchangeId: number): Observable<Exchange> {
    return this.payfactorsApiService.get<Exchange>(`${this.endpoint}/GetExchange`, { params: { exchangeId: exchangeId } });
  }
}
