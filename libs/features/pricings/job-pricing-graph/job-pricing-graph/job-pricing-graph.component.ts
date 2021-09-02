import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts';
import { YAxisPlotBandsOptions } from 'highcharts';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';

import { AsyncStateObj } from 'libs/models/state';
import { PricingForPayGraph } from 'libs/models/payfactors-api/pricings/response';
import { EmployeesBasePayModel } from 'libs/models/payfactors-api';
import { RangeGraphHelper } from 'libs/core';

import { JobPricingGraphService } from '../services/job-pricing-graph.service';
import * as fromBasePayGraphActions from '../actions';
import * as fromBasePayGraphReducer from '../reducers';

@Component({
  selector: 'pf-job-pricing-graph',
  templateUrl: './job-pricing-graph.component.html',
  styleUrls: ['./job-pricing-graph.component.scss']
})
export class JobPricingGraphComponent implements OnInit, OnChanges, OnDestroy {

  @Input() paymarketId: number;
  @Input() companyJobId: number;

  dataUpdatedSubscription: Subscription;

  Highcharts: typeof Highcharts = Highcharts;
  chartRef: Highcharts.Chart;
  chartOptions: Highcharts.Options = JobPricingGraphService.getPricingGraphChartOptions();
  updateFlag = false;

  userLocale: string;
  chartMin: number;
  chartMax: number;
  showChart: true;

  pricingData$: Observable<AsyncStateObj<PricingForPayGraph>>;
  isValidPricingData: boolean;
  pricingData: PricingForPayGraph;
  basePay: EmployeesBasePayModel[];

  constructor(
    private store: Store<fromBasePayGraphReducer.State>,
    private actionsSubject: ActionsSubject
  ) {
  }

  ngOnInit(): void {
    JobPricingGraphService.initializePricingHighcharts();
    this.userLocale = getUserLocale();

    this.pricingData$ = this.store.select(fromBasePayGraphReducer.getPricing);

    this.dataUpdatedSubscription = this.actionsSubject.pipe(
      ofType(fromBasePayGraphActions.LOAD_BASE_PAY_DATA_SUCCESS)
    ).subscribe((action: fromBasePayGraphActions.LoadBasePayDataSuccess) => {
      this.isValidPricingData = JobPricingGraphService.validatePricingForPayGraph(action.pricing);
      this.pricingData = action.pricing;
      this.basePay = action.basePay;
      this.updateChartData();
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.store.dispatch(new fromBasePayGraphActions.GetPricingData(this.companyJobId, this.paymarketId));
  }

  ngOnDestroy() {
    this.dataUpdatedSubscription.unsubscribe();
  }

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    if (!this.chartRef?.axes?.length) {
      this.chartRef = chart;
      this.updateChartData();
    }
  }

  updateChartData(): void {
    if (!this.chartRef?.axes?.length || !this.isValidPricingData) {
      return;
    }

    JobPricingGraphService.resetGraph(this.chartRef);

    this.chartMin = (this.pricingData.Pay10);
    this.chartMax = (this.pricingData.Pay90);

    const plotBands: YAxisPlotBandsOptions[] = JobPricingGraphService.getYAxisPlotBandsOptionsArray(this.pricingData, 'Base');

    plotBands.forEach(x => this.chartRef.yAxis[0].addPlotBand(x));

    const scatterData = [];
    const counts = {};

    if (this.basePay?.length) {
      const basePayValues = this.basePay.map(a => a.Base / 1000);

      this.basePay.forEach(function (x) {
        counts[x.Base] = (counts[x.Base] || 0) + 1;
      });

      this.basePay.forEach(x => {
        scatterData.push(JobPricingGraphService.formatScatterData(x, this.pricingData, counts[x.Base], this.userLocale));
      });

      this.chartMin = RangeGraphHelper.getChartMin(basePayValues, this.chartMin);
      this.chartMax = RangeGraphHelper.getChartMax(basePayValues, this.chartMax);
    }
    if (scatterData.length === 0) {
      scatterData.push({
        x: 0,
      });
    }
    JobPricingGraphService.renderGraph(this.chartRef, this.chartMin, this.chartMax, this.pricingData.PayAvg, scatterData, 'Base Pay');
  }
}
