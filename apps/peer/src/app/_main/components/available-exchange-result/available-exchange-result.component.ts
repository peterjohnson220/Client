import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AvailableExchangeItem } from 'libs/models/peer';

@Component({
  selector: 'pf-available-exchange-result',
  templateUrl: './available-exchange-result.component.html',
  styleUrls: ['./available-exchange-result.component.scss']
})
export class AvailableExchangeResultComponent {
  @Input() availableExchangeItem: AvailableExchangeItem;
  @Output() selected = new EventEmitter();

  constructor() {}

  handleOnClick() {
    this.selected.emit(this.availableExchangeItem.ExchangeId);
  }
}
