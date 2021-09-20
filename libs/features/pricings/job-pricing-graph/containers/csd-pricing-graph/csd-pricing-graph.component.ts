import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts';
import { YAxisPlotBandsOptions } from 'highcharts';
import { getUserLocale } from 'get-user-locale';

import { PricingForPayGraph } from 'libs/models/payfactors-api/pricings/response';

import { JobPricingGraphService } from '../../services';
import { PricingGraphTypeEnum, JobPricingChartSettings, getDefaultChartSettings } from '../../models';

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
  chartOptions: Highcharts.Options;
  updateFlag = false;

  userLocale: string;
  chartMin: number;
  chartMax: number;
  showChart: true;
  chartSettings: JobPricingChartSettings;

  constructor() {}

  ngOnInit(): void {
    JobPricingGraphService.initializePricingHighcharts();
    this.userLocale = getUserLocale();
    this.chartSettings = {
      ...getDefaultChartSettings(),
      MarginLeft: 120
    };
    this.chartOptions = JobPricingGraphService.getPricingGraphChartOptions(this.chartSettings);
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

      if (data === null) {
        return;
      }

      this.chartMin = data.OverallMin;
      this.chartMax = data.OverallMax;

      const decimalPlaces = data.Rate === 'Hourly' ? 2 : 1;
      this.chartSettings.PayLabel = this.graphType === PricingGraphTypeEnum.Base ? 'Base Pay' : 'Total Cash';
      this.chartSettings.IncludeAvgLine = false;
      this.chartSettings.DecimalPlaces = decimalPlaces;
      this.chartSettings.ForceChartAlignment = true;

      const plotBands: YAxisPlotBandsOptions[] = JobPricingGraphService.getYAxisPlotBandsOptionsArray(data, this.graphType, this.chartSettings);
      plotBands.forEach(x => this.chartRef.yAxis[0].addPlotBand(x));

      // just in case you're curious, the bogus scatterData is here because you have to have "something" in series data for highcharts to display properly
      JobPricingGraphService.updateChartTooltip(this.chartRef, this.graphType);
      JobPricingGraphService.renderGraph(this.chartRef, this.chartMin, this.chartMax, data.PayAvg, [{x: 0}], this.chartSettings);
      this.chartRef.redraw();
    }
  }
}
