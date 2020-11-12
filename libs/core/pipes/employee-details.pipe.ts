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
        Number(EmployeeDataRow['CompanyEmployees_LTI']).toLocaleString('en', this.currencyOptions)
    };
  }

}
