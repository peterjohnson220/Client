import { Pipe, PipeTransform } from '@angular/core';

import { EmployeeDetails } from '../../ui/employee-details/models/employee-details.model';

@Pipe({
  name: 'employeeDetails'
})
export class EmployeeDetailsPipe implements PipeTransform {
  transform(EmployeeDataRow: any): EmployeeDetails {
    return {
      Base_Salary: EmployeeDataRow['CompanyEmployees_Base'],
      Bonus: EmployeeDataRow['CompanyEmployees_Bonus'],
      Total_Cash_Comp: EmployeeDataRow['CompanyEmployees_TotalCashCompensation'],
      Total_Direct_Comp: EmployeeDataRow['CompanyEmployees_TotalDirectCompensation'],
      STI: EmployeeDataRow['CompanyEmployees_STI'],
      LTI: EmployeeDataRow['CompanyEmployees_LTI'],
      Bonus_Percent: EmployeeDataRow['CompanyEmployees_BonusPct'],
      Bonus_Target_Percent: EmployeeDataRow['CompanyEmployees_BonusTargetPct'],
      Bonus_Target: EmployeeDataRow['CompanyEmployees_Bonus_Target'],
      Full_Time_Employee: EmployeeDataRow['CompanyEmployees_FTE'],
      Allowances: EmployeeDataRow['CompanyEmployees_Allow'],
      Target_TCC: EmployeeDataRow['CompanyEmployees_TargetTCC'],
      Target_LTI: EmployeeDataRow['CompanyEmployees_TargetLTIP'],
      Total_Fixed_Pay: EmployeeDataRow['CompanyEmployees_Fixed'],
      Target_TDC: EmployeeDataRow['CompanyEmployees_TargetTDC'],
      Total_Guaranteed_Pay: EmployeeDataRow['CompanyEmployees_TGP'],
      STI_Eligibility: EmployeeDataRow['CompanyEmployees_STIElig'],
      LTI_Eligibility:  EmployeeDataRow['CompanyEmployees_LTIElig'],
      Total_Remuneration: EmployeeDataRow['CompanyEmployees_Remun'],
      Currency_Code: EmployeeDataRow['CompanyEmployees_Currency_Code'],
      Rate: EmployeeDataRow['CompanyEmployees_Rate'],
      Employee_Id: EmployeeDataRow['CompanyEmployees_Employee_ID'],
      First_Name: EmployeeDataRow['CompanyEmployees_First_Name'],
      Last_Name: EmployeeDataRow['CompanyEmployees_Last_Name'],
      Date_Of_Hire: EmployeeDataRow['CompanyEmployees_DOH'],
      BaseMRP: EmployeeDataRow['CompanyEmployees_TotalCashCompensationMarketIndex'],
    };
  }
}
