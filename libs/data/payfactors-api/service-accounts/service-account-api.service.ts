import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ServiceAccountRequest, ServiceAccountUser, ServiceAccountUserStatus } from 'libs/models';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceAccountApiService {
  private endpoint = 'ServiceAccount';

  constructor(
      private payfactorsApiService: PayfactorsApiService,
  ) { }

  createAccount(request: ServiceAccountRequest): Observable<ServiceAccountUser> {
    return this.payfactorsApiService.post(`${this.endpoint}/Create`, request);
  }

  getAccountStatus(request: ServiceAccountRequest): Observable<ServiceAccountUserStatus> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetAccountStatus`, request);
  }

  resetAccount(request: ServiceAccountRequest): Observable<ServiceAccountUser> {
    return this.payfactorsApiService.post(`${this.endpoint}/Reset`, request);
  }
}
