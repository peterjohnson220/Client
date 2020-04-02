import { Component, OnDestroy, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';

import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import { StructuresHighchartsService } from '../../../shared/services';
import { PageViewIds } from '../../../shared/constants/page-view-ids';

@Component({
  selector: 'pf-job-based-range-chart',
  templateUrl: './job-based-range-chart.component.html',
  styleUrls: ['./job-based-range-chart.component.scss']
})
export class JobBasedRangeChartComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  updateFlag: boolean;
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  chartMin: number;
  chartMax: number;
  salaryRangeSeriesData: any;
  midpointSeriesData: any;
  averageSeriesData: any;
  outlierSeriesData: any;
  chartLocale: string; // en-US
  chartInstance: Highcharts.Chart;
  dataSubscription: Subscription;
  metadataSubscription: Subscription;
  pageViewId = PageViewIds.Model;
  currency: string;
  controlPointDisplay: string;

  constructor(
    public store: Store<any>
  ) {
    this.metadataSubscription = this.store.select(fromSharedJobBasedRangeReducer.getMetadata).subscribe(md => {
      if (md) {
        this.currency = md.Currency;
        this.controlPointDisplay = md.ControlPointDisplay;
        this.chartLocale = getUserLocale();
        this.chartOptions = StructuresHighchartsService.getRangeOptions(this.chartLocale, this.currency, this.controlPointDisplay);
      }
    });
    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.pageViewId).subscribe(data => {
      if (data) {
        this.processChartData(data);
      }
    });
  }

  formatRangeDelta(rawCurrency, low) {
    return StructuresHighchartsService.formatCurrency(rawCurrency, this.chartLocale, this.currency)
      + (low ? ' to bring to minimum' : ' over maximum');
  }

  rangeChartCallback(chart: Highcharts.Chart = null) {
    // set the instance
    if (chart) {
      this.chartInstance = chart;
    }

  }

  private determineChartMin(currentRow) {
    if (!this.chartMin || (currentRow.CompanyStructures_Ranges_Min < this.chartMin)) {
      this.chartMin = currentRow.CompanyStructures_Ranges_Min;
    }
  }

  private determineChartMax(currentRow) {
    if (!this.chartMax || (currentRow.CompanyStructures_Ranges_Max > this.chartMax)) {
      this.chartMax = currentRow.CompanyStructures_Ranges_Max;
    }
  }

  private addSalaryRange(xCoordinate, currentRow) {
    this.salaryRangeSeriesData.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Min, currentRow.CompanyStructures_Ranges_Max));
  }

  private addMidpoint(currentRow) {
    this.midpointSeriesData.push(StructuresHighchartsService.calculateMidpoint(
      currentRow.CompanyStructures_Ranges_Min, currentRow.CompanyStructures_Ranges_Max));
  }

  private addAverage(currentRow) {
    this.averageSeriesData.push(currentRow.CompanyStructures_RangeGroup_AverageEEMRP);
  }

  private processAndAddOutliers(xCoordinate, currentRow) {
    // Min Outlier
    this.outlierSeriesData.push(
      {
        x: xCoordinate,
        y: currentRow.CompanyStructures_RangeGroup_AverageEEMinOutlier,
        count: currentRow.CompanyStructures_RangeGroup_CountEEMinOutlier
      });
    // Max Outlier
    this.outlierSeriesData.push(
      {
        x: xCoordinate,
        y: currentRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier,
        count: currentRow.CompanyStructures_RangeGroup_CountEEMaxOutlier
      });
  }

  private processChartData(data: any) {
    this.salaryRangeSeriesData = [];
    this.midpointSeriesData = [];
    this.averageSeriesData = [];
    this.outlierSeriesData = [];
    for (let i = 0; i < data.data.length; i++) {
      const currentRow = data.data[i];
      // check for new min
      this.determineChartMin(currentRow);

      // check for new max
      this.determineChartMax(currentRow);

      // always add to salary range group
      this.addSalaryRange(i, currentRow);

      // always add to midpoint
      this.addMidpoint(currentRow);

      // add to average
      this.addAverage(currentRow);

      // add any outliers
      this.processAndAddOutliers(i, currentRow);
    }

    // set the min/max
    this.chartInstance.yAxis[0].setExtremes(this.chartMin, this.chartMax, false);
    // set the series data (0 - salaryRange, 1 - midpoint, 2 - avg salary, 3 - outliers)
    this.chartInstance.series[0].setData(this.salaryRangeSeriesData, false);
    this.chartInstance.series[1].setData(this.midpointSeriesData, false);
    this.chartInstance.series[2].setData(this.averageSeriesData, false);
    this.chartInstance.series[3].setData(this.outlierSeriesData, true);

    // this seemed like a pretty good way to get things to line up. 65 is a constant to account for gaps and headers, the rest is dynamic based on rows
    this.chartInstance.setSize(null, (50 * data.data.length) + 65);
  }

  ngOnInit(): void {
    StructuresHighchartsService.initializeHighcharts();
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
  }

}
