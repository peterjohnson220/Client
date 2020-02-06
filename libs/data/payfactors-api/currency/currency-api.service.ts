import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CurrencyDto } from '../../../models/common';

@Injectable()
export class CurrencyApiService {
  private readonly endpoint = 'Currency';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getCurrencies(): Observable<CurrencyDto[]> {
    return this.payfactorsApiService.get<CurrencyDto[]>(`${this.endpoint}`);
  }
}
