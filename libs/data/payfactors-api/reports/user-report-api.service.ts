import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UpsertUserReportTag, SaveWorkbookOrderRequest, SaveReportOrderRequest } from '../../../models/payfactors-api/reports/request';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserReportApiService {
  private endpoint = 'UserReport';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  upsertUserReportTag(request: UpsertUserReportTag): Observable<any[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/UpsertUserReportTag`, request);
  }

  saveWorkbookOrder(request: SaveWorkbookOrderRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveWorkbookOrder`, request);
  }

  saveReportOrder(request: SaveReportOrderRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveReportOrder`, request);
  }
}
