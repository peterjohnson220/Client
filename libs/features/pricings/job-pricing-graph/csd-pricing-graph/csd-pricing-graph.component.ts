import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts';
import { YAxisPlotBandsOptions } from 'highcharts';
import { ActionsSubject, Store } from '@ngrx/store';
import { getUserLocale } from 'get-user-locale';

import { PricingForPayGraph } from 'libs/models/payfactors-api/pricings/response';
import { JobPricingGraphService } from '../services/job-pricing-graph.service';

import * as fromBasePayGraphReducer from '../reducers';

@Component({
  selector: 'pf-csd-pricing-graph',
  templateUrl: './csd-pricing-graph.component.html',
  styleUrls: ['./csd-pricing-graph.component.scss']
})
export class CsdPricingGraphComponent implements OnInit, OnChanges, OnDestroy {

  @Input() csdPricingData: PricingForPayGraph;
  @Input() payType: string;

  Highcharts: typeof Highcharts = Highcharts;
  chartRef: Highcharts.Chart;
  chartOptions: Highcharts.Options = JobPricingGraphService.getPricingGraphChartOptions(120);
  updateFlag = false;

  userLocale: string;
  chartMin: number;
  chartMax: number;
  showChart: true;

  constructor(
    private store: Store<fromBasePayGraphReducer.State>,
    private actionsSubject: ActionsSubject
  ) {
  }

  ngOnInit(): void {
    JobPricingGraphService.initializePricingHighcharts();
    this.userLocale = getUserLocale();

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChartData(this.csdPricingData, this.userLocale);
  }

  ngOnDestroy() {

  }

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  }

  updateChartData(data: any, userLocale: string): void {

    if (this.chartRef) {
      JobPricingGraphService.resetGraph(this.chartRef, false);

      if (data === null ) {
        return;
      }

      this.chartMin = data.OverallMin;
      this.chartMax = data.OverallMax;

      const plotBands: YAxisPlotBandsOptions[] = JobPricingGraphService.getYAxisPlotBandsOptionsArray(data, this.payType, true, true);

      plotBands.forEach(x => this.chartRef.yAxis[0].addPlotBand(x));

      // just in case you're curious, the bogus scatterData is here because you have to have "something" in series data for highcharts to display properly
      JobPricingGraphService.renderGraph(this.chartRef, this.chartMin, this.chartMax, data.PayAvg,
        [{x: 0}], this.payType === 'Base' ? 'Base Pay' : 'Total Cash', false);
      this.chartRef.redraw();
    }
  }
}
