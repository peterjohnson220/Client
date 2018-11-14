import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSearchResultsActions from '../../actions/search-results.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import { Filter, isMultiFilter, isRangeFilter, Pill, PillGroup, SavedFilter } from '../../models';
import * as fromAddDataReducer from '../../reducers';
import { FiltersHelper } from '../../helpers';

@Component({
  selector: 'pf-results-header',
  templateUrl: './results-header.component.html',
  styleUrls: ['./results-header.component.scss']
})
export class ResultsHeaderComponent implements OnInit, OnDestroy {
  filters$: Observable<Filter[]>;
  savedFilters$: Observable<SavedFilter[]>;
  filtersSub: Subscription;
  savedFiltersSub: Subscription;

  filters: Filter[];
  savedFilters: SavedFilter[];
  hasNonLockedFilters: boolean;
  hasSelectedSavedFilter: boolean;

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.filters$ = this.store.select(fromAddDataReducer.getFilters);
    this.savedFilters$ = this.store.select(fromAddDataReducer.getSavedFilters);
  }

  // Event Handling
  handleResetClicked() {
    this.store.dispatch(new fromSearchFiltersActions.ResetAllFilters());
    this.store.dispatch(new fromSearchResultsActions.ClearDataCutSelections());
  }

  handleClearPill(pill: Pill) {
    this.store.dispatch(new fromSearchFiltersActions.RemoveFilterValue({filterId: pill.FilterId, value: pill.Value}));
    this.store.dispatch(new fromSingledFilterActions.RemoveFilterValue({value: pill.Value}));
  }

  handleClearPillGroup(pillGroup: PillGroup) {
    this.store.dispatch(new fromSearchFiltersActions.ClearFilter({filterId: pillGroup.FilterId}));
    this.store.dispatch(new fromSingledFilterActions.ClearSelections());
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
