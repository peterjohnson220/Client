import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import * as cloneDeep from 'lodash.clonedeep';
import { Observable, Subscription } from 'rxjs';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { arraySortByString, SortDirection } from 'libs/core/functions';

import * as fromSavedFiltersActions from '../../actions/saved-filters.actions';
import {
  Filter,
  isMultiFilter,
  isRangeFilter,
  MultiSelectFilter,
  SavedFilter,
  SaveFilterModalData
} from '../../models';
import * as fromSearchReducer from '../../reducers';

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
    private store: Store<fromSearchReducer.State>
  ) {
    this.loading$ = this.store.select(fromSearchReducer.getLoadingSavedFilters);
    this.deleting$ = this.store.select(fromSearchReducer.getDeletingSavedFilter);
    this.filterIdToDelete$ = this.store.select(fromSearchReducer.getFilterIdToDelete);
    this.savedFilters$ = this.store.select(fromSearchReducer.getSavedFilters);
    this.savingFilter$ = this.store.select(fromSearchReducer.getSavingFilter);
    this.savingFilterConflict$ = this.store.select(fromSearchReducer.getSavingFilterConflict);
    this.savingFilterError$ = this.store.select(fromSearchReducer.getSavingFilterError);
    this.saveFilterModalOpen$ = this.store.select(fromSearchReducer.getSaveFilterModalOpen);
    this.filterDataToEdit$ = this.store.select(fromSearchReducer.getFilterDataToEdit);
    this.savedFiltersPopoverOpen$ = this.store.select(fromSearchReducer.getSavedFiltersPopoverOpen);
    this.defaultFilterId$ = this.store.select(fromSearchReducer.getDefaultFilterId);
  }

  getFilterPreview(savedFilter: SavedFilter) {
    return savedFilter.Filters.map((f: MultiSelectFilter) => {
      return f.Options.map(o => o.Name).join(', ');
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
    if (this.filterIdToDelete || this.filterDataToEdit) {
      return;
    }
    this.store.dispatch(new fromSavedFiltersActions.ToggleSavedFilterSelection(savedFilter));
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
      this.store.dispatch(new fromSavedFiltersActions.CreateSavedFilter());
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
