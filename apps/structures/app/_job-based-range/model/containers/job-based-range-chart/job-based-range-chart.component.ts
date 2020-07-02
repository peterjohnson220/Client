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
import { RangeDistributionTypeIds } from '../../../shared/constants/range-distribution-type-ids';
import { SalaryRangeSeries } from '../../../shared/models/salary-range-series.model';
import { DataPointSeries } from '../../../shared/models/data-point-series.model';

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
  salaryRangeSeriesDataModel: SalaryRangeSeries;
  dataPointSeriesDataModel: DataPointSeries;
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
  rangeDistributionTypeId: number;

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
        this.rangeDistributionTypeId = md.RangeDistributionTypeId;
        this.clearData();
        this.chartOptions =
          JobRangeModelChartService.getRangeOptions(this.chartLocale, this.currency, this.controlPointDisplay, this.rate, this.rangeDistributionTypeId);
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

    // Tertile
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
      if (!!currentRow.CompanyStructures_Ranges_Tertile_First && currentRow.CompanyStructures_Ranges_Tertile_First < comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Tertile_First;
      }

      if (!!currentRow.CompanyStructures_Ranges_Tertile_Second && currentRow.CompanyStructures_Ranges_Tertile_Second < comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Tertile_Second;
      }
    }

    // Quartile
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
      if (!!currentRow.CompanyStructures_Ranges_Quartile_First
        && currentRow.CompanyStructures_Ranges_Quartile_First < comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Quartile_First;
      }

      if (!!currentRow.CompanyStructures_Ranges_Quartile_Second
        && currentRow.CompanyStructures_Ranges_Quartile_Second < comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Quartile_Second;
      }
    }

    // Quintile
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
      if (!!currentRow.CompanyStructures_Ranges_Quintile_First
        && currentRow.CompanyStructures_Ranges_Quintile_First < comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Quintile_First;
      }

      if (!!currentRow.CompanyStructures_Ranges_Quintile_Second
        && currentRow.CompanyStructures_Ranges_Quintile_Second < comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Quintile_Second;
      }

      if (!!currentRow.CompanyStructures_Ranges_Quintile_Third
        && currentRow.CompanyStructures_Ranges_Quintile_Third < comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Quintile_Third;
      }

      if (!!currentRow.CompanyStructures_Ranges_Quintile_Fourth
        && currentRow.CompanyStructures_Ranges_Quintile_Fourth < comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Quintile_Fourth;
      }
    }

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

    // Tertile
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
      if (!!currentRow.CompanyStructures_Ranges_Tertile_First && currentRow.CompanyStructures_Ranges_Tertile_First > comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Tertile_First;
      }

      if (!!currentRow.CompanyStructures_Ranges_Tertile_Second && currentRow.CompanyStructures_Ranges_Tertile_Second > comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Tertile_Second;
      }
    }

    // Quartile
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
      if (!!currentRow.CompanyStructures_Ranges_Quartile_First
        && currentRow.CompanyStructures_Ranges_Quartile_First > comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Quartile_First;
      }

      if (!!currentRow.CompanyStructures_Ranges_Quartile_Second
        && currentRow.CompanyStructures_Ranges_Quartile_Second > comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Quartile_Second;
      }
    }

    // Quintile
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
      if (!!currentRow.CompanyStructures_Ranges_Quintile_First
        && currentRow.CompanyStructures_Ranges_Quintile_First > comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Quintile_First;
      }

      if (!!currentRow.CompanyStructures_Ranges_Quintile_Second
        && currentRow.CompanyStructures_Ranges_Quintile_Second > comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Quintile_Second;
      }

      if (!!currentRow.CompanyStructures_Ranges_Quintile_Third
        && currentRow.CompanyStructures_Ranges_Quintile_Third > comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Quintile_Third;
      }

      if (!!currentRow.CompanyStructures_Ranges_Quintile_Fourth
        && currentRow.CompanyStructures_Ranges_Quintile_Fourth > comparisonValue) {
        comparisonValue = currentRow.CompanyStructures_Ranges_Quintile_Fourth;
      }
    }

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

  private addSalaryRangeMinMidMax(xCoordinate, currentRow) {
    this.salaryRangeSeriesDataModel.MinMidMax.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Min, currentRow.CompanyStructures_Ranges_Max));
  }

  private addSalaryRangeTertile(xCoordinate, currentRow) {
    this.salaryRangeSeriesDataModel.Tertile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Tertile_First, currentRow.CompanyStructures_Ranges_Tertile_Second));
  }

  private addSalaryRangeQuartile(xCoordinate, currentRow) {
    this.salaryRangeSeriesDataModel.Quartile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Quartile_First, currentRow.CompanyStructures_Ranges_Quartile_Second));
  }

  private addSalaryRangeQuintile(xCoordinate, currentRow) {
    this.salaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Quintile_First, currentRow.CompanyStructures_Ranges_Quintile_Second));

    this.salaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Quintile_Third, currentRow.CompanyStructures_Ranges_Quintile_Fourth));
  }

  private addMidPoint(currentRow) {
    const delta = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      currentRow.CompanyStructures_Ranges_Mid, currentRow.CompanyStructures_RangeGroup_CurrentStructureMidPoint);

    this.dataPointSeriesDataModel.Mid.push({
      y: currentRow.CompanyStructures_Ranges_Mid,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Midpoint',
        currentRow.CompanyStructures_Ranges_Mid, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Mid',
        currentRow.CompanyStructures_RangeGroup_CurrentStructureMidPoint, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Mid',
        currentRow.CompanyStructures_Ranges_Mid, this.chartLocale, this.metaData),
      delta: !!delta ? delta.message : delta,
      icon: !!delta ? delta.icon : delta,
      iconColor: !!delta ? delta.color : delta
    });
  }

  private addTertilePoint(currentRow) {
    // Tertile First
    const deltaTertileFirst = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      currentRow.CompanyStructures_Ranges_Tertile_First, currentRow.CompanyStructures_Ranges_Tertile_CurrentFirst);

    this.dataPointSeriesDataModel.TertileFirst.push({
      y: currentRow.CompanyStructures_Ranges_Tertile_First,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 1st 3rd',
        currentRow.CompanyStructures_Ranges_Tertile_First, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 1st 3rd',
        currentRow.CompanyStructures_Ranges_Tertile_CurrentFirst, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 1st 3rd',
        currentRow.CompanyStructures_Ranges_Tertile_First, this.chartLocale, this.metaData),
      delta: !!deltaTertileFirst ? deltaTertileFirst.message : deltaTertileFirst,
      icon: !!deltaTertileFirst ? deltaTertileFirst.icon : deltaTertileFirst,
      iconColor: !!deltaTertileFirst ? deltaTertileFirst.color : deltaTertileFirst
    });

    // Tertile Second
    const deltaTertileSecond = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      currentRow.CompanyStructures_Ranges_Tertile_Second, currentRow.CompanyStructures_Ranges_Tertile_CurrentSecond);

    this.dataPointSeriesDataModel.TertileSecond.push({
      y: currentRow.CompanyStructures_Ranges_Tertile_Second,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 2nd 3rd',
        currentRow.CompanyStructures_Ranges_Tertile_Second, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 2nd 3rd',
        currentRow.CompanyStructures_Ranges_Tertile_CurrentSecond, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 2nd 3rd',
        currentRow.CompanyStructures_Ranges_Tertile_Second, this.chartLocale, this.metaData),
      delta: !!deltaTertileSecond ? deltaTertileSecond.message : deltaTertileSecond,
      icon: !!deltaTertileSecond ? deltaTertileSecond.icon : deltaTertileSecond,
      iconColor: !!deltaTertileSecond ? deltaTertileSecond.color : deltaTertileSecond
    });
  }

  private addQuartilePoint(currentRow) {
    // Quartile First
    const deltaQuartileFirst = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      currentRow.CompanyStructures_Ranges_Quartile_First, currentRow.CompanyStructures_Ranges_Quartile_CurrentFirst);

    this.dataPointSeriesDataModel.QuartileFirst.push({
      y: currentRow.CompanyStructures_Ranges_Quartile_First,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 1st 4th',
        currentRow.CompanyStructures_Ranges_Quartile_First, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 1st 4th',
        currentRow.CompanyStructures_Ranges_Quartile_CurrentFirst, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 1st 4th',
        currentRow.CompanyStructures_Ranges_Quartile_First, this.chartLocale, this.metaData),
      delta: !!deltaQuartileFirst ? deltaQuartileFirst.message : deltaQuartileFirst,
      icon: !!deltaQuartileFirst ? deltaQuartileFirst.icon : deltaQuartileFirst,
      iconColor: !!deltaQuartileFirst ? deltaQuartileFirst.color : deltaQuartileFirst
    });

    // Quartile Second
    const deltaQuartileSecond = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      currentRow.CompanyStructures_Ranges_Quartile_Second, currentRow.CompanyStructures_Ranges_Quartile_CurrentSecond);

    this.dataPointSeriesDataModel.QuartileSecond.push({
      y: currentRow.CompanyStructures_Ranges_Quartile_Second,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 3rd 4th',
        currentRow.CompanyStructures_Ranges_Quartile_Second, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 3rd 4th',
        currentRow.CompanyStructures_Ranges_Quartile_CurrentSecond, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 3rd 4th',
        currentRow.CompanyStructures_Ranges_Quartile_Second, this.chartLocale, this.metaData),
      delta: !!deltaQuartileSecond ? deltaQuartileSecond.message : deltaQuartileSecond,
      icon: !!deltaQuartileSecond ? deltaQuartileSecond.icon : deltaQuartileSecond,
      iconColor: !!deltaQuartileSecond ? deltaQuartileSecond.color : deltaQuartileSecond
    });
  }

  private addQuintilePoint(currentRow) {
    // Quintile First
    const deltaQuintileFirst = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      currentRow.CompanyStructures_Ranges_Quintile_First, currentRow.CompanyStructures_Ranges_Quintile_CurrentFirst);

    this.dataPointSeriesDataModel.QuintileFirst.push({
      y: currentRow.CompanyStructures_Ranges_Quintile_First,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 1st 5th',
        currentRow.CompanyStructures_Ranges_Quintile_First, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 1st 5th',
        currentRow.CompanyStructures_Ranges_Quintile_CurrentFirst, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 1st 5th',
        currentRow.CompanyStructures_Ranges_Quintile_First, this.chartLocale, this.metaData),
      delta: !!deltaQuintileFirst ? deltaQuintileFirst.message : deltaQuintileFirst,
      icon: !!deltaQuintileFirst ? deltaQuintileFirst.icon : deltaQuintileFirst,
      iconColor: !!deltaQuintileFirst ? deltaQuintileFirst.color : deltaQuintileFirst
    });

    // Quintile Second
    const deltaQuintileSecond = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      currentRow.CompanyStructures_Ranges_Quintile_Second, currentRow.CompanyStructures_Ranges_Quintile_CurrentSecond);

    this.dataPointSeriesDataModel.QuintileSecond.push({
      y: currentRow.CompanyStructures_Ranges_Quintile_Second,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 2nd 5th',
        currentRow.CompanyStructures_Ranges_Quintile_Second, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 2nd 5th',
        currentRow.CompanyStructures_Ranges_Quintile_CurrentSecond, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 2nd 5th',
        currentRow.CompanyStructures_Ranges_Quintile_Second, this.chartLocale, this.metaData),
      delta: !!deltaQuintileSecond ? deltaQuintileSecond.message : deltaQuintileSecond,
      icon: !!deltaQuintileSecond ? deltaQuintileSecond.icon : deltaQuintileSecond,
      iconColor: !!deltaQuintileSecond ? deltaQuintileSecond.color : deltaQuintileSecond
    });

    // Quintile Third
    const deltaQuintileThird = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      currentRow.CompanyStructures_Ranges_Quintile_Third, currentRow.CompanyStructures_Ranges_Quintile_CurrentThird);

    this.dataPointSeriesDataModel.QuintileThird.push({
      y: currentRow.CompanyStructures_Ranges_Quintile_Third,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 3rd 5th',
        currentRow.CompanyStructures_Ranges_Quintile_Third, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 3rd 5th',
        currentRow.CompanyStructures_Ranges_Quintile_CurrentThird, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 3rd 5th',
        currentRow.CompanyStructures_Ranges_Quintile_Third, this.chartLocale, this.metaData),
      delta: !!deltaQuintileThird ? deltaQuintileThird.message : deltaQuintileThird,
      icon: !!deltaQuintileThird ? deltaQuintileThird.icon : deltaQuintileThird,
      iconColor: !!deltaQuintileThird ? deltaQuintileThird.color : deltaQuintileThird
    });

    // Quintile Fourth
    const deltaQuintileFourth = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      currentRow.CompanyStructures_Ranges_Quintile_Fourth, currentRow.CompanyStructures_Ranges_Quintile_CurrentFourth);

    this.dataPointSeriesDataModel.QuintileFourth.push({
      y: currentRow.CompanyStructures_Ranges_Quintile_Fourth,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 4th 5th',
        currentRow.CompanyStructures_Ranges_Quintile_Fourth, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 4th 5th',
        currentRow.CompanyStructures_Ranges_Quintile_CurrentFourth, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 4th 5th',
        currentRow.CompanyStructures_Ranges_Quintile_Fourth, this.chartLocale, this.metaData),
      delta: !!deltaQuintileFourth ? deltaQuintileFourth.message : deltaQuintileFourth,
      icon: !!deltaQuintileFourth ? deltaQuintileFourth.icon : deltaQuintileFourth,
      iconColor: !!deltaQuintileFourth ? deltaQuintileFourth.color : deltaQuintileFourth
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
    this.salaryRangeSeriesDataModel = {
      MinMidMax: [],
      Quartile: [],
      Quintile: [],
      Tertile: []
    };

    this.dataPointSeriesDataModel = {
      Mid: [],
      TertileFirst: [],
      TertileSecond: [],
      QuartileFirst: [],
      QuartileSecond: [],
      QuintileFirst: [],
      QuintileSecond: [],
      QuintileThird: [],
      QuintileFourth: [],
    };

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
      this.addSalaryRangeMinMidMax(i, currentRow);

      // always add to midPoint
      this.addMidPoint(currentRow);

      // Tertile: salary range + data points
      if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
        this.addSalaryRangeTertile(i, currentRow);
        this.addTertilePoint(currentRow);
      }

      // Quartile: salary range + data points
      if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
        this.addSalaryRangeQuartile(i, currentRow);
        this.addQuartilePoint(currentRow);
      }

      // Quintile: salary ranges + data points
      if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
        this.addSalaryRangeQuintile(i, currentRow);
        this.addQuintilePoint(currentRow);
      }

      // add to average
      this.addAverage(currentRow);

      // add any outliers
      this.processAndAddOutliers(i, currentRow);
    }
    // set the min/max
    this.chartInstance.yAxis[0].setExtremes(this.chartMin, this.chartMax, false);

    // set the series data (0 - salaryRange, 1 - midPoint, 2 - avg salary, 3 - outliers)
    this.chartInstance.series[JobRangeModelChartSeries.SalaryRangeMinMidMax].setData(this.salaryRangeSeriesDataModel.MinMidMax, false);

    // we need this hidden salary range => will prevent from messing up when we hide salary range from the legend
    this.chartInstance.series[JobRangeModelChartSeries.SalaryRangeMinMidMaxHidden].setData(this.salaryRangeSeriesDataModel.MinMidMax, false);

    this.chartInstance.series[JobRangeModelChartSeries.RangeMid].setData(this.dataPointSeriesDataModel.Mid, false);
    this.chartInstance.series[JobRangeModelChartSeries.Average].setData(this.averageSeriesData, false);
    this.chartInstance.series[JobRangeModelChartSeries.EmployeeOutliers].setData(this.outlierSeriesData, true);

    // Tertile: salary range + data points
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
      this.chartInstance.series[JobRangeModelChartSeries.SalaryRangeTertile].setData(this.salaryRangeSeriesDataModel.Tertile, false);
      this.chartInstance.series[JobRangeModelChartSeries.RangeTertileFirst].setData(this.dataPointSeriesDataModel.TertileFirst, false);
      this.chartInstance.series[JobRangeModelChartSeries.RangeTertileSecond].setData(this.dataPointSeriesDataModel.TertileSecond, false);
    }

    // Quartile: salary range + data points
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
      this.chartInstance.series[JobRangeModelChartSeries.SalaryRangeQuartile].setData(this.salaryRangeSeriesDataModel.Quartile, false);
      this.chartInstance.series[JobRangeModelChartSeries.RangeQuartileFirst].setData(this.dataPointSeriesDataModel.QuartileFirst, false);
      this.chartInstance.series[JobRangeModelChartSeries.RangeQuartileSecond].setData(this.dataPointSeriesDataModel.QuartileSecond, false);
    }

    // Quintile: salary range + data points
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
      this.chartInstance.series[JobRangeModelChartSeries.SalaryRangeQuintile].setData(this.salaryRangeSeriesDataModel.Quintile, false);
      this.chartInstance.series[JobRangeModelChartSeries.RangeQuintileFirst].setData(this.dataPointSeriesDataModel.QuintileFirst, false);
      this.chartInstance.series[JobRangeModelChartSeries.RangeQuintileSecond].setData(this.dataPointSeriesDataModel.QuintileSecond, false);
      this.chartInstance.series[JobRangeModelChartSeries.RangeQuintileThird].setData(this.dataPointSeriesDataModel.QuintileThird, false);
      this.chartInstance.series[JobRangeModelChartSeries.RangeQuintileFourth].setData(this.dataPointSeriesDataModel.QuintileFourth, false);
    }

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
