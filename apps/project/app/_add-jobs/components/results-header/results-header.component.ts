import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Filter, isMultiFilter, isRangeFilter, Pill, PillGroup } from 'libs/features/search/models';

import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSingledFilterActions from 'libs/features/search/actions/singled-filter.actions';
import { FiltersHelper } from 'libs/features/search/helpers';
import * as fromSearchReducer from 'libs/features/search/reducers';

@Component({
  selector: 'pf-add-job-results-header',
  templateUrl: './results-header.component.html',
  styleUrls: ['./results-header.component.scss']
})
export class ResultsHeaderComponent implements OnInit, OnDestroy {

  filters$: Observable<Filter[]>;
  filtersSub: Subscription;

  filters: Filter[];
  hasFiltersToSave: boolean;

  constructor(
    private store: Store<fromSearchReducer.State>
  ) {
    this.filters$ = this.store.select(fromSearchReducer.getFilters);
  }

  // Event Handling
  handleResetClicked() {
    this.store.dispatch(new fromSearchFiltersActions.ResetAllFilters());
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
      this.hasFiltersToSave = FiltersHelper.getFiltersWithValues(fs)
        .filter(f => isMultiFilter(f) || isRangeFilter(f)).some(f => !f.Locked && f.SaveDisabled !== true);
    });
  }

  ngOnDestroy() {
    this.filtersSub.unsubscribe();
  }

}
