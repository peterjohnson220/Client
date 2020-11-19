import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

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
  @ViewChild(PerfectScrollbarDirective, { static: true }) psDirectiveRef?: PerfectScrollbarDirective;

  public readonly psConfig: PerfectScrollbarConfigInterface = {
    minScrollbarLength: 100,
    maxScrollbarLength: 250
  };
  renderedPayMarketsLimit = 20;
  filteredPayMarkets: PricingPaymarket[];

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.paymarkets?.currentValue) {
      this.refreshScroll();
    }
  }

  togglePaymarket(payMarket: PricingPaymarket) {
    this.paymarketChecked.emit(payMarket);
  }

  trackById(index: number, paymarket: PricingPaymarket): number {
    return paymarket.CompanyPayMarketId;
  }

  loadMore(): void {
    this.updateFilteredPayMarkets();
    this.changeDetectorRef.detectChanges();
  }

  private updateFilteredPayMarkets(): void {
    if (!this.filteredPayMarkets || this.filteredPayMarkets.length === this.paymarkets.length) {
      return;
    }
    const endIndex = this.filteredPayMarkets.length + this.renderedPayMarketsLimit;
    this.filteredPayMarkets = endIndex < this.paymarkets.length
      ? this.paymarkets.slice(0, endIndex)
      : this.paymarkets;
  }

  private refreshScroll() {
    this.filteredPayMarkets = [];
    this.updateFilteredPayMarkets();
    // Push this task to the end of the queue to allow for DOM manipulation to complete.
    setTimeout(() => {
      const container = document.querySelector('.paymarket-card-container');

      if (container) {
        container.scrollLeft = 0;

        this.psDirectiveRef.update();
      }

    });
  }
}

