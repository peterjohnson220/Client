import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { JobData, JobGridData, PricingPaymarket } from 'libs/models/comphub';
import { GetCrowdSourcedJobPricingRequest } from 'libs/models/comphub/get-crowd-sourced-job-pricing';

import { ComphubPages } from '../../../../_shared/data';
import { WorkflowContext } from '../../../../_shared/models';
import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromJobGridActions from '../../../../_shared/actions/job-grid.actions';
import * as fromComphubCsdReducer from '../../../reducers';
import * as fromCompensableFactorsActions from '../../../actions/compensable-factors.actions';
import { SummaryPageSalaryData } from '../../../models';

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
  selectedJobData: SummaryPageSalaryData;
  selectedPaymarket: PricingPaymarket;
  selectedPaymarket$: Observable<PricingPaymarket>;
  selectedPaymarketSub: Subscription;
  workflowContext$: Observable<WorkflowContext>;
  workflowContextSub: Subscription;
  workflowContext: WorkflowContext;
  jobResults: JobGridData;
  jobResults$: Observable<JobGridData>;
  jobResultsSub: Subscription;
  summaryPage: boolean;

  constructor(
    private store: Store<fromComphubSharedReducer.State>,
    private csdStore: Store<fromComphubCsdReducer.State>
  ) {
    this.selectedJob$ = this.store.select(fromComphubSharedReducer.getSelectedJobData);
    this.selectedPaymarket$ = this.store.select(fromComphubSharedReducer.getSelectedPaymarket);
    this.workflowContext$ = this.store.select(fromComphubSharedReducer.getWorkflowContext);
    this.jobResults$ = this.store.select(fromComphubSharedReducer.getJobGridResults);
  }

  ngOnInit() {
    this.summaryPage = false;
    this.selectedJobSub = this.selectedJob$.subscribe(sj => {
      this.selectedJob = sj;
    });

    this.selectedPaymarketSub = this.selectedPaymarket$.subscribe(pm => {
      this.selectedPaymarket = pm;
    });

    this.workflowContextSub = this.workflowContext$.subscribe(wc => {
      if (!!wc && wc.selectedPageId === ComphubPages.Summary) {
        this.summaryPage = true;
        this.workflowContext = wc;
        this.getInitialPricing();
      }
    });

    this.jobResultsSub = this.jobResults$.subscribe(jr => {
      this.jobResults = jr;
      // update selected job data
      this.selectedJob = jr.Data.find(r => r?.JobTitle === this.selectedJob?.JobTitle);
    });

    this.store.dispatch(new fromCompensableFactorsActions.GetEducationTypes());
  }

  getInitialPricing() {
    const request: GetCrowdSourcedJobPricingRequest = {
      JobTitle: this.selectedJob.JobTitle,
      Country: this.workflowContext.activeCountryDataSet.CountryName,
      PaymarketId: this.selectedPaymarket.CompanyPayMarketId,
      SelectedFactors: null
    };
    this.store.dispatch(new fromJobGridActions.GetCrowdSourcedJobPricing(request));

    this.csdStore.dispatch(new fromCompensableFactorsActions.GetAllCompensableFactors(
      {
        jobTitle: this.selectedJob?.JobTitle,
        country: this.workflowContext.activeCountryDataSet.CountryName,
        paymarketId: this.selectedPaymarket.CompanyPayMarketId
      }
    ));
  }

  ngOnDestroy(): void {
    this.jobResultsSub.unsubscribe();
    this.workflowContextSub.unsubscribe();
    this.selectedPaymarketSub.unsubscribe();
    this.selectedJobSub.unsubscribe();
  }
}
