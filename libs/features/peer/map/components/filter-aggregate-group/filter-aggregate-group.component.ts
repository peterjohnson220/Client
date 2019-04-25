import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { FilterAggregateGroup, FilterAggregateItem, ToggleAggregateGroupSelections } from 'libs/models/peer/aggregate-filters';

import { AggregateSelectionInfo } from '../../models';

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
  @Output() aggregateGroupSelectionsToggled = new EventEmitter<ToggleAggregateGroupSelections>();

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

  get allOptionsSelected(): boolean {
    return this.aggregateGroup.Aggregates && (this.aggregateGroup.Aggregates.length
      && this.aggregateGroup.Aggregates.every(option => option.Selected));
  }

  trackById(index: number, filterAggregateItem: FilterAggregateItem): number | string {
    return filterAggregateItem.Id ? filterAggregateItem.Id : filterAggregateItem.Item;
  }

  // Events
  handleResetClicked(e: any) {
    e.stopPropagation();
    this.aggregateGroupSelectionsToggled.emit({
      FilterProp: this.aggregateGroup.MetaData.FilterProp,
      ShouldSelect: false
    });
  }

  handleSelectAllChecked(e: any) {
    e.stopPropagation();
    this.aggregateGroupSelectionsToggled.emit({
      FilterProp: this.aggregateGroup.MetaData.FilterProp,
      ShouldSelect: !this.allOptionsSelected
    });
  }

  handleAggregateSelected(aggregateItem: FilterAggregateItem) {
    this.aggregateToggled.emit({
      AggregateGroup: this.aggregateGroup.MetaData.FilterProp,
      AggregateItem: aggregateItem.Item
    });
  }
}
