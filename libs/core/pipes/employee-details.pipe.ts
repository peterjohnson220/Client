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
      Base_Salary: EmployeeDataRow['CompanyEmployees_Base'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_Base']).toLocaleString('en', this.currencyOptions),
      Bonus: EmployeeDataRow['CompanyEmployees_Bonus'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_Bonus']).toLocaleString('en', this.currencyOptions),
      Total_Cash_Comp: EmployeeDataRow['CompanyEmployees_TotalCashCompensation'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_TotalCashCompensation']).toLocaleString('en', this.currencyOptions),
      Total_Direct_Comp: EmployeeDataRow['CompanyEmployees_TDC'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_TDC']).toLocaleString('en', this.currencyOptions),
      STI: EmployeeDataRow['CompanyEmployees_STI'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_STI']).toLocaleString('en', this.currencyOptions),
      LTI: EmployeeDataRow['CompanyEmployees_LTI'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_LTI']).toLocaleString('en', this.currencyOptions),
      Bonus_Percent: EmployeeDataRow['CompanyEmployees_BonusPct'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_BonusPct']).toLocaleString('en', this.currencyOptions),
      Bonus_Target_Percent: EmployeeDataRow['CompanyEmployees_BonusTargetPct'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_BonusTargetPct']).toLocaleString('en', this.currencyOptions),
      Bonus_Target: EmployeeDataRow['CompanyEmployees_Bonus_Target'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_Bonus_Target']).toLocaleString('en', this.currencyOptions),
      Full_Time_Employee: EmployeeDataRow['CompanyEmployees_FTE'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_FTE']).toLocaleString('en', this.currencyOptions),
      Allowances: EmployeeDataRow['CompanyEmployees_Allow'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_Allow']).toLocaleString('en', this.currencyOptions),
      Target_TCC: EmployeeDataRow['CompanyEmployees_TargetTCC'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_TargetTCC']).toLocaleString('en', this.currencyOptions),
      Target_LTI: EmployeeDataRow['CompanyEmployees_TargetLTIP'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_TargetLTIP']).toLocaleString('en', this.currencyOptions),
      Total_Fixed_Pay: EmployeeDataRow['CompanyEmployees_Fixed'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_Fixed']).toLocaleString('en', this.currencyOptions),
      Target_TDC: EmployeeDataRow['CompanyEmployees_TargetTDC'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_TargetTDC']).toLocaleString('en', this.currencyOptions),
      Total_Guaranteed_Pay: EmployeeDataRow['CompanyEmployees_TGP'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_TGP']).toLocaleString('en', this.currencyOptions),
      STI_Eligibility: EmployeeDataRow['CompanyEmployees_STIElig'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_STIElig']).toLocaleString('en', this.currencyOptions),
      LTI_Eligibility: EmployeeDataRow['CompanyEmployees_LTIElig'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_LTIElig']).toLocaleString('en', this.currencyOptions),
      Total_Remuneration: EmployeeDataRow['CompanyEmployees_Remun'] === null ? '--' :
        Number(EmployeeDataRow['CompanyEmployees_Remun']).toLocaleString('en', this.currencyOptions)
    };
  }

}
