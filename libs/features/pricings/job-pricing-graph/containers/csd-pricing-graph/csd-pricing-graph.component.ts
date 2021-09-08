import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts';
import { YAxisPlotBandsOptions } from 'highcharts';
import { getUserLocale } from 'get-user-locale';

import { PricingForPayGraph } from 'libs/models/payfactors-api/pricings/response';

import { JobPricingGraphService } from '../../services/job-pricing-graph.service';
import { PricingGraphTypeEnum } from '../../models';

@Component({
  selector: 'pf-csd-pricing-graph',
  templateUrl: './csd-pricing-graph.component.html',
  styleUrls: ['./csd-pricing-graph.component.scss', '../../styles/graph-styles.scss']
})
export class CsdPricingGraphComponent implements OnInit, OnChanges {
  @Input() csdPricingData: PricingForPayGraph;
  @Input() graphType: PricingGraphTypeEnum;

  Highcharts: typeof Highcharts = Highcharts;
  chartRef: Highcharts.Chart;
  chartOptions: Highcharts.Options = JobPricingGraphService.getPricingGraphChartOptions(120);
  updateFlag = false;

  userLocale: string;
  chartMin: number;
  chartMax: number;
  showChart: true;

  constructor() {}

  ngOnInit(): void {
    JobPricingGraphService.initializePricingHighcharts();
    this.userLocale = getUserLocale();

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChartData(this.csdPricingData);
  }

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  }

  updateChartData(data: PricingForPayGraph): void {

    if (this.chartRef) {
      JobPricingGraphService.resetGraph(this.chartRef, false);

      if (data === null ) {
        return;
      }

      this.chartMin = data.OverallMin;
      this.chartMax = data.OverallMax;

      const decimalPlaces = data.Rate === 'Hourly' ? 2 : 1;

      const plotBands: YAxisPlotBandsOptions[] = JobPricingGraphService.getYAxisPlotBandsOptionsArray(data, this.graphType, true, true, decimalPlaces);

      plotBands.forEach(x => this.chartRef.yAxis[0].addPlotBand(x));

      // just in case you're curious, the bogus scatterData is here because you have to have "something" in series data for highcharts to display properly
      JobPricingGraphService.updateChartTooltip(this.chartRef, this.graphType);
      JobPricingGraphService.renderGraph(this.chartRef, this.chartMin, this.chartMax, data.PayAvg,
        [{x: 0}], this.graphType === PricingGraphTypeEnum.Base ? 'Base Pay' : 'Total Cash', false, true, decimalPlaces);
      this.chartRef.redraw();
    }
  }
}
