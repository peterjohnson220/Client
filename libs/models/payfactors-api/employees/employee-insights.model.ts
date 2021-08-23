import { CompanyEmployee } from '../../company';
import { EmployeeBenefit } from './employee-benefit.model';

export interface EmployeeInsights {
  Employee: CompanyEmployee;
  EmployeeBenefits: EmployeeBenefit[];
  CurrencyName: string;
  StructureRangeGroupId: number;
}

export interface GetEmployeeInsightsRequest {
  CompanyEmployeeId: number;
  EmployeeId: string;
}

export interface EmployeeTotalRewardsLite {
  CompanyEmployeeId: number;
  FullName: string;
  JobTitle: string;
  JobCode: string;
  CurrencyCode: string;
  Rate: string;
  EmployeeId: string;
  BaseSalary: number;
  Bonus: number;
  BonusTarget: number;
  ShortTermIncentive: number;
  LongTermIncentive: number;
  Benefits: EmployeeBenefit[];
  PeerOtherAllowance: number;
  TotalCashCompensation: number;
  TotalBenefits: number;
}
