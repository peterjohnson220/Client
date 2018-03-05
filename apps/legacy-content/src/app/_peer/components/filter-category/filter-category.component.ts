import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FilterAggregateGroup, FilterAggregateItem } from 'libs/models/peer/aggregate-filters';

@Component({
  selector: 'pf-peer-data-cut-filter-category',
  templateUrl: './filter-category.component.html',
  styleUrls: ['./filter-category.component.scss']
})
export class FilterCategoryComponent {
  @Input() filter: FilterAggregateGroup;
  @Output() optionToggled = new EventEmitter();

  collapsed: boolean;
  showAllOptions: boolean;
  selections: string[] = [];

  constructor() { }

  get categoryLabel(): string {
    return this.filter.MetaData.Label;
  }

  get filterOptions(): FilterAggregateItem[] {
    return this.filter.Aggregates;
  }

  handleOptionSelected(option: FilterAggregateItem) {
    if (this.selections.some(s => s === option.Item)) {
      this.selections = this.selections.filter(s => s !== option.Item);
    } else {
      this.selections = [...this.selections, option.Item];
    }

    this.optionToggled.emit({
      type: this.filter.MetaData.FilterProp,
      selections: this.selections
    });
  }
}
