import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterAggregateItem } from 'libs/models/peer/aggregate-filters';

@Component({
  selector: 'pf-peer-data-cut-filter-option',
  templateUrl: './filter-option.component.html',
  styleUrls: ['./filter-option.component.scss']
})
export class FilterOptionComponent {
  @Input() option: FilterAggregateItem;
  @Output() optionSelected = new EventEmitter();

  // TODO[BC]: This will be passed in as an input as we will be updated from the store
  selected: boolean;

  constructor() { }

  handleOptionClicked(option: FilterAggregateItem) {
    this.optionSelected.emit(option);
    this.selected = !this.selected;
  }
}
