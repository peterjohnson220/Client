import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { PricingPaymarket } from '../../models';

@Component({
  selector: 'pf-paymarket-cards',
  templateUrl: './paymarket-cards.component.html',
  styleUrls: ['./paymarket-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymarketCardsComponent implements OnChanges {
  @Input() paymarkets: PricingPaymarket[];
  @Input() selectedPaymarketId: number;
  @Output() paymarketChecked = new EventEmitter<PricingPaymarket>();
  @ViewChild(PerfectScrollbarDirective) psDirectiveRef?: PerfectScrollbarDirective;

  public readonly psConfig: PerfectScrollbarConfigInterface = {
    minScrollbarLength: 100,
    maxScrollbarLength: 250
  };

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.paymarkets) {
      const container = document.querySelector('.paymarket-card-container');
      container.scrollLeft = 0;

      this.psDirectiveRef.update();
    }
  }

  togglePaymarket(payMarket: PricingPaymarket) {
    this.paymarketChecked.emit(payMarket);
  }

  trackById(index: number, paymarket: PricingPaymarket): number {
    return paymarket.CompanyPayMarketId;
  }
}

