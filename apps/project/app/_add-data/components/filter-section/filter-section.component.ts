import { Component, EventEmitter, Input, Output } from '@angular/core';

import { maxNumberOfOptions } from '../../helpers';
import { Filter, FilterType, isMultiFilter, isTextFilter, isRangeFilter } from '../../models';

@Component({
  selector: 'pf-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss']
})
export class FilterSectionComponent {
  @Input() filter: Filter;
  @Input() currencyCode: string;
  @Input() singled: boolean;
  @Input() overriddenSelectionCount: number;
  @Output() clear: EventEmitter<string> = new EventEmitter();
  @Output() searchClicked: EventEmitter<Filter> = new EventEmitter();
  @Output() searchValueChanged: EventEmitter<string> = new EventEmitter();
  protected cssReplacementRegex = /[\s]/g;
  collapsed: boolean;
  filterTypes = FilterType;
  maxOptions = maxNumberOfOptions;

  constructor() {}

  get cssResetClearBtnAutomationName(): string {
    const filterCssClassName = this.filter.CssClassName.toLowerCase().replace(this.cssReplacementRegex, '-');
    return 'au-btn-clear-' + filterCssClassName;
  }

  get shouldShowClearLink(): boolean {
    return (this.selectionCount > 0 || this.hasText || this.rangeHasSelection) && !this.filter.Locked;
  }

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

  get rangeHasSelection(): boolean {
    return isRangeFilter(this.filter) ? this.filter.SelectedMinValue > 0 || this.filter.SelectedMaxValue > 0 : false;
  }

  get isRangeFilter(): boolean {
    return isRangeFilter(this.filter);
  }

  toggle() {
    if (!this.singled) {
      this.collapsed = !this.collapsed;
    }
  }

  handleClearClicked(e, filterId: string) {
    e.stopPropagation();
    this.clear.emit(filterId);
  }

  handleSearchClicked(e: MouseEvent, filter: Filter) {
    e.stopPropagation();
    this.searchClicked.emit(filter);
  }

  handleSearchValueChanged(value: string) {
    this.searchValueChanged.emit(value);
  }
}
