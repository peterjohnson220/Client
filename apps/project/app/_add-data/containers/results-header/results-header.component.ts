import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSurveyResultsActions from '../../actions/search-results.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import { Filter, Pill, PillGroup } from '../../models';
import * as fromAddDataReducer from '../../reducers';

@Component({
  selector: 'pf-results-header',
  templateUrl: './results-header.component.html',
  styleUrls: ['./results-header.component.scss']
})
export class ResultsHeaderComponent {
  pageShown$: Observable<boolean>;
  filters$: Observable<Filter[]>;

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.filters$ = this.store.select(fromAddDataReducer.getFilters);
    this.pageShown$ = this.store.select(fromAddDataReducer.getPageShown);
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

  handleSaveFilters(isForAllPayMarkets: boolean): void {
    this.store.dispatch(new fromSearchFiltersActions.SaveSearchFilters({ isForAllPayMarkets }));
  }
}
