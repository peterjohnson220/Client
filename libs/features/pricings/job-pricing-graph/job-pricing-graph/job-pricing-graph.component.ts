import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts';
import { YAxisPlotBandsOptions } from 'highcharts';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';

import { AsyncStateObj } from 'libs/models/state';
import { PricingForPayGraph } from 'libs/models/payfactors-api/pricings/response';
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
    ).subscribe(data => {
      if (data) {
        this.updateChartData(data, this.userLocale);
      }
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.store.dispatch(new fromBasePayGraphActions.GetPricingData(this.companyJobId, this.paymarketId));
  }

  ngOnDestroy() {
    this.dataUpdatedSubscription.unsubscribe();
  }

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  }

  updateChartData(data: any, userLocale: string): void {

    JobPricingGraphService.resetGraph(this.chartRef);

    if (data.pricing === null ) {
      return;
    }

    this.chartMin = (data.pricing.Pay10);
    this.chartMax = (data.pricing.Pay90);

    const plotBands: YAxisPlotBandsOptions[] = JobPricingGraphService.getYAxisPlotBandsOptionsArray(data.pricing, 'Base');

    plotBands.forEach(x => this.chartRef.yAxis[0].addPlotBand(x));

    const scatterData = [];
    const counts = {};

    if (data.basePay) {
      data.basePay.forEach(function (x) {
        counts[x.Base] = (counts[x.Base] || 0) + 1;
      });

      data.basePay.forEach(x => {
        scatterData.push(JobPricingGraphService.formatScatterData(x, data.pricing, counts[x.Base], userLocale));
      });

      const basePayValues = data.basePay.map(a => a.Base);
      const maxValue = Math.max(...basePayValues) / 1000;
      const minValue = Math.min(...basePayValues) / 1000;

      if (maxValue > this.chartMax) {
        this.chartMax = maxValue;
      }
      if (minValue < this.chartMin) {
        this.chartMin = minValue;
      }
    }
    if (scatterData.length === 0) {
      scatterData.push({
        x: 0,
      });
    }
    JobPricingGraphService.renderGraph(this.chartRef, this.chartMin, this.chartMax, data.pricing.PayAvg, scatterData, 'Base Pay');
  }
}
