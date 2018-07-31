import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterAggregateItem } from 'libs/models/peer/aggregate-filters';

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

  get checkDisabled() {
    return this.aggregate.Count === 0 && !this.aggregate.Selected;
  }

  handleAggregateSelected(aggregate: FilterAggregateItem) {
    if (!this.checkDisabled) {
      this.aggregateSelected.emit(aggregate);
    }
  }
}
