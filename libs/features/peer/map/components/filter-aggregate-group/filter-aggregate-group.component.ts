import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { FilterAggregateGroup, FilterAggregateItem } from 'libs/models/peer/aggregate-filters/index';

import { AggregateSelectionInfo } from '../../models/index';

@Component({
  selector: 'pf-filter-aggregate-group',
  templateUrl: './filter-aggregate-group.component.html',
  styleUrls: ['./filter-aggregate-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterAggregateGroupComponent {
  @Input() aggregateGroup: FilterAggregateGroup;
  @Input() previewLimit: number;
  @Output() aggregateToggled = new EventEmitter<AggregateSelectionInfo>();
  @Output() clearSelections = new EventEmitter<FilterAggregateGroup>();

  collapsed: boolean;
  showAllAggregates: boolean;

  constructor() { }

  get categoryLabel(): string {
    return this.aggregateGroup.MetaData.Label;
  }

  get filterAggregates(): FilterAggregateItem[] {
    return this.showAllAggregates ? this.aggregateGroup.Aggregates : this.aggregateGroup.AggregatesPreview;
  }

  get hasSelections(): boolean {
    return this.aggregateGroup.Aggregates.some(a => a.Selected);
  }

  get selectionsCount(): number {
    return this.aggregateGroup.Aggregates.filter(a => a.Selected).length;
  }

  trackById(index: number, filterAggregateItem: FilterAggregateItem): number {
    return filterAggregateItem.Id;
  }

  // Events
  handleResetClicked(e: any) {
    e.stopPropagation();
    this.clearSelections.emit(this.aggregateGroup);
  }

  handleAggregateSelected(aggregateItem: FilterAggregateItem) {
    this.aggregateToggled.emit({
      AggregateGroup: this.aggregateGroup.MetaData.FilterProp,
      AggregateItem: aggregateItem.Item
    });
  }
}
