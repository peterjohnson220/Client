import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { TableauReportResponse } from '../../../models/payfactors-api/data-insights/response';

@Injectable()
export class TableauReportApiService {
  private endpoint = 'TableauReport';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  getCompanyReports(): Observable<TableauReportResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetCompanyReports`);
  }
}
