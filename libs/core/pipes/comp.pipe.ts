import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export enum compRate {
  annual = 'Annual',
  hourly = 'Hourly'
}

@Pipe({
  name: 'comp'
})
export class CompPipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) { }

  transform(value: number, rate: string = compRate.annual): any {
    if (value) {
      return rate === compRate.hourly ?
        this.decimalPipe.transform(value, '1.2-2') :
        this.decimalPipe.transform(value / 1000.0, '1.1-1');
    }
  }
}

