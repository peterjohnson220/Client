import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { Country } from '../../../models/common';

@Injectable()
export class CountryApiService {
  private readonly endpoint = 'Country';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getAll(): Observable<Country[]> {
    return this.payfactorsApiService.get<Country[]>(`${this.endpoint}`);
  }
}
