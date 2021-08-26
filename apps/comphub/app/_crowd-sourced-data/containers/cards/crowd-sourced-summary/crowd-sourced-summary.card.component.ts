import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { JobData, JobGridData, PricingPaymarket } from 'libs/models/comphub';
import { Rates, RateType } from 'libs/data/data-sets';
import { KendoDropDownItem } from 'libs/models';
import { GetCrowdSourcedJobPricingRequest, PricingForPayGraph } from 'libs/models/payfactors-api';

import { ComphubPages } from '../../../../_shared/data';
import { MarketDataScope, WorkflowContext } from '../../../../_shared/models';
import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromJobGridActions from '../../../../_shared/actions/job-grid.actions';
import { SummaryPageSalaryData, PercentileRateDisplay } from '../../../models';
import * as fromMarketsCardActions from '../../../../_shared/actions/markets-card.actions';
import { DataCardHelper } from '../../../../_shared/helpers';
import { CompensableFactorDataMapper } from '../../../helpers';
import * as fromCompensableFactorsActions from '../../../actions/compensable-factors.actions';
import * as fromComphubCsdReducer from '../../../reducers';
import * as fromDataCardActions from '../../../../_shared/actions/data-card.actions';
import * as fromExportDataActions from '../../../actions/export-data.actions';

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
  basePayGraph: PricingForPayGraph;
  tccPayGraph: PricingForPayGraph;
  firstDayOfMonth: Date;
  selectedRate: RateType;
  selectedDisplayRate: string;
  selectedRateSub: Subscription;
  marketDataScopeSub: Subscription;
  marketDataScope: MarketDataScope;
  selectedFactors: {};
  selectedFactorsSub: Subscription;
  initJobInitialPricingSub: Subscription;
  rates: KendoDropDownItem[] = Rates;
  displayRates: PercentileRateDisplay[];
  selectedBaseValue: number;
  selectedTccValue: number;

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
    // fill out the percentile rate data
    this.displayRates = [
      { Name: '10th percentile', Value: '10' },
      { Name: '25th percentile', Value: '25' },
      { Name: '50th percentile', Value: '50' },
      { Name: '75th percentile', Value: '75' },
      { Name: '90th percentile', Value: '90' },
      { Name: 'Average', Value: 'Avg' }
    ];
    // default to 50
    this.selectedDisplayRate = '50';

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
      this.mapJobDataToPayGraphData(this.selectedJob);
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
      SelectedFactors: CompensableFactorDataMapper.mapSelectedFactorsToCompensableFactorsRequest(this.selectedFactors),
      IncludeExportData: true
    };
    this.store.dispatch(new fromJobGridActions.GetCrowdSourcedJobPricing(request));
    this.store.dispatch(new fromExportDataActions.GetExportData());
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
    this.mapJobDataToPayGraphData(this.selectedJob);
  }

  handleExportJobBtnClicked() {
    this.store.dispatch(new fromExportDataActions.SaveExportData());
  }

  mapJobDataToPayGraphData(selectedJob: JobData) {
    if (!!selectedJob) {
      this.basePayGraph = {
        Pay10: this.getPricingDisplayValue(selectedJob.Base10),
        Pay25: this.getPricingDisplayValue(selectedJob.Base25),
        Pay50: this.getPricingDisplayValue(selectedJob.Base50),
        Pay75: this.getPricingDisplayValue(selectedJob.Base75),
        Pay90: this.getPricingDisplayValue(selectedJob.Base90),
        PayAvg: this.getPricingDisplayValue(selectedJob.BaseAvg),
        Currency: this.selectedPaymarket?.CurrencyCode,
        Rate: this.selectedRate.toString(),
        OverallMin: this.getPricingDisplayValue(selectedJob.Base10),
        OverallMax: this.getPricingDisplayValue(selectedJob.Tcc90)
      };


      this.tccPayGraph = {
        Pay10: this.getPricingDisplayValue(selectedJob.Tcc10),
        Pay25: this.getPricingDisplayValue(selectedJob.Tcc25),
        Pay50: this.getPricingDisplayValue(selectedJob.Tcc50),
        Pay75: this.getPricingDisplayValue(selectedJob.Tcc75),
        Pay90: this.getPricingDisplayValue(selectedJob.Tcc90),
        PayAvg: this.getPricingDisplayValue(selectedJob.TccAvg),
        Currency: this.selectedPaymarket?.CurrencyCode,
        Rate: this.selectedRate.toString(),
        OverallMin: this.getPricingDisplayValue(selectedJob.Base10),
        OverallMax: this.getPricingDisplayValue(selectedJob.Tcc90)
      };

      this.setSelectedValues(this.selectedDisplayRate);
    }
  }

  handleDisplayRateSelectionChange(type: KendoDropDownItem) {
    this.setSelectedValues(type.Value);
  }

  setSelectedValues(selectedValue) {
    const selectedPercentileRate = this.displayRates.find(x => x.Value === selectedValue);
    const baseProperty = 'Base' + selectedPercentileRate.Value;
    const tccProperty = 'Tcc' + selectedPercentileRate.Value;
    this.selectedBaseValue = this.isHourly ? this.getPricingDisplayValue(this.selectedJob[baseProperty]) : this.selectedJob[baseProperty];
    this.selectedTccValue = this.isHourly ? this.getPricingDisplayValue(this.selectedJob[tccProperty]) : this.selectedJob[tccProperty];
  }

  getPricingDisplayValue(value) {
    const calculatedValue = this.calculateDataByRate(value);
    if (!this.isHourly) {
      return calculatedValue / 1000;
    }
    return calculatedValue;
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
