import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import {
  CompanyStructureRangeGroup
} from '../../../models/structures/company-structure-range-group.model';
import { UpdateCompanyStructureRangeGroupNameDto } from '../../../models/structures/update-company-structure-range-group-name-dto.model';

@Injectable()
export class StructuresRangeGroupApiService {
  private readonly endpoint = 'StructureRangeGroup';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getCompanyStructureRangeGroup(companyStructureRangeGroupId: number): Observable<CompanyStructureRangeGroup> {
    return this.payfactorsApiService.get<CompanyStructureRangeGroup>(`${this.endpoint}(${companyStructureRangeGroupId})`);
  }

  updateCompanyStructureRangeGroupName(updateCompanyStructureRangeGroupNameDto: UpdateCompanyStructureRangeGroupNameDto)
    : Observable<CompanyStructureRangeGroup> {
    return this.payfactorsApiService.post<CompanyStructureRangeGroup>(
      `${this.endpoint}(${updateCompanyStructureRangeGroupNameDto.CompanyStructuresRangeGroupId})/Default.UpdateNameAsync`,
      {RangeGroupName: updateCompanyStructureRangeGroupNameDto.RangeGroupName});
  }
}
