import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { Country, CountryCurrency } from '../../../models/common';

@Injectable()
export class CountryApiService {
  private readonly endpoint = 'Country';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getAll(): Observable<Country[]> {
    return this.payfactorsApiService.get<Country[]>(`${this.endpoint}`);
  }

  getAllCountryCurrency(): Observable<CountryCurrency[]> {
    return this.payfactorsApiService.get<CountryCurrency[]>(`${this.endpoint}/GetAllCountryCurrency`);
  }
}
