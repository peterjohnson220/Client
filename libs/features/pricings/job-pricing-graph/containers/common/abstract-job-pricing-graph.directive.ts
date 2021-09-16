import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts';
import { YAxisPlotBandsOptions } from 'highcharts';
import { Store } from '@ngrx/store';
import { getUserLocale } from 'get-user-locale';

import { PricingForPayGraph } from 'libs/models/payfactors-api/pricings/response';
import { FormattersService } from 'libs/core/services';
import { RangeGraphHelper } from 'libs/core/helpers';
import { EmployeesPayModel } from 'libs/models/payfactors-api';

import { PricingGraphTypeEnum, JobPricingChartSettings, getDefaultChartSettings } from '../../models';
import { JobPricingGraphService } from '../../services/job-pricing-graph.service';
import * as fromJobPricingGraphActions from '../../actions';
import * as fromJobPricingGraphReducer from '../../reducers';

@Directive()
export abstract class AbstractJobPricingGraphDirective implements OnChanges {
  @Input() paymarketId: number;
  @Input() companyJobId: number;
  @Input() chartSettings: JobPricingChartSettings = getDefaultChartSettings();

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  graphType: PricingGraphTypeEnum;

  userLocale: string;
  chartMin: number;
  chartMax: number;
  isValidPricingData: boolean;
  pricingData: PricingForPayGraph;
  payData: EmployeesPayModel[];

  constructor(private graphStore: Store<fromJobPricingGraphReducer.State>) {
    JobPricingGraphService.initializePricingHighcharts();
    this.userLocale = getUserLocale();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.graphStore.dispatch(new fromJobPricingGraphActions.LoadGraphPayData(this.companyJobId, this.paymarketId));
  }

  refreshData(): void {
    this.graphStore.dispatch(new fromJobPricingGraphActions.LoadGraphPayData(this.companyJobId, this.paymarketId));
  }

  updateChartData(scatterData: any, payDataValues: number[], chartRef: Highcharts.Chart): void {
    if (!chartRef?.axes?.length || !this.isValidPricingData) {
      return;
    }

    JobPricingGraphService.resetGraph(chartRef);

    this.chartMin = (this.pricingData.Pay10);
    this.chartMax = (this.pricingData.Pay90);

    const plotBands: YAxisPlotBandsOptions[] =
      JobPricingGraphService.getYAxisPlotBandsOptionsArray(this.pricingData, this.graphType, this.chartSettings);

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

    JobPricingGraphService.updateChartTooltip(chartRef, this.graphType);

    JobPricingGraphService.renderGraph(
      chartRef,
      this.chartMin,
      this.chartMax,
      FormattersService.roundNumber(this.pricingData.PayAvg, 1),
      scatterData,
      this.chartSettings
    );
  }

}
