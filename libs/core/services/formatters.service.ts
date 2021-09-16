import { RateType } from '../../data/data-sets';

export class FormattersService {

  static formatCurrency(rawCurrency, locale, currencyCode, rate, useGrouping?) {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: rate === RateType.Hourly ? 2 : 0,
      maximumFractionDigits: rate === RateType.Hourly ? 2 : 0,
      useGrouping: useGrouping
    });

    return formatter.format(rawCurrency);
  }

  static buildEmployeeName(firstName: string, lastName: string, employeeId?: string): string {
    const employeeFirstName = firstName === null ? '' : firstName;
    const employeeLastName = lastName === null ? '' : lastName;
    if (employeeId) {
      return employeeFirstName + ' ' + employeeLastName + ' ' + '(' + employeeId + ')';
    }
    return employeeFirstName + ' ' + employeeLastName;
  }

  static roundNumber(value: number, precision: number): number {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}
