import { Dictionary } from 'lodash';
import { GenericKeyValue } from 'libs/models/common';

export interface EmployeeRewardsData {
  CompanyName: string;
  EmployeeId: string;
  EmployeeJobTitle: string;
  EmployeeFirstName: string;
  EmployeeLastName: string;
  EmployeeCity: string;
  EmployeeCountry: string;
  EmployeeJobCode: string;
  EmployeeDepartment: string;
  EmployeeDOB: Date;
  EmployeeDOH: Date;
  EmployeeEmailAddress: string;
  EmployeeStatus: string;
  EmployeeFLSAStatus: string;
  EmployeeFTE: number;
  EmployeeManagerEmployeeId: string;
  EmployeeState: string;
  EmployeeBase: number;
  EmployeeBonus: number;
  EmployeeSTI: number;
  EmployeeLTI: number;
  CurrentYear: number;
  Currency: string;
  IsMockData?: boolean;
  BenefitsData?: Dictionary<BenefitsData>;
  EmployeesUdf?: GenericKeyValue<string, number>;
  JobsUdf?: GenericKeyValue<string, number>;
}

export interface BenefitsData {
  EmployeeId: string;
  FieldName: string;
  Category: string;
  DisplayName: string;
  EmployerValue?: number;
  CompanyEmployeeValue?: number;
}


export function generateMockEmployeeRewardsData(): EmployeeRewardsData {

  return {
    CompanyName: 'Your Company',
    EmployeeId: '12345',
    EmployeeJobTitle: 'Product Manager',
    EmployeeFirstName: 'John',
    EmployeeLastName: 'Smith',
    EmployeeCity: 'Scranton',
    EmployeeCountry: 'United States',
    EmployeeJobCode: 'ACC456',
    EmployeeDepartment: 'Accounting',
    EmployeeDOB: new Date('04/03/80'),
    EmployeeDOH: new Date('08/12/19'),
    EmployeeEmailAddress: 'john.smith@company.com',
    EmployeeStatus: 'Full-Time',
    EmployeeFLSAStatus: 'Exempt',
    EmployeeFTE: 1,
    EmployeeManagerEmployeeId: 'ACC123',
    EmployeeState: 'MA',
    EmployeeBase: 150000,
    EmployeeBonus: 10000,
    EmployeeSTI: 5000,
    EmployeeLTI: 10000,
    CurrentYear: new Date().getFullYear(),
    Currency: 'USD',
    IsMockData: true,
    BenefitsData: generateMockBenefitsData()
  };
}

export function generateMockBenefitsData(): Dictionary<BenefitsData> {
  const benefitData: Dictionary<BenefitsData> = {};

  benefitData['Savings_401K_Match'] = {
      EmployeeId: '12345',
      FieldName: 'Savings_401K_Match',
      Category: 'Retirement',
      DisplayName: '401k Savings Match',
      EmployerValue: 1500,
      CompanyEmployeeValue: 500
  };

  benefitData['Pension_Plan'] = {
    EmployeeId: '12345',
    FieldName: 'Pension_Plan',
    Category: 'Retirement',
    DisplayName: 'Pension Plan',
    EmployerValue: 2500,
    CompanyEmployeeValue: 500
  };

  benefitData['Medical_Plan'] = {
    EmployeeId: '12345',
    FieldName: 'Medical_Plan',
    Category: 'Insurance',
    DisplayName: 'Medical Insurance',
    EmployerValue: 11500,
    CompanyEmployeeValue: 500
  };

  benefitData['Dental_Plan'] = {
    EmployeeId: '12345',
    FieldName: 'Dental_Plan',
    Category: 'Insurance',
    DisplayName: 'Dental Insurance',
    EmployerValue: 550,
    CompanyEmployeeValue: 500
  };

  benefitData['Vision_Plan'] = {
    EmployeeId: '12345',
    FieldName: 'Vision_Plan',
    Category: 'Insurance',
    DisplayName: 'Vision Insurance',
    EmployerValue: 120,
    CompanyEmployeeValue: 500
  };

  benefitData['Life_Insurance'] = {
    EmployeeId: '12345',
    FieldName: 'Life_Insurance',
    Category: 'Insurance',
    DisplayName: 'Life Insurance',
    EmployerValue: 350,
    CompanyEmployeeValue: 500
  };

  benefitData['Short_Term_Disability'] = {
    EmployeeId: '12345',
    FieldName: 'Short_Term_Disability',
    Category: 'Insurance',
    DisplayName: 'Short Term Disability',
    EmployerValue: 2400,
    CompanyEmployeeValue: 500
  };

  benefitData['Long_Term_Disability'] = {
    EmployeeId: '12345',
    FieldName: 'Long_Term_Disability',
    Category: 'Insurance',
    DisplayName: 'Long Term Disability',
    EmployerValue: 600,
    CompanyEmployeeValue: 500
  };

  benefitData['Tuition_Reimbursement'] = {
    EmployeeId: '12345',
    FieldName: 'Tuition_Reimbursement',
    Category: 'AdditionalBenefits',
    DisplayName: 'Tuition Reimbursement',
    EmployerValue: 1200,
    CompanyEmployeeValue: 0
  };

  benefitData['PTO'] = {
    EmployeeId: '12345',
    FieldName: 'PTO',
    Category: 'AdditionalBenefits',
    DisplayName: 'Employee PTO',
    EmployerValue: 5700,
    CompanyEmployeeValue: 0
  };

  benefitData['Other_Allowance'] = {
    EmployeeId: '12345',
    FieldName: 'Other_Allowance',
    Category: 'AdditionalBenefits',
    DisplayName: 'Other Allowances',
    EmployerValue: 500,
    CompanyEmployeeValue: 0
  };
  return benefitData;
}
