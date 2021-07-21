import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { JobData, JobGridData, PricingPaymarket } from 'libs/models/comphub';

import { ComphubPages } from '../../../../_shared/data';
import { WorkflowContext } from '../../../../_shared/models';
import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromJobGridActions from '../../../../_shared/actions/job-grid.actions';

@Component({
  selector: 'pf-crowd-sourced-summary-card',
  templateUrl: './crowd-sourced-summary.card.component.html',
  styleUrls: ['./crowd-sourced-summary.card.component.scss']
})
export class CrowdSourcedSummaryCardComponent implements OnInit, OnDestroy {
  comphubPages = ComphubPages;
  selectedJob$: Observable<JobData>;
  selectedJobSub: Subscription;
  selectedJob: JobData;
  selectedPaymarket: PricingPaymarket;
  selectedPaymarket$: Observable<PricingPaymarket>;
  selectedPaymarketSub: Subscription;
  workflowContext$: Observable<WorkflowContext>;
  workflowContextSub: Subscription;
  workflowContext: WorkflowContext;
  jobResults: JobGridData;
  jobResults$: Observable<JobGridData>;
  jobResultsSub: Subscription;

  constructor(
    private store: Store<fromComphubSharedReducer.State>
  ) {
    this.selectedJob$ = this.store.select(fromComphubSharedReducer.getSelectedJobData);
    this.selectedPaymarket$ = this.store.select(fromComphubSharedReducer.getSelectedPaymarket);
    this.workflowContext$ = this.store.select(fromComphubSharedReducer.getWorkflowContext);
    this.jobResults$ = this.store.select(fromComphubSharedReducer.getJobGridResults);
  }

  ngOnInit() {
    this.selectedJobSub = this.selectedJob$.subscribe(sj => {
      this.selectedJob = sj;
    });

    this.selectedPaymarketSub = this.selectedPaymarket$.subscribe(pm => {
      this.selectedPaymarket = pm;
    });

    this.workflowContextSub = this.workflowContext$.subscribe(wc => {
      if (!!wc && wc.selectedPageId === ComphubPages.Summary) {
        this.workflowContext = wc;
        this.getInitialPricing();
      }
    });

    this.jobResultsSub = this.jobResults$.subscribe( jr => {
      this.jobResults = jr;
      // update selected job data
      const jobToUpdate = jr.Data.find(r => r?.JobTitle === this.selectedJob?.JobTitle);
      this.selectedJob = jobToUpdate;
    });
  }

  getInitialPricing() {
    this.store.dispatch(new fromJobGridActions.GetCrowdSourcedJobPricing(
      { jobTitle: this.selectedJob.JobTitle, country: this.workflowContext.activeCountryDataSet.CountryName,
        paymarketId: this.selectedPaymarket.CompanyPayMarketId }
    ));
  }

  ngOnDestroy(): void {
    this.jobResultsSub.unsubscribe();
    this.workflowContextSub.unsubscribe();
    this.selectedPaymarketSub.unsubscribe();
    this.selectedJobSub.unsubscribe();
  }


}
