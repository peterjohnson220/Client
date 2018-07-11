import { Component, HostListener } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SearchFilter } from 'libs/models/search';

import * as fromAddSurveyDataPageActions from '../../../actions/add-survey-data-page.actions';
import * as fromSurveyFiltersActions from '../../../actions/search-filters.actions';
import * as fromAddDataReducer from '../../../reducers';
import { JobContext } from '../../../models';

@Component({
  selector: 'pf-add-survey-data-page',
  templateUrl: './add-survey-data.page.html',
  styleUrls: ['./add-survey-data.page.scss']
})
export class AddSurveyDataPageComponent {
  filters$: Observable<SearchFilter[]>;
  jobContext$: Observable<JobContext>;

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.filters$ = this.store.select(fromAddDataReducer.getFilters);
    this.jobContext$ = this.store.select(fromAddDataReducer.getJobContext);
  }

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
        this.store.dispatch(new fromSurveyFiltersActions.ClearStaticFilters());
        break;
    }
  }

  handleCancelClicked() {
    this.store.dispatch(new fromAddSurveyDataPageActions.CloseSurveySearch());
  }
}
