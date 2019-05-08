import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

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

  getJobDescriptionIds(companyJobId: number): Observable<number[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/Default.GetJobDescriptionIds`, { params: { companyJobId } });
  }

  getSchedules(): Observable<BulkExportSchedule[]> {
    return this.payfactorsApiService.get<BulkExportSchedule[]>(`${this.endpoint}/Default.GetBulkExportSchedule`);
  }

  removeSchedule(fileName: string): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.DeleteBulkExportSchedule`, { fileName });
  }

  downloadPdf(jdmDescriptionId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = 'export-type=pdf';
    return this.payfactorsApiService.downloadFile(`${this.endpoint}(${jdmDescriptionId})/Default.Export`, body, headers, true);
  }
}
