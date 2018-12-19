import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { PayMarket } from '../../../models/paymarket';

@Injectable()
export class PayMarketApiService {
  private endpoint = 'PayMarket';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  get(companyPayMarketId: number) {
    return this.payfactorsApiService
      .get<any>(`${this.endpoint}(${companyPayMarketId})`);
  }

  getAll(): Observable<PayMarket[]> {
    return this.payfactorsApiService
      .get<PayMarket[]>(`${this.endpoint}`);
  }
}
