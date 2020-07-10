import { Component, Input, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import * as cloneDeep from 'lodash.clonedeep';
import { Observable, Subscription } from 'rxjs';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { arraySortByString, SortDirection } from 'libs/core/functions';
import { MultiSelectFilter } from 'libs/features/search/models';

import * as fromUserFilterActions from '../../actions/user-filter.actions';
import * as fromSaveFilterModalActions from '../../actions/save-filter-modal.actions';
import * as fromUserFilterPopoverActions from '../../actions/user-filter-popover.actions';
import * as fromUserFilterReducer from '../../reducers';

import {
  UserFilterPopoverConfig,
  SavedFilter,
  SaveFilterModalData
} from '../../models';

@Component({
  selector: 'pf-user-filter-popover',
  templateUrl: './user-filter-popover.component.html',
  styleUrls: ['./user-filter-popover.component.scss']
})
export class UserFilterPopoverComponent implements OnInit, OnDestroy {
  @Input() hasFiltersToSave: boolean;
  @Input() setAsDefaultLabel = 'Default';
  @Input() legacyImplementation: boolean;
  @ViewChild(NgbPopover, { static: true }) popover: NgbPopover;

  loading$: Observable<boolean>;
  error$: Observable<boolean>;
  deleting$: Observable<boolean>;
  savedFilters$: Observable<SavedFilter[]>;
  savingFilter$: Observable<boolean>;
  savingFilterError$: Observable<boolean>;
  savingFilterConflict$: Observable<boolean>;
  saveFilterModalOpen$: Observable<boolean>;
  filterDataToEdit$: Observable<SaveFilterModalData>;
  savedFiltersPopoverOpen$: Observable<boolean>;
  defaultFilterId$: Observable<string>;

  savedFiltersSub: Subscription;
  filterDataToEditSub: Subscription;
  savedFiltersPopoverOpenSub: Subscription;

  filterIdToDelete = '';
  savedFilters: SavedFilter[];
  filteredSavedFilters: SavedFilter[];
  searchSavedFiltersValue: string;
  filterDataToEdit: SaveFilterModalData;
  hasSelectedSavedFilter: boolean;

  constructor(
    private store: Store<fromUserFilterReducer.State>,
    @Optional() public userFilterPopoverConfig: UserFilterPopoverConfig
  ) {
    this.loading$ = this.store.select(fromUserFilterReducer.getLoading);
    this.error$ = this.store.select(fromUserFilterReducer.getLoadingError);
    this.deleting$ = this.store.select(fromUserFilterReducer.getDeleting);
    this.savedFilters$ = this.store.select(fromUserFilterReducer.getSavedFilters);
    this.savingFilter$ = this.store.select(fromUserFilterReducer.getUpserting);
    this.savingFilterConflict$ = this.store.select(fromUserFilterReducer.getUpsertingConflict);
    this.savingFilterError$ = this.store.select(fromUserFilterReducer.getUpsertingError);
    this.saveFilterModalOpen$ = this.store.select(fromUserFilterReducer.getModalOpen);
    this.filterDataToEdit$ = this.store.select(fromUserFilterReducer.getModalData);
    this.savedFiltersPopoverOpen$ = this.store.select(fromUserFilterReducer.getPopoverOpen);
    this.defaultFilterId$ = this.store.select(fromUserFilterReducer.getDefaultFilterId);
  }

  get canSaveFilters(): boolean {
    return this.hasFiltersToSave && !this.hasSelectedSavedFilter;
  }

  getFilterPreview(savedFilter: SavedFilter) {
    return savedFilter.Filters.map((f: MultiSelectFilter) => {
      return f.Options.map(o => o.Name).join(', ');
    }).join(', ');
  }

  handleEditBtnClicked(savedFilter: SavedFilter) {
    this.closePopover();
    this.store.dispatch(new fromUserFilterPopoverActions.Edit(savedFilter));
  }

  handleDeleteBtnClicked(filterId: string) {
    this.filterIdToDelete = filterId;
  }

  handleCancelDeleteClicked() {
    this.filterIdToDelete = '';
  }

  handleFilterClicked(savedFilter: SavedFilter) {
    if (this.filterIdToDelete || this.filterDataToEdit) {
      return;
    }
    this.store.dispatch(new fromUserFilterPopoverActions.ToggleSavedFilterSelection(savedFilter));
  }

  handleDeleteFilterConfirmClicked() {
    this.store.dispatch(new fromUserFilterActions.Delete( { savedFilterId: this.filterIdToDelete }));
    this.filterIdToDelete = '';
  }

  handleSearchValueChanged(value: string) {
    this.searchSavedFiltersValue = value;
    this.filterSavedFilters();
  }

  handleSaveFilter(saveFilterObj: SaveFilterModalData): void {
    this.store.dispatch(new fromSaveFilterModalActions.Save(saveFilterObj));
  }

  handleSaveFilterModalDismissed(): void {
    this.store.dispatch(new fromSaveFilterModalActions.CloseSaveModal());
  }

  handleSaveClicked() {
    if (this.canSaveFilters) {
      this.store.dispatch(new fromSaveFilterModalActions.CreateSavedFilter());
    }
  }

  handlePopoverShown() {
    this.store.dispatch(new fromUserFilterPopoverActions.OpenPopover());
  }

  trackByFilterId(index: number, item: SavedFilter) {
    return item.Id;
  }

  // Lifecycle
  ngOnInit() {
    this.savedFiltersSub = this.savedFilters$.subscribe(sf => {
      this.savedFilters = sf;
      this.hasSelectedSavedFilter = sf.some(s => s.Selected);
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
