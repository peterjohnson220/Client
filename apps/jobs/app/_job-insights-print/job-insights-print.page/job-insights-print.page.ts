import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromJobInsightsMainReducer from 'libs/features/jobs/job-insights/reducers';
import { AbstractJobInsightsComponent, JobInsightsMode } from 'libs/features/jobs/job-insights/models';
import { JobPricingChartSettings } from 'libs/features/pricings/job-pricing-graph/models';

@Component({
  selector: 'pf-job-insights-print',
  templateUrl: './job-insights-print.page.html',
  styleUrls: ['./job-insights-print.page.scss']
})
export class JobInsightsPrintPageComponent extends AbstractJobInsightsComponent implements OnDestroy, OnInit {
  urlParamSubscription: Subscription;

  jobInsightsPrintMode = JobInsightsMode.Print;
  today: Date;
  chartSettings: JobPricingChartSettings;
  basePayChartSettings: JobPricingChartSettings;
  totalCashChartSettings: JobPricingChartSettings;

  constructor(
    protected jobInsightsMainStore: Store<fromJobInsightsMainReducer.State>,
    protected rootStore: Store<fromRootState.State>,
    private route: ActivatedRoute
  ) {
    super(jobInsightsMainStore, rootStore);
    this.today = new Date();
    this.chartSettings = {
      MarginLeft: 30,
      MarginRight: 20,
      MarginBottom: 30,
      SpacingTop: 50,
      Height: 120,
      ShowPayLabel: false,
      Theme: 'print',
      DecimalPlaces: 1,
      IncludeAvgLine: true,
      ForceDecimals: true,
      LabelYPosition: -20
    };
    this.basePayChartSettings = {
      ...this.chartSettings,
      PayLabel: 'Base Pay'
    };
    this.totalCashChartSettings = {
      ...this.chartSettings,
      PayLabel: 'Total Cash'
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.urlParamSubscription = this.route.params.subscribe(params => {
      this.companyJobId = params['companyJobId'];
      this.companyPayMarketId = params['companyPayMarketId'];
      this.loadJobInsightsForPrint();
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.urlParamSubscription.unsubscribe();
  }

  protected handleJobInsightsLoaded(): void {
    this.companyJobCustomFields = this.jobInsights.CustomFields;
    this.updateJobDetails();
  }
}
