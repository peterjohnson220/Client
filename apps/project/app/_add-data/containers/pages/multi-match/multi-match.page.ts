import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromMultiMatchPageActions from '../../../actions/multi-match-page.actions';
import * as fromJobsToPriceActions from '../../../actions/jobs-to-price.actions';
import * as fromAddDataReducer from '../../../reducers';
import { SurveySearchBase } from '../survey-search-base';

@Component({
  selector: 'pf-multi-match-page',
  templateUrl: './multi-match.page.html',
  styleUrls: ['./multi-match.page.scss']
})
export class MultiMatchPageComponent extends SurveySearchBase {
  // todo move this to a new component
  jobListIds: string[];
  pageShown$: Observable<boolean>;

  constructor(
    store: Store<fromAddDataReducer.State>
  ) {
    super(store);
    // todo move this to new component
    this.jobListIds = [];
    this.pageShown$ = this.store.select(fromAddDataReducer.getMultiMatchPageShown);
  }

  onResetApp() {
    this.store.dispatch(new fromJobsToPriceActions.ClearAllJobs());
  }

  onSetContext(payload: any) {
    this.store.dispatch(new fromMultiMatchPageActions.SetProjectContext(payload));
    this.store.dispatch(new fromMultiMatchPageActions.GetProjectSearchContext(payload));
    this.store.dispatch(new fromJobsToPriceActions.GetJobsToPrice(payload));
  }

  handleCancelClicked() {
    this.store.dispatch(new fromMultiMatchPageActions.CloseMultiMatch());
  }
}
