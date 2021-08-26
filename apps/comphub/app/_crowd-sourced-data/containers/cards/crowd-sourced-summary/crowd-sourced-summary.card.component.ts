import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { JobData, JobGridData, PricingPaymarket } from 'libs/models/comphub';
import { GetCrowdSourcedJobPricingRequest } from 'libs/models/comphub/get-crowd-sourced-job-pricing';
import { Rates, RateType } from 'libs/data/data-sets';
import { KendoDropDownItem } from 'libs/models';

import { ComphubPages } from '../../../../_shared/data';
import { MarketDataScope, WorkflowContext } from '../../../../_shared/models';
import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromJobGridActions from '../../../../_shared/actions/job-grid.actions';
import { SummaryPageSalaryData } from '../../../models';
import * as fromMarketsCardActions from '../../../../_shared/actions/markets-card.actions';
import { DataCardHelper } from '../../../../_shared/helpers';
import { CompensableFactorDataMapper } from '../../../helpers';
import * as fromCompensableFactorsActions from '../../../actions/compensable-factors.actions';
import * as fromComphubCsdReducer from '../../../reducers';
import * as fromDataCardActions from '../../../../_shared/actions/data-card.actions';

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
  selectedFactors: {};
  selectedFactorsSub: Subscription;
  initJobInitialPricingSub: Subscription;
  rates: KendoDropDownItem[] = Rates;

  constructor(
    private store: Store<fromComphubSharedReducer.State>,
    private actionsSubject: ActionsSubject
  ) {
    this.selectedPaymarket$ = this.store.select(fromComphubSharedReducer.getSelectedPaymarket);
    this.workflowContext$ = this.store.select(fromComphubSharedReducer.getWorkflowContext);
    this.jobResults$ = this.store.select(fromComphubSharedReducer.getJobGridResults);
    this.selectedFactorsSub = this.store.select(fromComphubCsdReducer.getSelectedFactors).subscribe(f => {
      if (f) {
        this.selectedFactors = f;
      }
    });
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

    // We need to get initial pricing only when all compensable factors loaded including default (Education, Years of experience, Supervisor)
    this.initJobInitialPricingSub = this.actionsSubject
      .pipe(ofType(fromCompensableFactorsActions.INIT_JOB_INITIAL_PRICING))
      .subscribe(() => {
        this.getInitialPricing();
      });
  }

  getInitialPricing() {
    const request: GetCrowdSourcedJobPricingRequest = {
      JobTitle: this.selectedJob.JobTitle,
      Country: this.workflowContext.activeCountryDataSet.CountryName,
      PaymarketId: this.selectedPaymarket.CompanyPayMarketId,
      SelectedFactors: CompensableFactorDataMapper.mapSelectedFactorsToCompensableFactorsRequest(this.selectedFactors)
    };
    this.store.dispatch(new fromJobGridActions.GetCrowdSourcedJobPricing(request));
  }

  getOrganizationType(id: number) {
    if (this.marketDataScope != null && this.marketDataScope.OrganizationTypes != null && id != null) {
      return this.marketDataScope.OrganizationTypes.find(x => +x.Value === id).Name;
    }
  }

  get isHourly(): boolean {
    return (this.selectedRate === RateType.Hourly);
  }

  calculateDataByRate(value: number): number {
    return this.isHourly
      ? DataCardHelper.calculateDataByHourlyRate(value)
      : value;
  }

  handleRateSelectionChange(type: KendoDropDownItem) {
    const selectedRateType = RateType[type.Value];
    this.store.dispatch(new fromDataCardActions.SetSelectedRate(selectedRateType));
  }

  ngOnDestroy(): void {
    this.jobResultsSub.unsubscribe();
    this.workflowContextSub.unsubscribe();
    this.selectedPaymarketSub.unsubscribe();
    this.selectedJobSub.unsubscribe();
    this.selectedRateSub.unsubscribe();
    this.marketDataScopeSub.unsubscribe();
    this.selectedFactorsSub.unsubscribe();
    this.initJobInitialPricingSub.unsubscribe();
  }
}
