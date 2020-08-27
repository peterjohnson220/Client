import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CompanySetting } from 'libs/models/company';
import { CompanySettingsSaveRequest } from 'libs/models/payfactors-api/settings/request';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class CompanySettingsApiService {
  private endpoint = 'CompanySettings';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getSettings(): Observable<CompanySetting[]> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}.GetCompanySettings`);
  }


  putSettings(request: CompanySettingsSaveRequest) {
    return this.payfactorsApiService.put<any>(`${this.endpoint}.PutSettings`, { request: request });
  }

  getDefaultSettings(): Observable<CompanySetting[]> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}.GetDefaultSettings`);
  }

  getCompanySettings(companyId: number): Observable<CompanySetting[]> {
    return this.payfactorsApiService.get<CompanySetting[]>(`${this.endpoint}.GetSettings?companyId=${companyId}`);
  }
}
