import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TabularReportExportSchedule } from 'libs/features/reports/models';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class TabularExportSchedulerApiService {
  private endpoint = 'TabularExportScheduler';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getExportSchedules(): Observable<TabularReportExportSchedule[]> {
    return this.payfactorsApiService.get<TabularReportExportSchedule[]>(`${this.endpoint}/GetExportSchedules`);
  }

  saveExportSchedule(request: TabularReportExportSchedule): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveExportSchedule`, request);
  }

  deleteExportSchedule(dataViewId: number): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/DeleteExportSchedule`, {DataViewId: dataViewId});
  }

  updateExportSchedule(request: TabularReportExportSchedule): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/UpdateExportSchedule`, request);
  }
}
