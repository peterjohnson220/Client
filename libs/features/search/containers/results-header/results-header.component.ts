import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import {Filter, isFilterableMultiFilter, isMultiFilter, isRangeFilter, Pill, PillGroup} from '../../models';
import { FiltersHelper } from '../../helpers';
import * as fromSearchReducer from '../../reducers';

@Component({
  selector: 'pf-results-header',
  templateUrl: './results-header.component.html',
  styleUrls: ['./results-header.component.scss']
})
export class ResultsHeaderComponent implements OnInit, OnDestroy {
  @Input() savedFiltersEnabled = true;
  @Input() userFilterDefaultLabel = 'Default';

  filters$: Observable<Filter[]>;
  filtersSub: Subscription;

  filters: Filter[];
  hasFiltersToSave: boolean;

  constructor(
    private store: Store<fromSearchReducer.State>
  ) {
    this.filters$ = this.store.select(fromSearchReducer.getAllFilters);
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
        .filter(f => isMultiFilter(f) || isRangeFilter(f) || isFilterableMultiFilter(f)).some(f => !f.Locked && f.SaveDisabled !== true);
    });
  }

  ngOnDestroy() {
    this.filtersSub.unsubscribe();
  }
}
