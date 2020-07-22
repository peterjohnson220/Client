import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cannotDeletePricingMatchMessage',
  pure: true
})

export class CannontDeletePricingMatchMessage implements PipeTransform {
  transform(pricingMatchCount: number, linkedPayMarket: string) {
    if (pricingMatchCount <= 1) {
      return 'A pricing must have at least one match. You cannot delete the last match from a pricing.';
    } else if (linkedPayMarket) {
      return 'You cannot delete matches for linked Pay Markets';
    } else {
      return '';
    }
  }
}
