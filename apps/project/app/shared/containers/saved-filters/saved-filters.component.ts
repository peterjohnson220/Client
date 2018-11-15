import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import * as cloneDeep from 'lodash.clonedeep';
import { Observable, Subscription } from 'rxjs';

import { arraySortByString, SortDirection } from 'libs/core/functions';

import * as fromSavedFiltersActions from '../../actions/saved-filters.actions';
import { Filter, isMultiFilter, isRangeFilter, SavedFilter } from '../../models';
import * as fromAddDataReducer from '../../reducers';

@Component({
  selector: 'pf-saved-filters',
  templateUrl: './saved-filters.component.html',
  styleUrls: ['./saved-filters.component.scss']
})
export class SavedFiltersComponent implements OnInit, OnDestroy {
  @Input() canSaveFilters: boolean;

  loading$: Observable<boolean>;
  deleting$: Observable<boolean>;
  filterIdToDelete$: Observable<string>;
  savedFilters$: Observable<SavedFilter[]>;
  savingFilter$: Observable<boolean>;
  savingFilterError$: Observable<boolean>;
  savingFilterConflict$: Observable<boolean>;
  saveFilterModalOpen$: Observable<boolean>;

  filterIdToDeleteSub: Subscription;
  savedFiltersSub: Subscription;

  filterIdToDelete: string;
  savedFilters: SavedFilter[];
  filteredSavedFilters: SavedFilter[];
  searchSavedFiltersValue: string;

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.loading$ = this.store.select(fromAddDataReducer.getLoadingSavedFilters);
    this.deleting$ = this.store.select(fromAddDataReducer.getDeletingSavedFilter);
    this.filterIdToDelete$ = this.store.select(fromAddDataReducer.getFilterIdToDelete);
    this.savedFilters$ = this.store.select(fromAddDataReducer.getSavedFilters);
    this.savingFilter$ = this.store.select(fromAddDataReducer.getSavingFilter);
    this.savingFilterConflict$ = this.store.select(fromAddDataReducer.getSavingFilterConflict);
    this.savingFilterError$ = this.store.select(fromAddDataReducer.getSavingFilterError);
    this.saveFilterModalOpen$ = this.store.select(fromAddDataReducer.getSaveFilterModalOpen);
  }

  getFilterPreview(savedFilter: SavedFilter) {
    return savedFilter.Filters.map((f: Filter) => {
      if (isMultiFilter(f)) {
        return f.Options.map(o => o.Name).join(', ');
      } else if (isRangeFilter(f)) {
        return `${f.MinimumValue.toFixed(f.Precision)} - ${f.MaximumValue.toFixed(f.Precision)}`;
      }
    }).join(', ');
  }

  handleDeleteBtnClicked(filterId: string) {
    this.store.dispatch(new fromSavedFiltersActions.MarkFilterToDelete({ filterId }));
  }

  handleCancelDeleteClicked() {
    this.store.dispatch(new fromSavedFiltersActions.UnmarkFilterToDelete());
  }

  handleFilterClicked(savedFilter: SavedFilter) {
    if (!this.filterIdToDelete && !savedFilter.Selected) {
      this.store.dispatch(new fromSavedFiltersActions.SelectSavedFilter(savedFilter));
    }
  }

  handleDeleteFilterConfirmClicked() {
    this.store.dispatch(new fromSavedFiltersActions.DeleteSavedFilter());
  }

  handleSearchValueChanged(value: string) {
    this.searchSavedFiltersValue = value;
    this.filterSavedFilters();
  }

  handleSaveFilter(saveFilterObj: { Name: string, SetAsPayMarketDefault}): void {
    this.store.dispatch(new fromSavedFiltersActions.SaveFilter(saveFilterObj));
  }

  handleSaveFilterModalDismissed(): void {
    this.store.dispatch(new fromSavedFiltersActions.CloseSaveFilterModal());
  }

  handleSaveClicked() {
    if (this.canSaveFilters) {
      this.store.dispatch(new fromSavedFiltersActions.OpenSaveFilterModal());
    }
  }

  trackByFilterId(index: number, item: SavedFilter) {
    return item.Id;
  }

  // Lifecycle
  ngOnInit() {
    this.filterIdToDeleteSub = this.filterIdToDelete$.subscribe(fid => this.filterIdToDelete = fid);
    this.savedFiltersSub = this.savedFilters$.subscribe(sf => {
      this.savedFilters = sf;
      this.filterSavedFilters();
    });
  }

  ngOnDestroy() {
    this.filterIdToDeleteSub.unsubscribe();
    this.savedFiltersSub.unsubscribe();
  }

  private filterSavedFilters(): void {
    this.savedFilters = cloneDeep(this.savedFilters);

    this.filteredSavedFilters = this.searchSavedFiltersValue
      ? this.savedFilters.filter(sf => sf.Name.toLowerCase().includes(this.searchSavedFiltersValue.toLowerCase()))
      : this.savedFilters;

    this.filteredSavedFilters.sort((a, b) => arraySortByString(a.Name, b.Name, SortDirection.Ascending));
  }
}
