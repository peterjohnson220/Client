import { CurrencyPipe } from '@angular/common';

import { getUserLocale } from 'get-user-locale';

import { CompanyEmployee } from 'libs/models';
import { EmployeeBenefit, EmployeeInsights, EmployeeTotalRewardsLite } from 'libs/models/payfactors-api';
import { FormattersService } from 'libs/core';
import { RateType } from 'libs/data/data-sets';

export class EmployeeTotalRewardsHelper {
  private static currencyPipe: CurrencyPipe = new CurrencyPipe(getUserLocale(), 'USD');

  static mapEmployeeInsightsToEmployeeTotalRewardsLite(data: EmployeeInsights): EmployeeTotalRewardsLite {
    return {
      CompanyEmployeeId: data.Employee.CompanyEmployeeId,
      FullName: FormattersService.buildEmployeeName(data.Employee.FirstName, data.Employee.LastName),
      JobTitle: data.Employee['JobTitle'],
      JobCode: data.Employee.JobCode,
      CurrencyCode: data.Employee.CurrencyCode,
      Rate: data.Employee.Rate,
      EmployeeId: data.Employee.EmployeeId,
      BaseSalary: data.Employee.Rate === RateType.Hourly ?  this.calculateHourlyRateBaseSalary(data.Employee['BaseSalary'], data.Employee.FTE) : data.Employee['BaseSalary'],
      Bonus: data.Employee.Bonus,
      BonusTarget: data.Employee.BonusTarget,
      ShortTermIncentive: data.Employee.STI,
      LongTermIncentive: data.Employee.LTI,
      Benefits: data.EmployeeBenefits,
      PeerOtherAllowance: data.Employee.PeerOtherAllowance,
      TotalCashCompensation: this.calculateTotalCashCompensation(data.Employee),
      TotalBenefits: this.calculateTotalBenefits(data.EmployeeBenefits, data.Employee.PeerOtherAllowance)
    };
  }

  static calculateTotalCashCompensation(employee: CompanyEmployee): number {
    let baseSalary = employee['BaseSalary'];
    if (employee.Rate === RateType.Hourly) {
      baseSalary = this.calculateHourlyRateBaseSalary(baseSalary, employee.FTE);
    }
    return baseSalary + employee.Bonus + employee.BonusTarget + employee.STI + employee.LTI;
  }

  static calculateTotalBenefits(data: EmployeeBenefit[], peerOtherAllowance: number): number {
    const employerValues = data.map(d => d.EmployerValue);
    const total = employerValues.reduce((a, b) => a + b, 0) + (peerOtherAllowance ?? 0);
    return total;
  }

  static formatYAxisLabel(value: number, currencyCode: string) {
    const rawLabelValue = value < 1000 ? value : value / 1000;
    const decimals = '1.0-0';
    const formattedValue = this.currencyPipe.transform(rawLabelValue || 0, currencyCode, 'symbol-narrow', decimals, getUserLocale());
    return formattedValue + (value < 1000 ? '' : 'k');
  }

  static calculateHourlyRateBaseSalary(hourlyRate: number, fte: number): number {
    return hourlyRate * 2080 * fte;
  }
}
