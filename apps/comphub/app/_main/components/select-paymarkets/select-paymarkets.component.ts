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

  @Output() paymarketChecked: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  togglePaymarket(paymarketId: number) {
    this.paymarketChecked.emit(paymarketId);
  }

  trackById(index: number, paymarket: PricingPaymarket): number {
    return paymarket.CompanyPayMarketId;
  }
}

