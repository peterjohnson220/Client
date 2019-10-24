import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'comp'
})
export class CompPipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) { }

  transform(value: number): any {
    return value ? this.decimalPipe.transform(value / 1000.0, '1.1-1') : '&#8212;';
  }

}
