import { CompanyEmployee } from '../../company';
import { EmployeeBenefit } from './employee-benefit.model';

export interface EmployeeInsights {
  Employee: CompanyEmployee;
  EmployeeBenefits: EmployeeBenefit[];
  CurrencyName: string;
}

export interface GetEmployeeInsightsRequest {
  CompanyEmployeeId: number;
  EmployeeId: string;
}
