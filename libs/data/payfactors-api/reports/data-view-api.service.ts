import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CreateUserViewRequest, DataViewEntityResponse , UserDataViewResponse } from 'libs/models/payfactors-api';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class DataViewApiService {
  private endpoint = 'DataViews';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getBaseEntities(): Observable<DataViewEntityResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetBaseEntities`);
  }

  saveUserDataView(request: CreateUserViewRequest): Observable<number> {
    return this.payfactorsApiService.post(`${this.endpoint}/CreateUserDataView`, request);
  }

  getUserDataView(dataViewId: number): Observable<UserDataViewResponse> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetUserDataViewInfo`, { params: { dataViewId: dataViewId }});
  }
}
