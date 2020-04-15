import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export enum compRate {
  annual = 'Annual',
  hourly = 'Hourly'
}

export enum annualDisplay {
  truncated = 'truncated',
  full = 'full'
}

@Pipe({
  name: 'comp'
})
export class CompPipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) { }

  transform(value: number, rate: string = compRate.annual, type: string = annualDisplay.truncated): any {
    if (value) {
      return rate.toLowerCase() === compRate.hourly.toLowerCase() ?
        this.decimalPipe.transform(value, '1.2-2') :
        type === annualDisplay.truncated ?
          this.decimalPipe.transform(value / 1000.0, '1.1-1') :
          this.decimalPipe.transform(value , '1.0-0');
    } else {
      return value;
    }
  }
}

