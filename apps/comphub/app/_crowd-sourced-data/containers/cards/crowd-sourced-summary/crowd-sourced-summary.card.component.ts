import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { JobData, JobGridData, PricingPaymarket } from 'libs/models/comphub';
import { GetCrowdSourcedJobPricingRequest } from 'libs/models/comphub/get-crowd-sourced-job-pricing';
import { RateType } from 'libs/data/data-sets';

import { ComphubPages } from '../../../../_shared/data';
import { MarketDataScope, WorkflowContext } from '../../../../_shared/models';
import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromJobGridActions from '../../../../_shared/actions/job-grid.actions';
import { SummaryPageSalaryData } from '../../../models';
import * as fromMarketsCardActions from '../../../../_shared/actions/markets-card.actions';
import { DataCardHelper } from '../../../../_shared/helpers';
import * as fromCompensableFactorsActions from '../../../actions/compensable-factors.actions';

@Component({
  selector: 'pf-crowd-sourced-summary-card',
  templateUrl: './crowd-sourced-summary.card.component.html',
  styleUrls: ['./crowd-sourced-summary.card.component.scss']
})
export class CrowdSourcedSummaryCardComponent implements OnInit, OnDestroy {
  comphubPages = ComphubPages;
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
  firstDayOfMonth: Date;
  selectedRate: RateType;
  selectedRateSub: Subscription;
  marketDataScopeSub: Subscription;
  marketDataScope: MarketDataScope;

  constructor(
    private store: Store<fromComphubSharedReducer.State>
  ) {
    this.selectedPaymarket$ = this.store.select(fromComphubSharedReducer.getSelectedPaymarket);
    this.workflowContext$ = this.store.select(fromComphubSharedReducer.getWorkflowContext);
    this.jobResults$ = this.store.select(fromComphubSharedReducer.getJobGridResults);
    this.firstDayOfMonth = DataCardHelper.firstDayOfMonth();
  }

  ngOnInit() {
    this.summaryPage = false;
    this.selectedJobSub = this.store.select(fromComphubSharedReducer.getSelectedJobData).subscribe(sj => {
      this.selectedJob = sj;
    });

    this.selectedPaymarketSub = this.selectedPaymarket$.subscribe(pm => {
      this.selectedPaymarket = pm;
    });

    this.workflowContextSub = this.workflowContext$.subscribe(wc => {
      if (!!wc && wc.selectedPageId === ComphubPages.Summary) {
        this.summaryPage = true;
        this.workflowContext = wc;
        this.store.dispatch(new fromCompensableFactorsActions.GetAllCompensableFactors());
        this.getInitialPricing();
      }
    });

    this.jobResultsSub = this.jobResults$.subscribe(jr => {
      this.jobResults = jr;
      // update selected job data
      this.selectedJob = jr.Data.find(r => r?.JobTitle === this.selectedJob?.JobTitle);
    });

    this.selectedRateSub = this.store.select(fromComphubSharedReducer.getSelectedRate).subscribe(r => this.selectedRate = r);
    this.marketDataScopeSub = this.store.select(fromComphubSharedReducer.getMarketDataScope).subscribe(md => {
        if (md) {
          this.marketDataScope = md;
        }
      }
    );

    this.store.dispatch(new fromMarketsCardActions.GetMarketDataScope());
  }

  getInitialPricing() {
    const request: GetCrowdSourcedJobPricingRequest = {
      JobTitle: this.selectedJob.JobTitle,
      Country: this.workflowContext.activeCountryDataSet.CountryName,
      PaymarketId: this.selectedPaymarket.CompanyPayMarketId,
      SelectedFactors: null
    };
    this.store.dispatch(new fromJobGridActions.GetCrowdSourcedJobPricing(request));
  }

  getOrganizationType(id: number) {
    if (this.marketDataScope != null && this.marketDataScope.OrganizationTypes != null && id != null) {
      return this.marketDataScope.OrganizationTypes.find(x => +x.Value === id).Name;
    }
  }

  ngOnDestroy(): void {
    this.jobResultsSub.unsubscribe();
    this.workflowContextSub.unsubscribe();
    this.selectedPaymarketSub.unsubscribe();
    this.selectedJobSub.unsubscribe();
    this.selectedRateSub.unsubscribe();
    this.marketDataScopeSub.unsubscribe();
  }
}
