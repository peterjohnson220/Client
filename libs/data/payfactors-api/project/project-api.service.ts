import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayMarketCut } from 'libs/models/paymarket';

import { PayfactorsApiService } from '../payfactors-api.service';
import {
  AddProjectJobsRequest,
  AddProjectJobsResponse,
  CreateNewProjectJobRequest,
  SavePayMarketsCutsRequest
} from '../../../models/payfactors-api';

@Injectable({
  providedIn: 'root',
})
export class ProjectApiService {
  private endpoint = 'Project';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  addJobs(projectId: number, request: AddProjectJobsRequest): Observable<AddProjectJobsResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}(${projectId})/Default.AddJobs`, request);
  }

  createNewJob(projectId: number, request: CreateNewProjectJobRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}(${projectId})/Default.CreateNewJob`, request);
  }

  createFromEmployees(companyEmployeeIds: number[]): Observable<number> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.CreateFromEmployees`,
      {
        CompanyEmployeeIds: companyEmployeeIds
      });
  }

  getPayMarketCuts(companyPayMarketId: number): Observable<PayMarketCut[]> {
    return this.payfactorsApiService.get<PayMarketCut[]>(`${this.endpoint}/GetPayMarketCuts`,
      { params: { companyPayMarketId } }
    );
  }

  savePayMarketsCuts(request: SavePayMarketsCutsRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.SaveMDCutWeights`, request);
  }
}
