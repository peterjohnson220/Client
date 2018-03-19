import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterAggregateGroup, FilterAggregateItem } from 'libs/models/peer/aggregate-filters';

import { AggregateSelectionInfo } from '../../models';

@Component({
  selector: 'pf-filter-aggregate-group',
  templateUrl: './filter-aggregate-group.component.html',
  styleUrls: ['./filter-aggregate-group.component.scss']
})
export class FilterAggregateGroupComponent {
  @Input() aggregateGroup: FilterAggregateGroup;
  @Output() aggregateToggled = new EventEmitter<AggregateSelectionInfo>();

  collapsed: boolean;
  showAllAggregates: boolean;
  selections: string[] = [];

  constructor() { }

  get categoryLabel(): string {
    return this.aggregateGroup.MetaData.Label;
  }

  get filterAggregates(): FilterAggregateItem[] {
    return this.aggregateGroup.Aggregates;
  }

  handleAggregateSelected(aggregateItem: FilterAggregateItem) {
    this.aggregateToggled.emit({
      AggregateGroup: this.aggregateGroup.MetaData.FilterProp,
      AggregateItem: aggregateItem.Item
    });
  }
}
