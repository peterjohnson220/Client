import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ReportDetailsResponse, UpdatePayfactorsReportDetailsRequest } from '../../../models/payfactors-api/reports';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class ReportManagementApiService {
  private endpoint = 'ReportManagement';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getPayfactorsReportsDetails(): Observable<ReportDetailsResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetPayfactorsReportsDetails`);
  }

  syncPayfactorsReports(): Observable<number> {
    return this.payfactorsApiService.post(`${this.endpoint}/SyncPayfactorsReports`);
  }

  updatePayfactorsReportDetails(request: UpdatePayfactorsReportDetailsRequest): Observable<ReportDetailsResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/UpdatePayfactorsReportsDetails`, request);
  }
}
