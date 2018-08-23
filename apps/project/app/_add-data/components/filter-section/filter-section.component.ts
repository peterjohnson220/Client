import { Component, EventEmitter, Input, Output } from '@angular/core';

import { maxNumberOfOptions } from '../../helpers';
import { Filter, FilterType, isMultiFilter, isTextFilter } from '../../models';

@Component({
  selector: 'pf-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss']
})
export class FilterSectionComponent {
  @Input() filter: Filter;
  @Input() singled: boolean;
  @Input() overriddenSelectionCount: number;
  @Output() reset: EventEmitter<string> = new EventEmitter();
  @Output() searchClicked: EventEmitter<Filter> = new EventEmitter();
  @Output() searchValueChanged: EventEmitter<string> = new EventEmitter();

  collapsed: boolean;
  filterTypes = FilterType;
  maxOptions = maxNumberOfOptions;

  constructor() {}

  get selectionCount(): number {
    return this.overriddenSelectionCount ||
      (isMultiFilter(this.filter) ? this.filter.Options.filter(o => o.Selected).length : 0);
  }

  get selectableOptionCount(): number {
    return isMultiFilter(this.filter) ? this.filter.Options.filter(o => o.Count > 0).length : 0;
  }

  get hasText(): boolean {
    return isTextFilter(this.filter) ? this.filter.Value.length > 0 : false;
  }

  toggle() {
    if (!this.singled) {
      this.collapsed = !this.collapsed;
    }
  }

  handleResetClicked(e, filterId: string) {
    e.stopPropagation();
    this.reset.emit(filterId);
  }

  handleSearchClicked(e: MouseEvent, filter: Filter) {
    e.stopPropagation();
    this.searchClicked.emit(filter);
  }

  handleSearchValueChanged(value: string) {
    this.searchValueChanged.emit(value);
  }
}
