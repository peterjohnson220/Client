import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CreateProjectRequest, ExportJobsRequest, GetJobInsightsRequest, JobDescriptionExportRequest, JobInsights } from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class JobsApiService {
  private endpoint = 'Jobs';

  constructor(private payfactorsApiService: PayfactorsApiService
  ) { }

  createProject(request: CreateProjectRequest) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddToProject`, request);
  }

  exportPricings(request: ExportJobsRequest): Observable<string> {
    return this.payfactorsApiService.post<string>(`${this.endpoint}/${request.Endpoint}`, {
      CompanyJobIds: request.CompanyJobIds,
      PricingIds: request.PricingIds,
      FileExtension: request.FileExtension,
      Name: request.Name,
      PageViewId: request.PageViewId
    });
  }

  loadCustomExports() {
    return this.payfactorsApiService.get(`CustomExport.GetCustomExportData?pageName=Jobs`);
  }

  getPricingsToModify(pricings: any[]) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/GetPricingsToModify`, pricings);
  }

  getPricingCuts(request: any) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/GetPricingCuts`, request);
  }

  getRunningExport(pageViewId: string): Observable<string> {
    return this.payfactorsApiService.post<string>(`${this.endpoint}/GetRunningExport`, {
      PageViewId: pageViewId
    });
  }

  exportJobDescription(request: JobDescriptionExportRequest): Observable<string> {
    return this.payfactorsApiService.post<string>(`${this.endpoint}/ExportJobDescriptionReport`, request);
  }

  getJobInsights(request: GetJobInsightsRequest): Observable<JobInsights> {
    return this.payfactorsApiService.post<JobInsights>(`${this.endpoint}/GetJobInsights`, request);
  }
}
