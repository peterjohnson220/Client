import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  AddStructuresRangeGroupJobsRequest,
  StructureRangeGroupResponse
} from 'libs/models/payfactors-api/structures';
import { AddStructuresRangeGroupJobsResponse } from 'libs/models/payfactors-api/structures/response/add-structures-range-group-jobs-response.model';
import { CompanyStructureInfo } from 'libs/models';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class StructureRangeGroupApiService {
  private readonly endpoint = 'StructureRangeGroup';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  addJobsToRangeGroup(companyStructuresRangeGroupId: number, request: AddStructuresRangeGroupJobsRequest): Observable<AddStructuresRangeGroupJobsResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}(${companyStructuresRangeGroupId})/Default.AddStructureRangeGroupJobBasedRanges`, request);
  }

  getCompanyStructureRangeGroup(companyStructureRangeGroupId: number): Observable<StructureRangeGroupResponse> {
    return this.payfactorsApiService.get<StructureRangeGroupResponse>(`${this.endpoint}(${companyStructureRangeGroupId})`);
  }

  addJobStructureMapping(companyJobId: number, structures: CompanyStructureInfo[]): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}/Default.AddJobStructureMapping`,
      {CompanyJobId: companyJobId, StructureData: structures});
  }

  publishStructureModel(companyStructureRangeGroupId: number): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}(${companyStructureRangeGroupId})/Default.Publish`);
  }
}
