import { Component, HostListener } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromMultiMatchPageActions from '../../../actions/multi-match-page.actions';
import * as fromSearchFiltersActions from '../../../actions/search-filters.actions';
import * as fromSurveyResultsActions from '../../../actions/search-results.actions';
import * as fromSearchActions from '../../../actions/search.actions';
import * as fromJobsToPriceActions from '../../../actions/jobs-to-price.actions';
import * as fromSingledFilterActions from '../../../actions/singled-filter.actions';
import * as fromAddDataReducer from '../../../reducers';
import { Filter, Pill, PillGroup } from '../../../models';


@Component({
  selector: 'pf-multi-match-page',
  templateUrl: './multi-match.page.html',
  styleUrls: ['./multi-match.page.scss']
})
export class MultiMatchPageComponent {
  numberOfResults$: Observable<number>;
  searchingFilter$: Observable<boolean>;
  filters$: Observable<Filter[]>;
  // todo move this to a new component
  jobListIds: string[];

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.numberOfResults$ = this.store.select(fromAddDataReducer.getResultsTotal);
    this.searchingFilter$ = this.store.select(fromAddDataReducer.getSearchingFilter);
    this.filters$ = this.store.select(fromAddDataReducer.getFilters);
    // todo move this to new component
    this.jobListIds = [];
  }

  // Listen for messages to the window
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (!event.data || !event.data.payfactorsMessage) {
      return;
    }

    switch (event.data.payfactorsMessage.type) {
      case 'Set Project Context':
        this.resetApp();
        this.store.dispatch(new fromMultiMatchPageActions.SetProjectContext(event.data.payfactorsMessage.payload));
        this.store.dispatch(new fromMultiMatchPageActions.GetProjectSearchContext(event.data.payfactorsMessage.payload));
        this.store.dispatch(new fromJobsToPriceActions.GetJobsToPrice(event.data.payfactorsMessage.payload));
        break;
      case 'App Closed':
        this.resetApp();
        break;
    }
  }

  resetApp() {
    this.store.dispatch(new fromSearchFiltersActions.ClearFilters());
    this.store.dispatch(new fromSurveyResultsActions.ClearResults());
    this.store.dispatch(new fromSurveyResultsActions.ClearDataCutSelections());
    this.store.dispatch(new fromSearchActions.HideFilterSearch());
    this.store.dispatch(new fromJobsToPriceActions.ClearAllJobs());
  }

  handleCancelClicked() {
    this.store.dispatch(new fromMultiMatchPageActions.CloseMultiMatch());
  }

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
