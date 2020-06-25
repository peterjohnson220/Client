import { Component, OnDestroy, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';
import { GridDataResult } from '@progress/kendo-angular-grid';

import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import { StructuresHighchartsService, StructuresPagesService } from '../../../shared/services';
import { JobRangeModelChartService, JobRangeModelChartSeries } from '../../data';
import { GraphHelper } from '../../../shared/helpers/graph.helper';
import { RangeGroupMetadata } from '../../../shared/models';

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
  pageViewId: string;
  pageViewIdSubscription: Subscription;
  jobRangeData: GridDataResult;
  currency: string;
  controlPointDisplay: string;
  rate: string;
  isCurrent: boolean;
  hasCurrentStructure: boolean;
  metaData: RangeGroupMetadata;

  constructor(
    public store: Store<any>,
    private structuresPagesService: StructuresPagesService
  ) {
    this.metadataSubscription = this.store.select(fromSharedJobBasedRangeReducer.getMetadata).subscribe(md => {
      if (md) {
        this.metaData = md;
        this.isCurrent = md.IsCurrent;
        this.rate = md.Rate;
        this.currency = md.Currency;
        this.controlPointDisplay = md.ControlPointDisplay;
        this.chartLocale = getUserLocale();
        this.rate = md.Rate;
        this.clearData();
        this.chartOptions = JobRangeModelChartService.getRangeOptions(this.chartLocale, this.currency, this.controlPointDisplay, this.rate);
      }
    });
    this.pageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.pageViewId = pv);
    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.pageViewId).subscribe(data => {
      if (data && this.rate && this.currency) {
        this.jobRangeData = data;
        this.processChartData();
      }
    });
  }

  formatRangeDelta(rawCurrency, low) {
    return StructuresHighchartsService.formatCurrency(rawCurrency, this.chartLocale, this.currency, this.rate, true)
      + (low ? ' to bring to minimum' : ' over maximum');
  }

  rangeChartCallback(chart: Highcharts.Chart = null) {
    // set the instance
    if (chart) {
      this.chartInstance = chart;
    }

  }

  private determineChartMin(currentRow) {
    // if we find average or avg outlier data AND its lower than CompanyStructures_Ranges_Min, use that value to check for new min.
    // otherwise just use CompanyStructures_Ranges_Min
    // also make sure the comparison value is at least zero, aka not NULL. This is to prevent negative y-axis values
    let comparisonValue = currentRow.CompanyStructures_Ranges_Min == null ? 0 : currentRow.CompanyStructures_Ranges_Min;
    // first check the averageminoutlier
    if (!!currentRow.CompanyStructures_RangeGroup_AverageEEMinOutlier &&
      currentRow.CompanyStructures_RangeGroup_AverageEEMinOutlier < comparisonValue) {
      comparisonValue = currentRow.CompanyStructures_RangeGroup_AverageEEMinOutlier;
    }
    // next check the averageEEMRP
    if (!!currentRow.CompanyStructures_RangeGroup_AverageEEMRP &&
      currentRow.CompanyStructures_RangeGroup_AverageEEMRP < comparisonValue) {
      comparisonValue = currentRow.CompanyStructures_RangeGroup_AverageEEMRP;
    }

    if (this.chartMin === undefined || comparisonValue < this.chartMin) {
      this.chartMin = comparisonValue;
    }
  }

  private determineChartMax(currentRow) {
    // if we find average or avg outlier data AND its higher than CompanyStructures_Ranges_Max, use that value to check for new max.
    // otherwise just use CompanyStructures_Ranges_Max
    let comparisonValue = currentRow.CompanyStructures_Ranges_Max;
    // first check the averagemaxoutlier
    if (currentRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier &&
      currentRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier > comparisonValue) {
      comparisonValue = currentRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier;
    }
    // next check the averageEEMRP
    if (currentRow.CompanyStructures_RangeGroup_AverageEEMRP &&
      currentRow.CompanyStructures_RangeGroup_AverageEEMRP > comparisonValue) {
      comparisonValue = currentRow.CompanyStructures_RangeGroup_AverageEEMRP;
    }

    if (this.chartMax === undefined || comparisonValue > this.chartMax) {
      this.chartMax = comparisonValue;
    }
  }

  private addSalaryRange(xCoordinate, currentRow) {
    this.salaryRangeSeriesData.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Min, currentRow.CompanyStructures_Ranges_Max));
  }

  private addMidpoint(currentRow) {
    const delta = StructuresHighchartsService.formatMidPointDelta(this.hasCurrentStructure, currentRow, this.chartLocale, this.metaData);

    this.midpointSeriesData.push({
      y: currentRow.CompanyStructures_Ranges_Mid,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      midPoint: StructuresHighchartsService.formatCurrentMidPoint(this.hasCurrentStructure, 'Midpoint',
        currentRow.CompanyStructures_Ranges_Mid, this.chartLocale, this.metaData),
      currentMidPoint: StructuresHighchartsService.formatNewMidPoint(this.hasCurrentStructure, 'Current Mid',
        currentRow.CompanyStructures_RangeGroup_CurrentStructureMidPoint, this.chartLocale, this.metaData),
      newMidPoint: StructuresHighchartsService.formatNewMidPoint(this.hasCurrentStructure, 'New Mid',
        currentRow.CompanyStructures_Ranges_Mid, this.chartLocale, this.metaData),
      delta: !!delta ? delta.message : delta,
      icon: !!delta ? delta.icon : delta,
      iconColor: !!delta ? delta.color : delta
    });
  }

  private addAverage(currentRow) {
    this.averageSeriesData.push({
      y: currentRow.CompanyStructures_RangeGroup_AverageEEMRP,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      avgComparatio: currentRow.CompanyStructures_RangeGroup_AverageComparatio,
      avgPositioninRange: currentRow.CompanyStructures_RangeGroup_AveragePositionInRange,
      avgSalary: this.formatSalary(currentRow.CompanyStructures_RangeGroup_AverageEEMRP)
    });
  }

  private formatOutlierCount(min: boolean, count: number) {
    return `${count} ${count > 1 ? 'employees' : 'employee'} ${min ? 'below min' : 'above max'}`;
  }

  private formatSalary(salary: number) {
    return `Average ${this.controlPointDisplay}: ${StructuresHighchartsService.formatCurrency(salary, this.chartLocale, this.currency, this.rate, true)}`;
  }

  private formatDelta(min: boolean, delta: number) {
    return StructuresHighchartsService.formatCurrency(delta, this.chartLocale, this.currency, this.rate, true)
      + (min ? ' to bring all to minimum' : ' above the maximum');
  }

  private clearData(): void {
    if (this.jobRangeData) {
      this.jobRangeData = {...this.jobRangeData, data: []};
    }
  }

  private processAndAddOutliers(xCoordinate, currentRow) {
    // Min Outlier
    this.outlierSeriesData.push(
      {
        x: xCoordinate,
        y: currentRow.CompanyStructures_RangeGroup_AverageEEMinOutlier,
        count: currentRow.CompanyStructures_RangeGroup_CountEEMinOutlier,
        countString: this.formatOutlierCount(true, currentRow.CompanyStructures_RangeGroup_CountEEMinOutlier),
        avgSalary: this.formatSalary(currentRow.CompanyStructures_RangeGroup_AverageEEMinOutlier),
        delta: this.formatDelta(true, currentRow.CompanyStructures_RangeGroup_SumOfDeltaBetweenMinOutliersAndMRP)
      });

    // Max Outlier
    this.outlierSeriesData.push(
      {
        x: xCoordinate,
        y: currentRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier,
        count: currentRow.CompanyStructures_RangeGroup_CountEEMaxOutlier,
        countString: this.formatOutlierCount(false, currentRow.CompanyStructures_RangeGroup_CountEEMaxOutlier),
        avgSalary: this.formatSalary(currentRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier),
        delta: this.formatDelta(false, currentRow.CompanyStructures_RangeGroup_SumOfDeltaBetweenMaxOutliersAndMRP)
      });
  }

  private processChartData() {
    this.salaryRangeSeriesData = [];
    this.midpointSeriesData = [];
    this.averageSeriesData = [];
    this.outlierSeriesData = [];
    this.chartMin = undefined;
    this.chartMax = undefined;
    for (let i = 0; i < this.jobRangeData.data.length; i++) {
      const currentRow = this.jobRangeData.data[i];
      this.hasCurrentStructure = currentRow.CompanyStructures_RangeGroup_CurrentStructureMidPoint === null;
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
    this.chartInstance.series[JobRangeModelChartSeries.SalaryRange].setData(this.salaryRangeSeriesData, false);
    this.chartInstance.series[JobRangeModelChartSeries.SalaryRangeHidden].setData(this.salaryRangeSeriesData, false);
    this.chartInstance.series[JobRangeModelChartSeries.RangeMid].setData(this.midpointSeriesData, false);
    this.chartInstance.series[JobRangeModelChartSeries.Average].setData(this.averageSeriesData, false);
    this.chartInstance.series[JobRangeModelChartSeries.EmployeeOutliers].setData(this.outlierSeriesData, true);

    this.chartInstance.setSize(null, GraphHelper.getChartHeight(this.jobRangeData.data));
  }

  ngOnInit(): void {
    StructuresHighchartsService.initializeHighcharts();
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
    this.pageViewIdSubscription.unsubscribe();
  }
}
