import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { StructureRangeGroupResponse, generateMockCompanyStructureRangeGroup } from 'libs/models/payfactors-api';
import {
  CompanyStructure,
  CompanyStructureView,
  CompanyStructurePaymarketGrade,
} from 'libs/models';



@Injectable({
  providedIn: 'root',
})
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

  getCurrentStructuresWithValidPaymarkets(): Observable<CompanyStructure[]> {
    return this.payfactorsApiService.get<CompanyStructure[]>(`${this.endpoint}/GetCurrentStructuresWithValidPaymarkets`);
  }

  getStructurePaymarketsAndGrades(companyStructureId: number): Observable<CompanyStructurePaymarketGrade[]> {
    return this.payfactorsApiService.get<CompanyStructurePaymarketGrade[]>(`${this.endpoint}(${companyStructureId})/Default.GetPaymarketsAndGrades`);
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
