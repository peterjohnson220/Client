import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterAggregateItem } from 'libs/models/peer/aggregate-filters/index';

@Component({
  selector: 'pf-filter-aggregate',
  templateUrl: './filter-aggregate.component.html',
  styleUrls: ['./filter-aggregate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterAggregateComponent {
  @Input() aggregate: FilterAggregateItem;
  @Output() aggregateSelected = new EventEmitter<FilterAggregateItem>();

  constructor() { }

  handleAggregateSelected(aggregate: FilterAggregateItem) {
    this.aggregateSelected.emit(aggregate);
  }
}
