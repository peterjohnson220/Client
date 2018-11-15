import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { PfValidators } from 'libs/forms/validators';

import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSurveyResultsActions from '../../actions/search-results.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import * as fromResultsHeaderActions from '../../actions/results-header.actions';
import { Filter, isMultiFilter, isRangeFilter, Pill, PillGroup, SavedFilter } from '../../models';
import * as fromAddDataReducer from '../../reducers';
import { FiltersHelper } from '../../helpers';

@Component({
  selector: 'pf-results-header',
  templateUrl: './results-header.component.html',
  styleUrls: ['./results-header.component.scss']
})
export class ResultsHeaderComponent implements OnInit, OnDestroy {
  pageShown$: Observable<boolean>;
  filters$: Observable<Filter[]>;
  loadingSavedFilters$: Observable<boolean>;
  savedFilters$: Observable<SavedFilter[]>;
  savingFilter$: Observable<boolean>;
  filterIdToDelete$: Observable<string>;
  deletingSavedFilter$: Observable<boolean>;
  savingFilterError$: Observable<boolean>;
  savingFilterConflict$: Observable<boolean>;
  saveFilterModalOpen$: Observable<boolean>;
  nameFilterForm: FormGroup;

  savedFiltersSub: Subscription;
  filtersSub: Subscription;

  filters: Filter[];
  savedFilters: SavedFilter[];
  hasNonLockedFilters: boolean;
  hasSelectedSavedFilter: boolean;
  showErrorMessages: boolean;

  constructor(
    private store: Store<fromAddDataReducer.State>,
    private fb: FormBuilder
  ) {
    this.filters$ = this.store.select(fromAddDataReducer.getFilters);
    this.pageShown$ = this.store.select(fromAddDataReducer.getPageShown);
    this.loadingSavedFilters$ = this.store.select(fromAddDataReducer.getLoadingSavedFilters);
    this.savedFilters$ = this.store.select(fromAddDataReducer.getSavedFilters);
    this.savingFilter$ = this.store.select(fromAddDataReducer.getSavingFilter);
    this.filterIdToDelete$ = this.store.select(fromAddDataReducer.getFilterIdToDelete);
    this.deletingSavedFilter$ = this.store.select(fromAddDataReducer.getDeletingSavedFilter);
    this.savingFilterConflict$ = this.store.select(fromAddDataReducer.getSavingFilterConflict);
    this.savingFilterError$ = this.store.select(fromAddDataReducer.getSavingFilterError);
    this.saveFilterModalOpen$ = this.store.select(fromAddDataReducer.getSaveFilterModalOpen);
    this.createForm();
  }

  createForm(): void {
    this.nameFilterForm = this.fb.group({
      'name': ['', [PfValidators.required, Validators.maxLength(255)]],
      'setAsPayMarketDefault': ['']
    });
  }

  // Event Handling
  handleResetFilters() {
    this.store.dispatch(new fromSearchFiltersActions.ResetAllFilters());
    this.store.dispatch(new fromSurveyResultsActions.ClearDataCutSelections());
  }

  handleClearPill(pill: Pill) {
    this.store.dispatch(new fromSearchFiltersActions.RemoveFilterValue({filterId: pill.FilterId, value: pill.Value}));
    this.store.dispatch(new fromSingledFilterActions.RemoveFilterValue({value: pill.Value}));
  }

  handleClearPillGroup(pillGroup: PillGroup) {
    this.store.dispatch(new fromSearchFiltersActions.ClearFilter({filterId: pillGroup.FilterId}));
    this.store.dispatch(new fromSingledFilterActions.ClearSelections());
  }

  handleSaveFilters(): void {
    this.store.dispatch(new fromResultsHeaderActions.OpenSaveFilterModal());
  }

  handleNameFilterModalDismiss(): void {
    this.store.dispatch(new fromResultsHeaderActions.CloseSaveFilterModal());
  }

  handleNameFilterModalSubmit(): void {
    this.showErrorMessages = true;
    this.store.dispatch(new fromResultsHeaderActions.SaveFilter(
      {
        Name: this.nameFilterForm.value.name,
        SetAsPayMarketDefault: this.nameFilterForm.value.setAsPayMarketDefault
      }
    ));
  }

  handleDeleteSavedFilter(deleteSavedFilterObj: { filterId: string }) {
    this.store.dispatch(new fromResultsHeaderActions.MarkFilterToDelete(deleteSavedFilterObj));
  }

  handleCancelDeleteSavedFilter() {
    this.store.dispatch(new fromResultsHeaderActions.UnmarkFilterToDelete());
  }

  handleDeleteSavedFilterConfirmed() {
    this.store.dispatch(new fromResultsHeaderActions.DeleteSavedFilter());
  }

  handleApplySaveFilter(savedFilter: SavedFilter) {
    this.store.dispatch(new fromResultsHeaderActions.SelectSavedFilter(savedFilter));
  }

  // Lifecycle
  ngOnInit() {
    this.filtersSub = this.filters$.subscribe(fs => {
      this.filters = fs;
      this.hasNonLockedFilters = FiltersHelper.getFiltersWithValues(fs)
        .filter(f => isMultiFilter(f) || isRangeFilter(f)).some(f => !f.Locked);
    });

    this.savedFiltersSub = this.savedFilters$.subscribe(sf => {
      this.savedFilters = sf;
      this.hasSelectedSavedFilter = sf.some(s => s.Selected);
    });
  }

  ngOnDestroy() {
    this.filtersSub.unsubscribe();
    this.savedFiltersSub.unsubscribe();
  }
}
