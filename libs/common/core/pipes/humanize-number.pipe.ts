// https://stackoverflow.com/questions/43059961/anagular2-pipes-currency-abbreviation (JP)
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'humanizeNumber' })
export class HumanizeNumberPipe implements PipeTransform {

  transform(value: number): string {
    let newValue: string = !value ? '' : value.toString();
    if (value >= 1000) {
      const suffixes = ['', 'K', 'M', 'B', 'T'];
      const suffixNum = Math.floor( ('' + value).length / 3 );
      let shortValue;
      for (let precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat( (suffixNum !== 0 ? (value / Math.pow(1000, suffixNum) ) : value).toPrecision(precision));
        const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
        if (dotLessShortValue.length <= 2) { break; }
      }
      if (shortValue % 1 !== 0) {
        shortValue = shortValue.toFixed(1);
      }
      newValue = `${shortValue}${suffixes[suffixNum]}`;
    }
    return newValue;
  }
}
