import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { AddProjectJobsRequest, AddProjectJobsResponse } from '../../../models/payfactors-api';

@Injectable()
export class ProjectApiService {
  private endpoint = 'Project';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  addJobs(projectId: number, addJobsRequest: AddProjectJobsRequest): Observable<AddProjectJobsResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}(${projectId})/Default.AddJobs`, addJobsRequest);
  }
}
