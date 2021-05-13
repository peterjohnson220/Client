import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weightingType'
})
export class WeightingTypePipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'I') {
      return 'Inc';
    } else if (value === 'O') {
      return 'Org';
    } else {
      return value;
    }
  }
}