import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterAggregateItem } from 'libs/models/peer/aggregate-filters';

@Component({
  selector: 'pf-filter-aggregate',
  templateUrl: './filter-aggregate.component.html',
  styleUrls: ['./filter-aggregate.component.scss']
})
export class FilterAggregateComponent {
  @Input() aggregate: FilterAggregateItem;
  @Output() aggregateSelected = new EventEmitter();

  // TODO[BC]: This will be passed in as an input as we will be updated from the store
  selected: boolean;

  constructor() { }

  handleAggregateSelected(aggregate: FilterAggregateItem) {
    this.aggregateSelected.emit(aggregate);
    this.selected = !this.selected;
  }
}
