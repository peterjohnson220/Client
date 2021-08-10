import { CurrencyPipe } from '@angular/common';

import { getUserLocale } from 'get-user-locale';

import { CompanyEmployee } from 'libs/models';
import { EmployeeBenefit, EmployeeInsights, EmployeeTotalRewardsLite } from 'libs/models/payfactors-api';

export class EmployeeTotalRewardsHelper {
  private static currencyPipe: CurrencyPipe = new CurrencyPipe(getUserLocale(), 'USD');

  static mapEmployeeInsightsToEmployeeTotalRewardsLite(data: EmployeeInsights): EmployeeTotalRewardsLite {
    return {
      CompanyEmployeeId: data.Employee.CompanyEmployeeId,
      FullName: `${data.Employee.FirstName} ${data.Employee.LastName}`,
      JobTitle: data.Employee['JobTitle'],
      JobCode: data.Employee.JobCode,
      CurrencyCode: data.Employee.CurrencyCode,
      Rate: data.Employee.Rate,
      EmployeeId: data.Employee.EmployeeId,
      BaseSalary: data.Employee['BaseSalary'],
      Bonus: data.Employee.Bonus,
      BonusTarget: data.Employee.BonusTarget,
      ShortTermIncentive: data.Employee.STI,
      LongTermIncentive: data.Employee.LTI,
      Benefits: data.EmployeeBenefits,
      TotalCashCompensation: this.calculateTotalCashCompensation(data.Employee),
      TotalBenefits: this.calculateTotalBenefits(data.EmployeeBenefits)
    };
  }

  static calculateTotalCashCompensation(employee: CompanyEmployee): number {
    return employee['BaseSalary'] + employee.Bonus + employee.BonusTarget + employee.STI + employee.LTI;
  }

  static calculateTotalBenefits(data: EmployeeBenefit[]): number {
    const employerValues = data.map(d => d.EmployerValue);
    const total = employerValues.reduce((a, b) => a + b, 0);
    return total;
  }

  static formatYAxisLabel(value: number, currencyCode: string) {
    const rawLabelValue = value < 1000 ? value : value / 1000;
    const decimals = '1.0-0';
    const formattedValue = this.currencyPipe.transform(rawLabelValue || 0, currencyCode, 'symbol-narrow', decimals, getUserLocale());
    return formattedValue + (value < 1000 ? '' : 'k');
  }
}
