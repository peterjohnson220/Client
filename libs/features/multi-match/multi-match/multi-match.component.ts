import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import * as fromSearchReducer from 'libs/features/search/reducers';
import { SearchBase } from 'libs/features/search/containers/search-base';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';

import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';
import * as fromJobsToPriceActions from '../actions/jobs-to-price.actions';
import * as fromModifyPricingsActions from '../actions/modify-pricings.actions';

import * as fromMultiMatchReducer from '../reducers';
import { JobToPrice } from '../models';

import { enableDatacutsDragging } from '../../survey-search/helpers';
import * as fromSurveySearchResultsActions from '../../survey-search/actions/survey-search-results.actions';
import { staticFilters } from '../../survey-search/data';

import { LEGACY_PROJECTS, MODIFY_PRICINGS } from '../constants';

@Component({
  selector: 'pf-multi-match-component',
  templateUrl: './multi-match.component.html',
  styleUrls: ['./multi-match.component.scss']
})
export class MultiMatchComponent extends SearchBase implements OnInit, OnDestroy {
  @Input() display: 'component' | 'modal' = 'component';
  @Input() featureImplementation = LEGACY_PROJECTS;
  jobsToPrice$: Observable<JobToPrice[]>;
  savingChanges$: Observable<boolean>;
  pageShown$: Observable<boolean>;
  changesToSave: boolean;

  showMultiMatchModal = new BehaviorSubject<boolean>(false);
  showMultiMatchModal$ = this.showMultiMatchModal.asObservable();

  // Subscription
  private jobsToPriceSubscription: Subscription;
  private pricingsToModifySubscription: Subscription;

  constructor(
    store: Store<fromSearchReducer.State>,
    private dragulaService: DragulaService,
    private actionsSubject: ActionsSubject
  ) {
    super(store);
    enableDatacutsDragging(dragulaService);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
    this.jobsToPrice$ = this.store.select(fromMultiMatchReducer.getJobsToPrice);
    this.savingChanges$ = this.store.select(fromMultiMatchReducer.getSavingJobMatchUpdates);

    this.pricingsToModifySubscription = this.actionsSubject
      .pipe(ofType(fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY_SUCCESS))
      .subscribe(p => {
        this.showMultiMatchModal.next(true);
      });
  }

  ngOnInit(): void {
    this.jobsToPriceSubscription = this.jobsToPrice$.subscribe((jobsToPrice) => {
      this.changesToSave = jobsToPrice.some(job => this.jobHasChangesToSave(job));
    });
  }

  onResetApp() {
    this.store.dispatch(new fromSurveySearchResultsActions.ClearDataCutSelections());
    this.store.dispatch(new fromJobsToPriceActions.ClearAllJobs());
  }

  onSetContext(payload: any) {
    this.store.dispatch(new fromSearchFiltersActions.AddFilters(staticFilters));
    this.store.dispatch(new fromMultiMatchPageActions.SetProjectContext(payload));
    this.store.dispatch(new fromMultiMatchPageActions.GetProjectSearchContext(payload));
    this.store.dispatch(new fromJobsToPriceActions.GetJobsToPrice(payload));
  }

  handleSaveClicked() {
    this.store.dispatch(new fromMultiMatchPageActions.SaveJobMatchUpdates());
  }

  handleCancelClicked() {
    switch (this.featureImplementation) {
      case MODIFY_PRICINGS:
        super.resetActions();
        this.showMultiMatchModal.next(false);
        this.onResetApp();
        break;
      default:
        super.handleCancelClicked();
        break;
    }
  }

  ngOnDestroy(): void {
    this.jobsToPriceSubscription.unsubscribe();
    this.pricingsToModifySubscription.unsubscribe();
  }

  private jobHasChangesToSave(job: JobToPrice): boolean {
    return (!!job.DataCutsToAdd && job.DataCutsToAdd.length > 0) || (!!job.DeletedJobMatchCutIds && job.DeletedJobMatchCutIds.length > 0);
  }
}
