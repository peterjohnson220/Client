import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts';
import { YAxisPlotBandsOptions } from 'highcharts';
import { Store } from '@ngrx/store';
import { getUserLocale } from 'get-user-locale';

import { PricingForPayGraph } from 'libs/models/payfactors-api/pricings/response';
import { FormattersService } from 'libs/core/services';
import { RangeGraphHelper } from 'libs/core/helpers';

import { PricingGraphTypeEnum } from '../../models/pricing-graph-type.enum';
import { JobPricingGraphService } from '../../services/job-pricing-graph.service';
import * as fromJobPricingGraphActions from '../../actions';
import * as fromJobPricingGraphReducer from '../../reducers';

@Directive()
export abstract class AbstractJobPricingGraphDirective implements OnChanges {

  constructor(private graphStore: Store<fromJobPricingGraphReducer.State>) {
    this.chartOptions = JobPricingGraphService.getPricingGraphChartOptions(this.marginLeft);
    JobPricingGraphService.initializePricingHighcharts();
    this.userLocale = getUserLocale();
  }

  @Input() paymarketId: number;
  @Input() companyJobId: number;
  @Input() showPayLabel = true;
  @Input() marginLeft = 100;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  userLocale: string;
  chartMin: number;
  chartMax: number;

  ngOnChanges(changes: SimpleChanges): void {
    this.graphStore.dispatch(new fromJobPricingGraphActions.LoadGraphPayData(this.companyJobId, this.paymarketId));
  }

  refreshData(): void {
    this.graphStore.dispatch(new fromJobPricingGraphActions.LoadGraphPayData(this.companyJobId, this.paymarketId));
  }

  updateChartData(
    scatterData: any,
    pricingData: PricingForPayGraph,
    payDataValues: number[],
    isValidPricingData: boolean,
    graphType: PricingGraphTypeEnum,
    payLabel: string,
    chartRef: Highcharts.Chart
  ): void {
    if (!chartRef?.axes?.length || !isValidPricingData) {
      return;
    }

    JobPricingGraphService.resetGraph(chartRef);

    const decimalPlaces = pricingData.Rate === 'Hourly' ? 2 : 1;

    this.chartMin = (pricingData.Pay10);
    this.chartMax = (pricingData.Pay90);

    const plotBands: YAxisPlotBandsOptions[] =
      JobPricingGraphService.getYAxisPlotBandsOptionsArray(pricingData, graphType, false, true, decimalPlaces);

    plotBands.forEach(x => chartRef.yAxis[0].addPlotBand(x));

    if (payDataValues?.length) {
      this.chartMin = RangeGraphHelper.getChartMin(payDataValues, this.chartMin);
      this.chartMax = RangeGraphHelper.getChartMax(payDataValues, this.chartMax);
    }

    if (scatterData.length === 0) {
      scatterData.push({
        x: 0,
      });
    }

    JobPricingGraphService.updateChartTooltip(chartRef, graphType);

    JobPricingGraphService.renderGraph(
      chartRef,
      this.chartMin,
      this.chartMax,
      FormattersService.roundNumber(pricingData.PayAvg, decimalPlaces),
      scatterData,
      payLabel
    );
  }

}
