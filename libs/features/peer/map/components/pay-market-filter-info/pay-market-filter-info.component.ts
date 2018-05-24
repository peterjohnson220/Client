import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pf-pay-market-filter-info',
  templateUrl: './pay-market-filter-info.component.html',
  styleUrls: ['./pay-market-filter-info.component.scss']
})

export class PayMarketFilterInfoComponent {
  @Input() orgCount: number;
  @Input() incCount: number;
  @Input() hasSelections: boolean;
  @Output() resetAllFiltersClicked = new EventEmitter();

  constructor() { }

  handleResetFiltersLinkClicked() {
    this.resetAllFiltersClicked.emit();
  }

}
