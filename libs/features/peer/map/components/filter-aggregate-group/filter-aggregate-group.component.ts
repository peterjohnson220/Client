import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { FilterAggregateGroup, FilterAggregateItem, ToggleAggregateGroupSelections } from 'libs/models/peer/aggregate-filters';

import { AggregateSelectionInfo } from '../../models';
import { OperatorEnum } from '../../../../../constants';

@Component({
  selector: 'pf-filter-aggregate-group',
  templateUrl: './filter-aggregate-group.component.html',
  styleUrls: ['./filter-aggregate-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterAggregateGroupComponent {
  @Input() aggregateGroup: FilterAggregateGroup;
  @Input() previewLimit: number;
  @Input() searching = false;
  @Output() aggregateToggled = new EventEmitter<AggregateSelectionInfo>();
  @Output() aggregateGroupSelectionsToggled = new EventEmitter<ToggleAggregateGroupSelections>();
  @Output() searchEvent: EventEmitter<string> = new EventEmitter();

  searchValue = '';
  collapsed: boolean;
  protected cssReplacementRegex = /[\s]/g;

  constructor() { }

  get filterOperatorLabel(): string {
    const operator = this.aggregateGroup.MetaData.Operator;
    if (operator !== null && !!OperatorEnum[operator]) {
      return ' (' + OperatorEnum[operator].toUpperCase() + ')';
    }

    return null;
  }
  get searchingAnotherAggregate(): boolean {
    return this.searching && !this.aggregateGroup.IsSearching;
  }
  get searchingThisAggregate(): boolean {
    return this.searching && this.aggregateGroup.IsSearching;
  }
  get allowedToSearch(): boolean {
    return this.aggregateGroup.Aggregates.length > this.previewLimit && !this.searchingThisAggregate;
  }

  get cssResetClearBtnAutomationName(): string {
    const filterCssClassName = this.aggregateGroup.MetaData.Id.toLowerCase().replace(this.cssReplacementRegex, '-');
    return 'au-btn-clear-' + filterCssClassName;
  }
  get categoryLabel(): string {
    return this.aggregateGroup.MetaData.Label;
  }

  get filterAggregates(): FilterAggregateItem[] {
    if (!this.searchingThisAggregate) {
      this.searchValue = '';
    }
    const filterAggregates = this.searchingThisAggregate ? this.aggregateGroup.Aggregates : this.aggregateGroup.AggregatesPreview;
    if (!this.searchValue.length) {
      return filterAggregates;
    }

    const pattern = this.searchValue.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    const regex = new RegExp(pattern, 'gi');
    return filterAggregates.filter(agg => agg.Item.match(regex));
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

  handleSearchClicked(e) {
    e.stopPropagation();
    this.searchEvent.emit(this.aggregateGroup.MetaData.Id);
  }

  handleSearchValueChanged(newValue: string) {
    this.searchValue = newValue;
  }
}
