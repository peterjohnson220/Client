import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class CompanySettingsApiService {
  private endpoint = 'CompanySettings';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getSettings(companyId: number): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}.GetSettings`, {
      params: {
        companyId: companyId
      }
    });
  }

}
