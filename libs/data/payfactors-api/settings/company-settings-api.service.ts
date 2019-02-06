import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CompanySetting } from 'libs/models/company';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CompanySettingsSaveRequest } from 'libs/models/payfactors-api/settings/request';

@Injectable()
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
}
