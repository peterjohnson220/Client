import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SearchSavedFilterResponse, UserFilterGetAllRequest, UserFilterRemoveRequest,
         UserFilterUpsertRequest } from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserFilterApiService {
  private endpoint = 'UserFilter';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getAll(request: UserFilterGetAllRequest): Observable<SearchSavedFilterResponse[]> {
    return this.payfactorsApiService.post<SearchSavedFilterResponse[]>(`${this.endpoint}/GetAll`, request);
  }

  remove(request: UserFilterRemoveRequest): Observable<string> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Remove`, request);
  }

  upsert(request: UserFilterUpsertRequest): Observable<string> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Upsert`, request);
  }
}
