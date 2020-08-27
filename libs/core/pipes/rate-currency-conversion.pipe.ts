import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rateCurrencyConvert'
})

export class RateCurrencyConversionPipe implements PipeTransform {
  constructor () {}

  transform(value: number, sourceRate: 'Annual' | 'Hourly', destinationRate: 'Annual' | 'Hourly', currencyConversionFactor: number = 1) {
    if (!value && value !== 0) {
      return value;
    }

    let result = value;

    if (currencyConversionFactor !== 1) {
      result *= currencyConversionFactor;
    }

    if (sourceRate && destinationRate && sourceRate !== destinationRate) {
      if (sourceRate === 'Annual') {
        result /= 2080;
      } else {
        result *= 2080;
      }
    }

    return result;
  }
}
