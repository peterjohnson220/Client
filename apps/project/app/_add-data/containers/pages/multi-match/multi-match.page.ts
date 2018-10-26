import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/index';

import { DragulaService } from 'ng2-dragula';

import * as fromMultiMatchPageActions from '../../../actions/multi-match-page.actions';
import * as fromJobsToPriceActions from '../../../actions/jobs-to-price.actions';
import * as fromAddDataReducer from '../../../reducers';
import { SurveySearchBase } from '../survey-search-base';
import { enableDatacutsDragging } from '../../../helpers';
import { JobToPrice } from '../../../models';


@Component({
  selector: 'pf-multi-match-page',
  templateUrl: './multi-match.page.html',
  styleUrls: ['./multi-match.page.scss']
})
export class MultiMatchPageComponent extends SurveySearchBase implements OnInit, OnDestroy {

  jobsToPrice$: Observable<JobToPrice[]>;
  savingChanges$: Observable<boolean>;
  pageShown$: Observable<boolean>;
  changesToSave: boolean;
  // Subscription
  private jobsToPriceSubscription: Subscription;

  constructor(
    store: Store<fromAddDataReducer.State>,
    private dragulaService: DragulaService
  ) {
    super(store);
    enableDatacutsDragging(dragulaService);
    this.pageShown$ = this.store.select(fromAddDataReducer.getMultiMatchPageShown);
    this.jobsToPrice$ = this.store.select(fromAddDataReducer.getJobsToPrice);
    this.savingChanges$ = this.store.select(fromAddDataReducer.getSavingJobMatchUpdates);
  }

  ngOnInit(): void {
    this.jobsToPriceSubscription = this.jobsToPrice$.subscribe((jobsToPrice) => {
      this.changesToSave = jobsToPrice.some(job => this.jobHasChangesToSave(job));
    });
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

  handleSaveClicked() {
    this.store.dispatch(new fromMultiMatchPageActions.SaveJobMatchUpdates());
  }

  ngOnDestroy(): void {
    this.jobsToPriceSubscription.unsubscribe();
  }

  private jobHasChangesToSave(job: JobToPrice): boolean {
    return (!!job.DataCutsToAdd && job.DataCutsToAdd.length > 0) || (!!job.DeletedJobMatchCutIds && job.DeletedJobMatchCutIds.length > 0);
  }
}
