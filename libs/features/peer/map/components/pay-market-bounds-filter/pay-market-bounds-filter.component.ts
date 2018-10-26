import { Component, EventEmitter, Input, Output } from '@angular/core';

import { stateAbbrevToFullName } from 'libs/core/functions';
import { PayMarket } from 'libs/models';

@Component({
  selector: 'pf-pay-market-bounds-filter',
  templateUrl: './pay-market-bounds-filter.component.html',
  styleUrls: ['./pay-market-bounds-filter.component.scss']
})
export class PayMarketBoundsFilterComponent {
  @Input() enabled: boolean;
  @Input() payMarket: PayMarket;
  @Output() limitToPayMarketToggled = new EventEmitter();

  constructor() { }

  buildLabel(payMarket: PayMarket): string {
    if (!payMarket) {
      return '';
    }

    let boundsLabel = '';

    switch (payMarket.GeoLabel) {
      case 'Metro':
        boundsLabel = `${payMarket.GeoValue} Metro`;
        break;
      case 'State':
        boundsLabel = stateAbbrevToFullName(payMarket.GeoValue);
        break;
      default:
        boundsLabel = payMarket.GeoValue;
        break;
    }

    if (payMarket.CountryCode) {
      boundsLabel = boundsLabel + ' ' + payMarket.CountryCode;
    }

    return boundsLabel;
  }

  handleSwitchToggled() {
    this.limitToPayMarketToggled.emit();
  }
}
