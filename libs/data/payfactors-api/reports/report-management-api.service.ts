import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ReportDetailsResponse } from '../../../models/payfactors-api/reports';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ReportManagementApiService {
  private endpoint = 'ReportManagement';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getPayfactorsReportsDetails(): Observable<ReportDetailsResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetPayfactorsReportsDetails`);
  }
}
