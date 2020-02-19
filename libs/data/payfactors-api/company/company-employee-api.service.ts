import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { GenericTextValueDto } from 'libs/models/common';
import { CompanyEmployee } from 'libs/models/company';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class CompanyEmployeeApiService {
  private endpoint = 'CompanyEmployee';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getDistinctDepartments(): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>(`${this.endpoint}/Default.GetDistinctDepartments`);
  }

  deleteEmployees(companyEmployeeIds: number[]): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Default.DeleteEmployees`, {
      CompanyEmployeeIds: companyEmployeeIds
    });
  }

  getGradeCodes(jobId: number, paymarketId: number, companyStructureId: number): Observable<GenericTextValueDto[]> {
    return this.payfactorsApiService.get<GenericTextValueDto[]>(`${this.endpoint}/Default.GetGradeCodes`,
      { params: { jobId, paymarketId, companyStructureId } });
  }

  getStructureNames(jobId: number, paymarketId: number): Observable<GenericTextValueDto[]> {
    return this.payfactorsApiService.get<GenericTextValueDto[]>(`${this.endpoint}/Default.GetStructureRangeGroupAndStructuresNames`,
      { params: { jobId, paymarketId } });
  }

  createEmployee(employee: CompanyEmployee) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}`, employee);
  }
}
