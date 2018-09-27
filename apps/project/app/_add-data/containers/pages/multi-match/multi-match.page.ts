import { Component, HostListener } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromMultiMatchPageActions from '../../../actions/multi-match-page.actions';
import * as fromSearchFiltersActions from '../../../actions/search-filters.actions';
import * as fromSurveyResultsActions from '../../../actions/search-results.actions';
import * as fromAddDataReducer from '../../../reducers';

@Component({
  selector: 'pf-multi-match-page',
  templateUrl: './multi-match.page.html',
  styleUrls: ['./multi-match.page.scss']
})
export class MultiMatchPageComponent {
  numberOfResults$: Observable<number>;
  searchingFilter$: Observable<boolean>;
  excludeFromParticipation: boolean;
  // todo move this to a new component
  jobListIds: string[];

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.numberOfResults$ = this.store.select(fromAddDataReducer.getResultsTotal);
    this.searchingFilter$ = this.store.select(fromAddDataReducer.getSearchingMultiMatchFilter);
    this.excludeFromParticipation = false;
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
        // this will be an action sending these IDs to the new JobsToPrice component
        this.jobListIds = event.data.payfactorsMessage.payload.JobValues;
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
    this.excludeFromParticipation = false;
  }

  handleCancelClicked() {
    this.store.dispatch(new fromMultiMatchPageActions.CloseMultiMatch());
  }

  handleResetAllFilters() {
    this.store.dispatch(new fromSearchFiltersActions.ResetAllFilters());
  }

  handleSaveFilters(isForAllPayMarkets: boolean): void {
    this.store.dispatch(new fromSearchFiltersActions.SaveSearchFilters({ isForAllPayMarkets }));
  }
}
