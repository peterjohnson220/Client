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
  @Input() selection: number;
  @Output() selected = new EventEmitter();

  constructor() {}

  get isDisabled(): boolean {
    const item = this.availableExchangeItem;
    return !!item && !item.ValidRequest;
  }

  get isSelected(): boolean {
    const item = this.availableExchangeItem;
    const selection = this.selection;
    return item && selection && item.ExchangeId === selection;
  }
  get companies(): string {
    return this.availableExchangeItem ? this.availableExchangeItem.Companies.join(', ') : '';
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
