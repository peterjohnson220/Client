import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ExchangeListItem } from '../../../models/peer/exchange-list-item.model';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ExchangeApiService {
  private endpoint = 'Exchange';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getAllExchanges(): Observable<ExchangeListItem[]>{
    return this.payfactorsApiService.get<ExchangeListItem[]>(`${this.endpoint}/GetAllExchanges`);
  }
}














