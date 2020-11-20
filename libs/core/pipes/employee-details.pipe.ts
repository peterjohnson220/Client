import { Pipe, PipeTransform } from '@angular/core';
import { EmployeeDetails } from '../../ui/employee-details/models/employee-details.model';

@Pipe({
  name: 'employeeDetails'
})
export class EmployeeDetailsPipe implements PipeTransform {

  currencyOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };

  transform(EmployeeDataRow: any): EmployeeDetails {
    return {
      Base_Salary: this.currencyConverter(EmployeeDataRow['CompanyEmployees_Base']),
      Bonus: this.currencyConverter(EmployeeDataRow['CompanyEmployees_Bonus']),
      Total_Cash_Comp: this.currencyConverter(EmployeeDataRow['CompanyEmployees_TotalCashCompensation']),
      Total_Direct_Comp: this.currencyConverter(EmployeeDataRow['CompanyEmployees_TotalDirectCompensation']),
      STI: this.currencyConverter(EmployeeDataRow['CompanyEmployees_STI']),
      LTI: this.currencyConverter(EmployeeDataRow['CompanyEmployees_LTI']),
      Bonus_Percent: this.nullChecker(EmployeeDataRow['CompanyEmployees_BonusPct']),
      Bonus_Target_Percent: this.nullChecker(EmployeeDataRow['CompanyEmployees_BonusTargetPct']),
      Bonus_Target: this.currencyConverter(EmployeeDataRow['CompanyEmployees_Bonus_Target']),
      Full_Time_Employee: this.bitConverter(EmployeeDataRow['CompanyEmployees_FTE']),
      Allowances: this.nullChecker(EmployeeDataRow['CompanyEmployees_Allow']),
      Target_TCC: this.currencyConverter(EmployeeDataRow['CompanyEmployees_TargetTCC']),
      Target_LTI: this.currencyConverter(EmployeeDataRow['CompanyEmployees_TargetLTIP']),
      Total_Fixed_Pay: this.currencyConverter(EmployeeDataRow['CompanyEmployees_Fixed']),
      Target_TDC: this.currencyConverter(EmployeeDataRow['CompanyEmployees_TargetTDC']),
      Total_Guaranteed_Pay: this.currencyConverter(EmployeeDataRow['CompanyEmployees_TGP']),
      STI_Eligibility: this.bitConverter(EmployeeDataRow['CompanyEmployees_STIElig']),
      LTI_Eligibility:  this.bitConverter(EmployeeDataRow['CompanyEmployees_LTIElig']),
      Total_Remuneration: this.currencyConverter(EmployeeDataRow['CompanyEmployees_Remun'])
    };
  }

  bitConverter(value: string): string {
    return value === null ? '--' : Number(value) === 1 ? 'Yes' : 'No';
  }

  currencyConverter(value: string): string {
    return value === null ? '--' : Number(value).toLocaleString('en', this.currencyOptions);
  }

  nullChecker(value: string): string {
    return value === null ? '--' : value;
  }

}
