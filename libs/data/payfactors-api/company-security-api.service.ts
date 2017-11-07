import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CompanySecurityApiService {

  constructor(private http: HttpClient) {}

  getIdentity() {
    return this.http.get('/odata/CompanySecurity.GetIdentity');
  }

}
