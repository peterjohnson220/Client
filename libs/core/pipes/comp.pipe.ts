import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
export enum compRate {
  annual = 'Annual',
  hourly = 'Hourly'
}
export enum annualDisplay {
  truncated = 'truncated',
  full = 'full',
  rounded = 'rounded',
  truncatedRounded = 'truncatedRounded'
}
@Pipe({
  name: 'comp'
})
export class CompPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) { }
  transform(value: number, rate: string = compRate.annual, type: string = annualDisplay.truncated): any {
    if (value === null || rate === null) {
      return value;
    }
    if (rate.toLowerCase() === compRate.hourly.toLowerCase()) {
      return this.decimalPipe.transform(value, '1.2-2');
    } else if (type === annualDisplay.truncated) {
      return this.decimalPipe.transform(value / 1000.0, '1.1-1');
    } else if (type === annualDisplay.full) {
      return this.decimalPipe.transform(value, '1.1-1');
    } else if (type === annualDisplay.rounded) {
      return this.decimalPipe.transform(value, '1.0-0');
    } else if (type === annualDisplay.truncatedRounded) {
      return this.decimalPipe.transform(value / 1000.0, '1.0-0');
    } else {
      return value;
    }
  }
}
