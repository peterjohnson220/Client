import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { getUserLocale } from 'get-user-locale';

@Pipe({
  name: 'contributionCurrency',
  pure: true
})
export class ContributionCurrencyPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(value: number, currency: string): string {
    const decimals = '1.2-2';
    return this.currencyPipe.transform(value || 0, currency, 'symbol-narrow', decimals, getUserLocale());
  }
}
