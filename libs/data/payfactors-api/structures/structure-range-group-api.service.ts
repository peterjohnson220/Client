import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { StructureRangeGroupResponse } from 'libs/models/payfactors-api/structures';

import { PayfactorsApiService } from '../payfactors-api.service';
import { UpdateCompanyStructureRangeGroupNameDto } from '../../../models/structures/update-company-structure-range-group-name-dto.model';

@Injectable()
export class StructureRangeGroupApiService {
  private readonly endpoint = 'StructureRangeGroup';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getCompanyStructureRangeGroup(companyStructureRangeGroupId: number): Observable<StructureRangeGroupResponse> {
    return this.payfactorsApiService.get<StructureRangeGroupResponse>(`${this.endpoint}(${companyStructureRangeGroupId})`);
  }

  updateCompanyStructureRangeGroupName(updateCompanyStructureRangeGroupNameDto: UpdateCompanyStructureRangeGroupNameDto)
    : Observable<StructureRangeGroupResponse> {
    return this.payfactorsApiService.post<StructureRangeGroupResponse>(
      `${this.endpoint}(${updateCompanyStructureRangeGroupNameDto.CompanyStructuresRangeGroupId})/Default.UpdateNameAsync`,
      {RangeGroupName: updateCompanyStructureRangeGroupNameDto.RangeGroupName});
  }
}
