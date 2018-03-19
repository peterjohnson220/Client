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

  // TODO[BC]: Connect this to the store. Will require the FilterAggregateItem model to include a selected boolean.
  selected: boolean;

  constructor() { }

  handleAggregateSelected(aggregate: FilterAggregateItem) {
    this.aggregateSelected.emit(aggregate);
    this.selected = !this.selected;
  }
}
