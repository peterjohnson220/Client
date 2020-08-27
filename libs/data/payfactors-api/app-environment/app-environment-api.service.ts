import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { GenericKeyValue } from '../../../models/common';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class AppEnvironmentApiService {
  private endpoint = 'AppEnvironment';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getMapboxPrecision(): Observable<GenericKeyValue<number, number>[]> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetMapboxPrecision`);
  }

}
