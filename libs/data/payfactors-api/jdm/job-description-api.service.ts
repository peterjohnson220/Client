import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { BulkExportSchedule } from '../../../models/jdm';

@Injectable()
export class JobDescriptionApiService {
  private endpoint = 'JobDescription';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  addSchedule(schedule: BulkExportSchedule): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.CreateBulkExportSchedule`, { schedule });
  }

  getSchedules(): Observable<BulkExportSchedule[]> {
    return this.payfactorsApiService.get<BulkExportSchedule[]>(`${this.endpoint}/Default.GetBulkExportSchedule`);
  }

  removeSchedule(fileName: string): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.DeleteBulkExportSchedule`, { fileName });
  }
}
