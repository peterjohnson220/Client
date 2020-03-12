import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import {
  AddProjectJobsRequest,
  AddProjectJobsResponse,
  CreateNewProjectJobRequest
} from '../../../models/payfactors-api';

@Injectable()
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
}
