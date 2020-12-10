import { Pipe, PipeTransform } from '@angular/core';

import { EmployeeDetails } from '../../ui/employee-details/models/employee-details.model';

@Pipe({
  name: 'employeeDetails'
})
export class EmployeeDetailsPipe implements PipeTransform {
  transform(EmployeeDataRow: any): EmployeeDetails {
    return {
      BaseSalary: EmployeeDataRow['CompanyEmployees_Base'],
      Bonus: EmployeeDataRow['CompanyEmployees_Bonus'],
      TotalCashComp: EmployeeDataRow['CompanyEmployees_TotalCashCompensation'],
      TotalDirectComp: EmployeeDataRow['CompanyEmployees_TotalDirectCompensation'],
      STI: EmployeeDataRow['CompanyEmployees_STI'],
      LTI: EmployeeDataRow['CompanyEmployees_LTI'],
      BonusPercent: EmployeeDataRow['CompanyEmployees_BonusPct'],
      BonusTargetPercent: EmployeeDataRow['CompanyEmployees_BonusTargetPct'],
      BonusTarget: EmployeeDataRow['CompanyEmployees_Bonus_Target'],
      FullTimeEmployee: EmployeeDataRow['CompanyEmployees_FTE'],
      Allowances: EmployeeDataRow['CompanyEmployees_Allow'],
      TargetTCC: EmployeeDataRow['CompanyEmployees_TargetTCC'],
      TargetLTI: EmployeeDataRow['CompanyEmployees_TargetLTIP'],
      TotalFixedPay: EmployeeDataRow['CompanyEmployees_Fixed'],
      TargetTDC: EmployeeDataRow['CompanyEmployees_TargetTDC'],
      TotalGuaranteedPay: EmployeeDataRow['CompanyEmployees_TGP'],
      STI_Eligibility: EmployeeDataRow['CompanyEmployees_STIElig'],
      LTI_Eligibility:  EmployeeDataRow['CompanyEmployees_LTIElig'],
      TotalRemuneration: EmployeeDataRow['CompanyEmployees_Remun'],
      CurrencyCode: EmployeeDataRow['CompanyEmployees_Currency_Code'],
      Rate: EmployeeDataRow['CompanyEmployees_Rate'],
      EmployeeId: EmployeeDataRow['CompanyEmployees_Employee_ID'],
      FirstName: EmployeeDataRow['CompanyEmployees_First_Name'],
      LastName: EmployeeDataRow['CompanyEmployees_Last_Name'],
      DateOfHire: EmployeeDataRow['CompanyEmployees_DOH'],
      BaseMRP: EmployeeDataRow['CompanyEmployees_BaseSalaryMarketIndex'],
      TCC_Override: EmployeeDataRow['CompanyEmployees_TCC'],
      TDC_Override: EmployeeDataRow['CompanyEmployees_TDC']
    };
  }
}
