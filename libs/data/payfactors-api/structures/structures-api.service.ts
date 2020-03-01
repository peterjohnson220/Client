import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CompanyStructure } from '../../../models/structures/company-structure.model';
import { CompanyStructureView } from '../../../models/structures/company-structure-view.model';
import { StructureRangeGroupResponse, generateMockCompanyStructureRangeGroup } from '../../../models/payfactors-api/structures';

@Injectable()
export class StructuresApiService {
  private readonly endpoint = 'Structure';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getCompanyStructure(companyStructureId: number): Observable<CompanyStructure> {
    return this.payfactorsApiService.get<CompanyStructure>(`${this.endpoint}/GetStructureById`,
      { params: { companyStructureId: companyStructureId } });
  }

  getCompanyStructuresListViewData(): Observable<CompanyStructureView[]> {
    return this.payfactorsApiService.get<CompanyStructureView[]>(`${this.endpoint}/GetStructuresListViewData`);
  }

  addStructuresFavorite(companyStructureId: number): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}(${companyStructureId})/Default.AddFavorite`);
  }

  removeStructuresFavorite(companyStructureId: number): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}(${companyStructureId})/Default.RemoveFavorite`);
  }

  createModel(): Observable<StructureRangeGroupResponse> {
    return of(generateMockCompanyStructureRangeGroup());
  }

  getGradeNames() {
    return this.payfactorsApiService.get<string[]>(`${this.endpoint}/Default.GetGradeNames`);
  }
}
