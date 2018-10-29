import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import * as cloneDeep from 'lodash.clonedeep';

import { arraySortByString, SortDirection } from 'libs/core/functions';

import { Filter, isMultiFilter, isRangeFilter, SavedFilter } from '../../models';

@Component({
  selector: 'pf-saved-filters',
  templateUrl: './saved-filters.component.html',
  styleUrls: ['./saved-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavedFiltersComponent implements OnChanges {
  @Input() loading: boolean;
  @Input() deleting: boolean;
  @Input() filterIdToDelete: string;
  @Input() savedFilters: SavedFilter[];

  @Output() filterClicked = new EventEmitter<SavedFilter>();
  @Output() deleteFilter = new EventEmitter<{ filterId: string}>();
  @Output() deleteFilterConfirmed = new EventEmitter();
  @Output() cancelDelete = new EventEmitter();

  filteredSavedFilters: SavedFilter[];
  searchSavedFiltersValue: string;

  constructor() {}

  getFilterPreview(savedFilter: SavedFilter) {
    return savedFilter.Filters.map((f: Filter) => {
      if (isMultiFilter(f)) {
        return f.Options.map(o => o.Name).join(', ');
      } else if (isRangeFilter(f)) {
        return `${f.MinimumValue} - ${f.MaximumValue}`;
      }
    }).join(', ');
  }

  handleDeleteBtnClicked(filterId: string) {
    this.deleteFilter.emit({ filterId });
  }

  handleCancelDeleteClicked() {
    // Pushing this to after the call stack has cleared. NgbPopover's outside click logic is running after view updates
    // have been made. These view update result in the elements that were clicked on to disappear. Since the elements are
    // no longer there NgbPopover will think the click came from outside the popover and close. Making sure that logic
    // runs first. Same technique used in handleDeleteFilterConfirmClicked
    window.setTimeout(() => this.cancelDelete.emit());
  }

  handleFilterClicked(savedFilter: SavedFilter) {
    if (!this.filterIdToDelete && !savedFilter.Selected) {
      this.filterClicked.emit(savedFilter);
    }
  }

  handleDeleteFilterConfirmClicked() {
    window.setTimeout(() => this.deleteFilterConfirmed.emit());
  }

  handleSearchValueChanged(value: string) {
    this.searchSavedFiltersValue = value;
    this.filteredSavedFilters = value
      ? this.savedFilters.filter(sf => sf.Name.toLowerCase().includes(value.toLowerCase()))
      : this.savedFilters;
  }

  trackByFilterId(index: number, item: SavedFilter) {
    return item.Id;
  }

  // Lifecycle
  ngOnChanges(changes: SimpleChanges) {
    if (changes.savedFilters) {
      this.savedFilters = cloneDeep(this.savedFilters);

      this.filteredSavedFilters = this.searchSavedFiltersValue
        ? this.savedFilters.filter(sf => sf.Name.toLowerCase().includes(this.searchSavedFiltersValue.toLowerCase()))
        : this.savedFilters;

      this.filteredSavedFilters.sort((a, b) => arraySortByString(a.Name, b.Name, SortDirection.Ascending));
    }
  }
}
