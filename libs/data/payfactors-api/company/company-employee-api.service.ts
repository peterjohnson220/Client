import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { GenericTextValueDto } from 'libs/models/common';
import { CompanyEmployee } from 'libs/models/company';
import {
  EmployeeBenefit, EmployeeModalStructuresResponse, EmployeeRewardsData, EmployeeRewardsDataRequest,
  SaveEmployeeBenefitsRequest, EmployeesPayModel
} from 'libs/models/payfactors-api';

import { PayfactorsApiService } from '../payfactors-api.service';
import { EmployeeInsights, GetEmployeeInsightsRequest } from '../../../models/payfactors-api/employees/employee-insights.model';

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
    employeeId = employeeId ?? 0;
    return this.payfactorsApiService.get<EmployeeModalStructuresResponse[]>(`${this.endpoint}/Default.GetEmployeeModalStructures`,
      { params: { jobId, paymarketId, employeeId } });
  }

  getEmployeesPayData(jobId: number, paymarketId: number): Observable<EmployeesPayModel[]> {
    if (jobId === 0 || paymarketId === 0) {
      return of([]);
    }
    return this.payfactorsApiService.get<EmployeesPayModel[]>(`${this.endpoint}/GetEmployeesPayData`,
      { params: { jobId, paymarketId } });
  }

  createEmployee(employee: CompanyEmployee): Observable<CompanyEmployee> {
    return this.payfactorsApiService.post<CompanyEmployee>(`${this.endpoint}`, employee);
  }

  get(companyEmployeeId: number): Observable<CompanyEmployee> {
    return this.payfactorsApiService.get<CompanyEmployee>(`${this.endpoint}(${companyEmployeeId})`);
  }

  patch(employee: CompanyEmployee) {
    return this.payfactorsApiService.patch<any>(`${this.endpoint}(${employee.CompanyEmployeeId})`, employee);
  }

  getBenefits(request: EmployeeRewardsDataRequest): Observable<EmployeeRewardsData> {
    return this.payfactorsApiService.get<EmployeeRewardsData>(`${this.endpoint}/GetBenefits`,
    { params: { companyEmployeeId: request.CompanyEmployeeId, statementId: request.StatementId } });
  }

  getMockBenefits(): Observable<EmployeeRewardsData> {
    return this.payfactorsApiService.get<EmployeeRewardsData>(`${this.endpoint}/GetMockBenefits`);
  }

  getEmployeeBenefits(companyEmployeeId: number, employeeId: string): Observable<EmployeeBenefit[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetEmployeeBenefits`,
      { params: { companyEmployeeId, employeeId } });
  }

  getNewEmployeeBenefits(): Observable<EmployeeBenefit[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetBenefitsLookup`);
  }

  saveEmployeeBenefits(request: SaveEmployeeBenefitsRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.SaveEmployeeBenefits`, request);
  }

  getEmployeeInsights(request: GetEmployeeInsightsRequest): Observable<EmployeeInsights> {
    return this.payfactorsApiService.post<EmployeeInsights>(`${this.endpoint}/Default.GetEmployeeInsights`,
      { EmployeeInsightsRequest: request });
  }
}
