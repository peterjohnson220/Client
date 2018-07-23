import { Component, HostListener } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromAddSurveyDataPageActions from '../../../actions/add-survey-data-page.actions';
import * as fromSurveyFiltersActions from '../../../actions/search-filters.actions';
import * as fromSurveyResultsActions from '../../../actions/search-results.actions';
import * as fromAddDataReducer from '../../../reducers';

@Component({
  selector: 'pf-add-survey-data-page',
  templateUrl: './add-survey-data.page.html',
  styleUrls: ['./add-survey-data.page.scss']
})
export class AddSurveyDataPageComponent {
  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {}

  // Listen for messages to the window
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (!event.data || !event.data.payfactorsMessage) {
      return;
    }

    switch (event.data.payfactorsMessage.type) {
      case 'Set Job Context':
        this.store.dispatch(new fromAddSurveyDataPageActions.SetJobContext(event.data.payfactorsMessage.payload));
        break;
      case 'App Closed':
        this.store.dispatch(new fromSurveyFiltersActions.ClearFilters());
        this.store.dispatch(new fromSurveyResultsActions.ClearResults());
        break;
    }
  }

  handleCancelClicked() {
    this.store.dispatch(new fromAddSurveyDataPageActions.CloseSurveySearch());
  }
}
