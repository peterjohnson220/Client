import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cannotModifyPricingMatch',
  pure: true
})

export class CannotModifyPricingMatch implements PipeTransform {
  transform(linkedPayMarket: string, pricingMatchCount: number = 2) {
    if (pricingMatchCount <= 1) {
      return 'A pricing must have at least one match. You cannot delete the last match from a pricing.';
    } else if (linkedPayMarket) {
      return 'You cannot modify matches for linked Pay Markets';
    } else {
      return '';
    }
  }
}
