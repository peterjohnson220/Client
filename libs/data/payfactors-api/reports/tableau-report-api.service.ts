import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TableauReportResponse, TableauReportViewsResponse } from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class TableauReportApiService {
  private endpoint = 'TableauReport';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getStandardReports(): Observable<TableauReportResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetStandardReports`);
  }

  getStandardReportViewUrl(workbookId: string): Observable<string> {
    return this.payfactorsApiService.get(`${this.endpoint}/Default.GetStandardReportViewUrl`,
      { params: { workbookId: workbookId }});
  }

  getStandardReportSheetViewUrl(workbookName: string, viewName: string): Observable<string> {
    return this.payfactorsApiService.get(`${this.endpoint}/Default.GetStandardReportViewUrl`,
      { params: { workbookName: workbookName, viewName: viewName }});
  }

  getCompanyReportViewUrl(workbookId: string): Observable<string> {
    return this.payfactorsApiService.get(`${this.endpoint}/Default.GetCompanyReportViewUrl`,
      { params: { workbookId: workbookId }});
  }

  getCompanyReportSheetViewUrl(workbookName: string, viewName: string): Observable<string> {
    return this.payfactorsApiService.get(`${this.endpoint}/Default.GetCompanyReportViewUrl`,
      { params: { workbookName: workbookName, viewName: viewName }});
  }

  getCompanyReports(): Observable<TableauReportResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetCompanyReports`);
  }

  getCompanyReportViews(workbookId: string): Observable<TableauReportViewsResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/Default.GetCompanyWorkbookViews`,
      { params: { workbookId: workbookId }});
  }

  addWorkbookFavorite(workbookId: string): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.AddWorkbookFavorite`, { WorkbookId: workbookId });
  }

  removeWorkbookFavorite(workbookId: string): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.RemoveWorkbookFavorite`, { WorkbookId: workbookId });
  }

  refreshTableauReports(): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.RefreshTableauReports`);
  }

  getAllCompanyReportsViews(): Observable<TableauReportResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetAllCompanyReportsViews`);
  }

  addViewFavorite(viewId: string): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.AddViewFavorite`, { ViewId: viewId });
  }

  removeViewFavorite(viewId: string): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.RemoveViewFavorite`, { ViewId: viewId });
  }

  getCompanyViews(): Observable<TableauReportViewsResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetCompanyViews`);
  }
}
