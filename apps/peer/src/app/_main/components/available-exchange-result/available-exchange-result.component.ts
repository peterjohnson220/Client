import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AvailableExchangeItem } from 'libs/models/peer';

@Component({
  selector: 'pf-available-exchange-result',
  templateUrl: './available-exchange-result.component.html',
  styleUrls: ['./available-exchange-result.component.scss']
})
export class AvailableExchangeResultComponent {
  @Input() availableExchangeItem: AvailableExchangeItem;
  @Input() companyNameFilter: string;
  @Input() selectedExchangeId: number;
  @Output() selected = new EventEmitter();

  constructor() {}

  get isDisabled(): boolean {
    const item = this.availableExchangeItem;
    return !!item && (item.PendingAccess || item.InExchange);
  }
  get isSelected(): boolean {
    const item = this.availableExchangeItem;
    const selectedExchangeId = this.selectedExchangeId;
    return item && selectedExchangeId && item.ExchangeId === selectedExchangeId;
  }
  get companies(): string {
    return this.availableExchangeItem ? this.availableExchangeItem.CompanyNames.join(', ') : '';
  }
  get industryCoverage(): string {
    return this.availableExchangeItem ? this.availableExchangeItem.TopIndustries.join(', ') : '';
  }

  handleOnClick() {
    if (!this.isDisabled) {
      this.selected.emit(this.availableExchangeItem);
    }
  }
}
