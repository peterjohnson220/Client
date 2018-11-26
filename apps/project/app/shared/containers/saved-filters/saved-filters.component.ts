import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import * as cloneDeep from 'lodash.clonedeep';
import { Observable, Subscription } from 'rxjs';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { arraySortByString, SortDirection } from 'libs/core/functions';

import * as fromSavedFiltersActions from '../../actions/saved-filters.actions';
import { Filter, isMultiFilter, isRangeFilter, SavedFilter, SaveFilterModalData } from '../../models';
import * as fromAddDataReducer from '../../reducers';

@Component({
  selector: 'pf-saved-filters',
  templateUrl: './saved-filters.component.html',
  styleUrls: ['./saved-filters.component.scss']
})
export class SavedFiltersComponent implements OnInit, OnDestroy {
  @Input() canSaveFilters: boolean;
  @ViewChild(NgbPopover) popover: NgbPopover;

  loading$: Observable<boolean>;
  deleting$: Observable<boolean>;
  filterIdToDelete$: Observable<string>;
  savedFilters$: Observable<SavedFilter[]>;
  savingFilter$: Observable<boolean>;
  savingFilterError$: Observable<boolean>;
  savingFilterConflict$: Observable<boolean>;
  saveFilterModalOpen$: Observable<boolean>;
  filterDataToEdit$: Observable<SaveFilterModalData>;
  savedFiltersPopoverOpen$: Observable<boolean>;
  defaultFilterId$: Observable<string>;

  filterIdToDeleteSub: Subscription;
  savedFiltersSub: Subscription;
  filterDataToEditSub: Subscription;
  savedFiltersPopoverOpenSub: Subscription;

  filterIdToDelete: string;
  savedFilters: SavedFilter[];
  filteredSavedFilters: SavedFilter[];
  searchSavedFiltersValue: string;
  filterDataToEdit: SaveFilterModalData;

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
    this.filterDataToEdit$ = this.store.select(fromAddDataReducer.getFilterDataToEdit);
    this.savedFiltersPopoverOpen$ = this.store.select(fromAddDataReducer.getSavedFiltersPopoverOpen);
    this.defaultFilterId$ = this.store.select(fromAddDataReducer.getDefaultFilterId);
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

  handleEditBtnClicked(savedFilter: SavedFilter) {
    this.closePopover();
    this.store.dispatch(new fromSavedFiltersActions.EditSavedFilter(savedFilter));
  }

  handleDeleteBtnClicked(filterId: string) {
    this.store.dispatch(new fromSavedFiltersActions.MarkFilterToDelete({ filterId }));
  }

  handleCancelDeleteClicked() {
    this.store.dispatch(new fromSavedFiltersActions.UnmarkFilterToDelete());
  }

  handleFilterClicked(savedFilter: SavedFilter) {
    if (!this.filterIdToDelete && !savedFilter.Selected && !this.filterDataToEdit) {
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

  handleSaveFilter(saveFilterObj: SaveFilterModalData): void {
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

  handlePopoverShown() {
    this.store.dispatch(new fromSavedFiltersActions.OpenSavedFiltersPopover());
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
    this.filterDataToEditSub = this.filterDataToEdit$.subscribe(data => this.filterDataToEdit = data);
    this.savedFiltersPopoverOpenSub = this.savedFiltersPopoverOpen$.subscribe(isOpen => {
      if (!isOpen) {
        this.closePopover();
      }
    });
  }

  ngOnDestroy() {
    this.filterIdToDeleteSub.unsubscribe();
    this.savedFiltersSub.unsubscribe();
    this.filterDataToEditSub.unsubscribe();
  }

  private filterSavedFilters(): void {
    this.savedFilters = cloneDeep(this.savedFilters);

    this.filteredSavedFilters = this.searchSavedFiltersValue
      ? this.savedFilters.filter(sf => sf.Name.toLowerCase().includes(this.searchSavedFiltersValue.toLowerCase()))
      : this.savedFilters;

    this.filteredSavedFilters.sort((a, b) => arraySortByString(a.Name, b.Name, SortDirection.Ascending));
  }

  private closePopover(): void {
    if (this.popover && this.popover.isOpen()) {
      this.popover.close();
    }
  }
}
