import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserContext } from '../../../models/security';

@Injectable()
export class CompanySecurityApiService {

  constructor(private http: HttpClient) {}

  getIdentity() {
    return this.http.get<UserContext>('/odata/CompanySecurity.GetIdentity');
  }

}
