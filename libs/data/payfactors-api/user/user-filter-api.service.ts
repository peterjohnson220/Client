import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SurveySavedFilterResponse, UserFilterGetAllRequest, UserFilterRemoveRequest,
         UserFilterUpsertRequest } from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class UserFilterApiService {
  private endpoint = 'UserFilter';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getAll(request: UserFilterGetAllRequest): Observable<SurveySavedFilterResponse[]> {
    return this.payfactorsApiService.post<SurveySavedFilterResponse[]>(`${this.endpoint}/GetAll`, request);
  }

  remove(request: UserFilterRemoveRequest): Observable<string> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Remove`, request);
  }

  upsert(request: UserFilterUpsertRequest): Observable<string> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Upsert`, request);
  }
}
