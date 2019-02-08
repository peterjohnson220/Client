import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { PricingPaymarket } from '../../models';

@Component({
  selector: 'pf-select-paymarkets',
  templateUrl: './select-paymarkets.component.html',
  styleUrls: ['./select-paymarkets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectPaymarketsComponent {
  @Input() paymarkets: PricingPaymarket[];
  @Input() selectedPaymarketId: number;

  @Output() paymarketChecked = new EventEmitter<PricingPaymarket>();

  constructor() {}

  togglePaymarket(payMarket: PricingPaymarket) {
    this.paymarketChecked.emit(payMarket);
  }

  trackById(index: number, paymarket: PricingPaymarket): number {
    return paymarket.CompanyPayMarketId;
  }
}

