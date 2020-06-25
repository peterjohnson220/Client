import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataViewExportResponse } from 'libs/models/payfactors-api/reports/response';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class NotificationsApiService {
  private endpoint = 'Notification';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  getDataViewsExports(): Observable<DataViewExportResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetDataViewsExportRecords`);
  }

  getTotalRewardsStatementPdfs(): Observable<any[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetTotalRewardsStatementPdfs`);
  }
}
