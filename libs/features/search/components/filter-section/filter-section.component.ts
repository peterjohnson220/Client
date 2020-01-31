import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ClientServerFilterHelper } from '../../helpers';
import {Filter, FilterType, isFilterableMultiFilter, isMultiFilter, isRangeFilter, isTextFilter} from '../../models';
import { OperatorEnum } from '../../../../constants';

@Component({
  selector: 'pf-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterSectionComponent {
  @Input() filter: Filter;
  @Input() singled: boolean;
  @Input() overriddenSelectionCount: number;
  @Input() searchValue: string;
  @Output() clear: EventEmitter<string> = new EventEmitter();
  @Output() search: EventEmitter<Filter> = new EventEmitter();
  @Output() showMore: EventEmitter<Filter> = new EventEmitter();
  @Output() searchValueChanged: EventEmitter<string> = new EventEmitter();

  protected cssReplacementRegex = /[\s]/g;
  collapsed: boolean;
  filterTypes = FilterType;
  maxOptions = ClientServerFilterHelper.maxNumberOfOptions;

  constructor() {}

  get filterOperatorLabel(): string {
    const operator = this.filter.Operator;
    if (operator !== null && !!OperatorEnum[operator]) {
      return ' (' + OperatorEnum[operator].toUpperCase() + ')';
    }

    return null;
  }

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
    return (isMultiFilter(this.filter) || isFilterableMultiFilter(this.filter)) ? this.filter.Options.filter(o => o.Count > 0).length : 0;
  }

  get optionCount(): number {
    return (isMultiFilter(this.filter) || isFilterableMultiFilter(this.filter)) ? this.filter.Options.length : 0;
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

  get isMultiFilter(): boolean {
    return isMultiFilter(this.filter);
  }

  get allowedToSearch(): boolean {
    return (this.filter.Type === this.filterTypes.Multi || this.filter.Type === this.filterTypes.FilterableMulti) &&
            !this.singled &&
            this.selectableOptionCount >= this.maxOptions &&
            !this.filter.Locked;
  }

  get showAllOptions(): boolean {
    return (isMultiFilter(this.filter) || isFilterableMultiFilter(this.filter)) && this.filter.ShowAllOptions;
  }

  get displayShowMore(): boolean {
    return this.optionCount >= this.maxOptions && !this.singled && !this.showAllOptions;
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

  handleSearchClicked(e, filter: Filter) {
    e.stopPropagation();
    this.search.emit(filter);
  }

  handleShowMoreClicked(filter: Filter) {
    if (this.allowedToSearch) {
      this.showMore.emit(filter);
    }
  }

  handleSearchValueChanged(value: string) {
    this.searchValueChanged.emit(value);
  }
}
