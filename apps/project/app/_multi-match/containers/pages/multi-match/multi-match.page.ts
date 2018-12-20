import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import * as fromSearchPageActionsShared from 'libs/features/search/actions/search-page.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromMultiMatchPageActions from '../../../actions/multi-match-page.actions';
import * as fromJobsToPriceActions from '../../../actions/jobs-to-price.actions';
import * as fromMultiMatchReducer from '../../../reducers';
import * as fromSurveySearchReducer from '../../../../survey-search/reducers';
import { SurveySearchBase } from '../../../../survey-search/containers/pages/survey-search-base';
import { enableDatacutsDragging } from '../../../../survey-search/helpers';
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
    store: Store<fromSurveySearchReducer.State>,
    private dragulaService: DragulaService
  ) {
    super(store);
    enableDatacutsDragging(dragulaService);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
    this.jobsToPrice$ = this.store.select(fromMultiMatchReducer.getJobsToPrice);
    this.savingChanges$ = this.store.select(fromMultiMatchReducer.getSavingJobMatchUpdates);
  }

  ngOnInit(): void {
    this.jobsToPriceSubscription = this.jobsToPrice$.subscribe((jobsToPrice) => {
      this.changesToSave = jobsToPrice.some(job => this.jobHasChangesToSave(job));
    });
  }

  onResetApp() {
    this.store.dispatch(new fromSearchPageActionsShared.HidePage());
    this.store.dispatch(new fromJobsToPriceActions.ClearAllJobs());
  }

  onSetContext(payload: any) {
    this.store.dispatch(new fromMultiMatchPageActions.SetProjectContext(payload));
    this.store.dispatch(new fromMultiMatchPageActions.GetProjectSearchContext(payload));
    this.store.dispatch(new fromJobsToPriceActions.GetJobsToPrice(payload));
  }

  handleCancelClicked() {
    this.store.dispatch(new fromSearchPageActionsShared.CloseSearchPage());
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
