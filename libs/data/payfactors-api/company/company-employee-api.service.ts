import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { GenericTextValueDto } from 'libs/models/common';
import { CompanyEmployee } from 'libs/models/company';
import { EmployeeModalStructuresResponse, EmployeeRewardsData } from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
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

  getStructureNames(jobId: number, paymarketId: number, employeeId: number = null): Observable<EmployeeModalStructuresResponse[]> {
    if (jobId === 0 || paymarketId === 0) {
      return of([]);
    }
    return this.payfactorsApiService.get<EmployeeModalStructuresResponse[]>(`${this.endpoint}/Default.GetEmployeeModalStructures`,
      { params: { jobId, paymarketId, employeeId } });
  }

  createEmployee(employee: CompanyEmployee) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}`, employee);
  }

  get(companyEmployeeId: number): Observable<CompanyEmployee> {
    return this.payfactorsApiService.get<CompanyEmployee>(`${this.endpoint}(${companyEmployeeId})`);
  }

  patch(employee: CompanyEmployee) {
    return this.payfactorsApiService.patch<any>(`${this.endpoint}(${employee.CompanyEmployeeId})`, employee);
  }

  getBenefits(companyEmployeeId: number): Observable<EmployeeRewardsData> {
    return this.payfactorsApiService.get<EmployeeRewardsData>(`${this.endpoint}/GetBenefits`,
      { params: { companyEmployeeId } });
  }
}
