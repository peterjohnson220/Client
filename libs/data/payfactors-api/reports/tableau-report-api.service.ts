import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TableauReportResponse } from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class TableauReportApiService {
  private endpoint = 'TableauReport';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getStandardReports(): Observable<TableauReportResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetStandardReports`);
  }

  getCompanyReports(): Observable<TableauReportResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetCompanyReports`);
  }

  addWorkbookFavorite(workbookId: string): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.AddWorkbookFavorite`, { WorkbookId: workbookId });
  }

  removeWorkbookFavorite(workbookId: string): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.RemoveWorkbookFavorite`, { WorkbookId: workbookId });
  }
}
