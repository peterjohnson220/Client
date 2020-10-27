export interface EmployeeRewardsData {
  CompanyName: string;
  EmployeeId: string;
  EmployeeFirstName: string;
  EmployeeLastName: string;
  EmployeeCity: string;
  EmployeeCountry: string;
  EmployeeJobCode: string;
  EmployeeDepartment: string;
  EmployeeDepartmentCode: string;
  EmployeeDOB: Date;
  EmployeeDOH: Date;
  EmployeeEmailAddress: string;
  EmployeeStatus: string;
  EmployeeFLSAStatus: string;
  EmployeeFTE: number;
  EmployeeLocation: string;
  EmployeeManagerEmployeeId: string;
  EmployeeState: string;
  EmployeeBase: number;
  EmployeeBonus: number;
  EmployeeSTI: number;
  EmployeeLTI: number;
  EmployeeSavings401KMatch: number;
  EmployeePensionPlan: number;
  EmployeeMedicalInsurance: number;
  EmployeeDentalInsurance: number;
  EmployeeVisionInsurance: number;
  EmployeeLifeInsurance: number;
  EmployeeShortTermDisability: number;
  EmployeeLongTermDisability: number;
  EmployeeTuitionReimbursement: number;
  EmployeePTO: number;
  EmployeeOtherAllowances: number;
  CurrentYear: number;
  Currency: string;
}

export function generateMockEmployeeRewardsData(): EmployeeRewardsData {
  return {
    CompanyName: 'Your Company',
    EmployeeId: '12345',
    EmployeeFirstName: 'John',
    EmployeeLastName: 'Smith',
    EmployeeCity: 'Scranton',
    EmployeeCountry: 'United States',
    EmployeeJobCode: 'ACC456',
    EmployeeDepartment: 'Accounting',
    EmployeeDepartmentCode: 'ACC',
    EmployeeDOB: new Date('04/03/80'),
    EmployeeDOH: new Date('08/12/19'),
    EmployeeEmailAddress: 'john.smith@company.com',
    EmployeeStatus: 'Full-Time',
    EmployeeFLSAStatus: 'Exempt',
    EmployeeFTE: 1,
    EmployeeLocation: 'Scranton',
    EmployeeManagerEmployeeId: 'ACC123',
    EmployeeState: 'MA',
    EmployeeBase: 150000,
    EmployeeBonus: 10000,
    EmployeeSTI: 5000,
    EmployeeLTI: 10000,
    EmployeeSavings401KMatch: 1500,
    EmployeePensionPlan: 2500,
    EmployeeMedicalInsurance: 11500,
    EmployeeDentalInsurance: 550,
    EmployeeVisionInsurance: 120,
    EmployeeLifeInsurance: 350,
    EmployeeShortTermDisability: 2400,
    EmployeeLongTermDisability: 600,
    EmployeeTuitionReimbursement: 1200,
    EmployeePTO: 5700,
    EmployeeOtherAllowances: 500,
    CurrentYear: new Date().getFullYear(),
    Currency: 'USD'
  };
}
