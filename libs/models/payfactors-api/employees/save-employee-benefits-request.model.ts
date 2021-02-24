import { EmployeeBenefit } from './employee-benefit.model';

export interface SaveEmployeeBenefitsRequest {
  CompanyEmployeeId: number;
  EmployeeId: string;
  Benefits: EmployeeBenefit[];
}
