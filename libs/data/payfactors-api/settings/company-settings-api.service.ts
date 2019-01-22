import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CompanySetting } from 'libs/models/company';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class CompanySettingsApiService {
  private endpoint = 'CompanySettings';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getSettings(): Observable<CompanySetting[]> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}.GetCompanySettings`);
  }

}
