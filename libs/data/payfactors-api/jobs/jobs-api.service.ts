import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';
import { AddToProjectRequest, ChangeJobStatusRequest } from 'libs/models/payfactors-api';

@Injectable()
export class JobsApiService {
  private endpoint = 'Jobs';
  private endpointLegacy = 'CompanyJob';

  constructor(private payfactorsApiService: PayfactorsApiService
  ) { }

  addToProject(request: AddToProjectRequest) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddToProject`, request);
  }

  changeJobStatus(request: ChangeJobStatusRequest) {
    return this.payfactorsApiService.post<any>(`${this.endpointLegacy}/Default.SetStatusForJobs`, request);
  }
}
