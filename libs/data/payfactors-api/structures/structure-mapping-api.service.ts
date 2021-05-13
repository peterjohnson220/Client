import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  AutoGradeJobsModelResponse,
  AutoGradeJobsRequestModel,
  SaveCompanyJobStructureMapsRequest,
  SwitchRegressionFlagsRequest,
} from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class StructureMappingApiService {
  private readonly endpoint = 'StructureMapping';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  saveStructureGradeMappings(request: SaveCompanyJobStructureMapsRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/SaveStructureGradeMappings`, request);
  }

  switchRegressionFlags(request: SwitchRegressionFlagsRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/SwitchRegressionFlags`, request);
  }

  getGradesWithJobsCount(rangeGroupId: number): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetGradesWithJobsCount?rangeGroupId=${rangeGroupId}`);
  }

  autoGradeJobs(request: AutoGradeJobsRequestModel): Observable<AutoGradeJobsModelResponse> {
    return this.payfactorsApiService.post<AutoGradeJobsModelResponse>(`${this.endpoint}/AutoGradeJobs`, request);
  }
}
