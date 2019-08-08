import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { DataViewEntityResponse } from 'libs/models/payfactors-api';

@Injectable()
export class DataViewApiService {
  private endpoint = 'DataViews';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getBaseEntities(): Observable<DataViewEntityResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetBaseEntities`);
  }
}
