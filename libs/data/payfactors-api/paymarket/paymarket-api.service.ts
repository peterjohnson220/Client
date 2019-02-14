import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AddPayMarketRequest } from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../payfactors-api.service';
import { PayMarket } from '../../../models/paymarket';
import { GenericKeyValue } from '../../../models/common';

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

  getAllByCountryCode(countryCode: string): Observable<PayMarket[]> {
    return this.payfactorsApiService
      .get<PayMarket[]>(`${this.endpoint}`, { params: { $filter: `CountryCode eq '${countryCode}'` } });
  }

  getExchangeScopeSelections(companyPayMarketId: number): Observable<any> {
    return this.payfactorsApiService.get<GenericKeyValue<number, string>[]>(
      `${this.endpoint}/GetExchangeScopeSelections`,
      { params: { companyPayMarketId: companyPayMarketId } }
    );
  }

  insert(request: AddPayMarketRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Default.Insert`, request);
  }
}
