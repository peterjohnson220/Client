import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  StructureRangeGroupResponse
} from 'libs/models/payfactors-api/structures';
import { CompanyStructureInfo } from 'libs/models';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class StructureRangeGroupApiService {
  private readonly endpoint = 'StructureRangeGroup';

  constructor(private payfactorsApiService: PayfactorsApiService) {
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
