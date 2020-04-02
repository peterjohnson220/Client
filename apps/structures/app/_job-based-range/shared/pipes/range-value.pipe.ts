import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { RateType } from 'libs/data/data-sets';

@Pipe({
  name: 'rangeValue'
})
export class RangeValuePipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) { }

  transform(value: number, rate: string = RateType.Annual): any {
    if (value) {
      return rate === RateType.Hourly ?
        this.decimalPipe.transform(value, '1.2-2') :
        this.decimalPipe.transform(value, '1.0-0');
    }
  }
}

