import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { RangeGroupMetadata } from 'libs/models/structures';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { SettingsService } from 'libs/state/app-context/services';
import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';

import * as fromSharedStructuresReducer from '../../../../shared/reducers';
import * as fromGradeBasedSharedReducer from '../../../shared/reducers';
import * as fromSharedStructuresActions from '../../../../shared/actions/shared.actions';
import * as fromSwitchRegressionFlagsActions from '../../../shared/actions/switch-regression-flags-modal.actions';
import { StructuresHighchartsService, StructuresPagesService } from '../../../../shared/services';
import { GradeRangeModelChartService, GradeRangeVerticalModelChartSeries } from '../../data';
import { SalaryRangeSeries, DataPointSeries } from '../../../../shared/models';
import { RangeDistributionDataPointTypeIds } from '../../../../shared/constants/range-distribution-data-point-type-ids';
import { GradePoint } from '../../models';

@Component({
  selector: 'pf-grade-based-vertical-range-chart',
  templateUrl: './grade-based-vertical-range-chart.component.html',
  styleUrls: ['./grade-based-vertical-range-chart.component.scss']
})
export class GradeBasedVerticalRangeChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isRangeChartCollapsed = false;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  updateFlag: boolean;
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  chartMin: number;
  chartMax: number;
  salaryRangeSeriesDataModel: SalaryRangeSeries;
  dataPointSeriesDataModel: DataPointSeries;
  averageSeriesData: any;
  regressionSeriesData: any;
  excludedJobsSeriesData: any;
  outlierSeriesData: any;
  mrpSeriesData: any;
  parsedJobsData: any;
  exchangeSeriesData: any;
  gradeCategories: any;
  chartLocale: string; // en-US
  chartInstance: Highcharts.Chart;
  dataSubscription: Subscription;
  metadataSubscription: Subscription;
  gradeRangeDetailsSubscription: Subscription;
  pageViewId: string;
  pageViewIdSubscription: Subscription;
  gradeRangeData: GridDataResult;
  selectedFields: any[];
  currency: string;
  controlPointDisplay: string;
  rate: string;
  isCurrent: boolean;
  hasCurrentStructure: boolean;
  metaData: RangeGroupMetadata;
  rangeDistributionTypeId: number;
  filterPanelSub: Subscription;
  gradeRangeDetails: any;
  rangeGroupId: number;
  openAddJobsSubscription: Subscription;

  constructor(
    public store: Store<any>,
    private settingsService: SettingsService,
    private structuresPagesService: StructuresPagesService,
    private route: ActivatedRoute
  ) {
    this.rangeGroupId = this.route.snapshot.params.id;
    this.metadataSubscription = this.store.select(fromSharedStructuresReducer.getMetadata).subscribe(md => {
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
          GradeRangeModelChartService.getVerticalRangeOptions(
            this.chartLocale,
            this.currency, this.controlPointDisplay,
            this.rate, this.rangeDistributionTypeId);
      }
    });

    this.gradeRangeDetailsSubscription = this.store.select(fromSharedStructuresReducer.getGradeRangeDetails).subscribe(details => {
      this.gradeRangeDetails = details;
      if (this.gradeRangeData && this.rate && this.currency && this.gradeRangeDetails.obj) {
        this.processChartData();
      }
    });

    this.pageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.pageViewId = pv);
    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.pageViewId).subscribe(data => {
      if (data && this.rate && this.currency && this.gradeRangeDetails.obj) {
        this.gradeRangeData = data;
        this.processChartData();
      }
    });

    this.openAddJobsSubscription = this.store.select(fromGradeBasedSharedReducer.getOpenAddJobs).subscribe(open => {
      // if we're about to open the add jobs modal for the first time, clear out the data so that the charts fully fill in
      if (open) {
        this.gradeRangeData = null;
        this.gradeRangeDetails = null;
      }
    });
  }

  rangeChartCallback(chart: Highcharts.Chart = null) {
    // set the instance
    if (chart) {
      this.chartInstance = chart;
    }
  }


  private determineChartMin(currentRow, xCoordinate) {
    // if we find average or avg outlier data AND its lower than CompanyStructures_Ranges_Min, use that value to check for new min.
    // otherwise just use CompanyStructures_Ranges_Min
    // also make sure the comparison value is at least zero, aka not NULL. This is to prevent negative y-axis values
    let comparisonValue = StructuresHighchartsService.getChartMin(currentRow, this.rangeDistributionTypeId);

    // first check the averageminoutlier
    if (!!currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMinOutlier &&
      currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMinOutlier < comparisonValue) {
      comparisonValue = currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMinOutlier;
    }

    // also check against the computed regression value
    if (!!this.regressionSeriesData && this.regressionSeriesData.length > 0) {
      const currentRegressionValue = this.regressionSeriesData[xCoordinate];
      if (!!currentRegressionValue && currentRegressionValue.y < comparisonValue) {
        comparisonValue = currentRegressionValue.y;
      }
    }

    if (this.chartMin === undefined || comparisonValue < this.chartMin) {
      this.chartMin = comparisonValue;
    }
  }

  private determineChartMax(currentRow, xCoordinate) {
    // if we find average or avg outlier data AND its higher than CompanyStructures_Ranges_Max, use that value to check for new max.
    // otherwise just use CompanyStructures_Ranges_Max
    let comparisonValue = StructuresHighchartsService.getChartMax(currentRow, this.rangeDistributionTypeId);

    // first check the averagemaxoutlier
    if (currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMaxOutlier &&
      currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMaxOutlier > comparisonValue) {
      comparisonValue = currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMaxOutlier;
    }

    // also check against the computed regression value
    if (!!this.regressionSeriesData && this.regressionSeriesData.length > 0) {
      const currentRegressionValue = this.regressionSeriesData[xCoordinate];
      if (!!currentRegressionValue && currentRegressionValue.y > comparisonValue) {
        comparisonValue = currentRegressionValue.y;
      }
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
    this.salaryRangeSeriesDataModel.Quartile.First.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Min, currentRow.CompanyStructures_Ranges_Quartile_First));

    this.salaryRangeSeriesDataModel.Quartile.Second.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Quartile_First, currentRow.CompanyStructures_Ranges_Mid));

    this.salaryRangeSeriesDataModel.Quartile.Third.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Mid, currentRow.CompanyStructures_Ranges_Quartile_Second));

    this.salaryRangeSeriesDataModel.Quartile.Fourth.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Quartile_Second, currentRow.CompanyStructures_Ranges_Max));
  }

  private addSalaryRangeQuintile(xCoordinate, currentRow) {
    this.salaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Quintile_First, currentRow.CompanyStructures_Ranges_Quintile_Second));

    this.salaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Quintile_Third, currentRow.CompanyStructures_Ranges_Quintile_Fourth));
  }

  private addMidPoint(xCoordinate, currentRow) {
    this.dataPointSeriesDataModel.Mid.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.Mid, currentRow, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );
  }

  private addJobs(xCoordinate, currentRow) {
    // find the appropriate records in the parsed jobs information
    const matchingJobs = this.parsedJobsData.filter(j => j.gradeId === currentRow.CompanyStructures_Ranges_CompanyStructuresGrades_ID);

    for (let i = 0; i < matchingJobs.length; i++) {
      if (matchingJobs[i].includeInRegression) {
        this.dataPointSeriesDataModel.Job.push(
          StructuresHighchartsService.getJobDataPoint(xCoordinate, matchingJobs[i], this.hasCurrentStructure, this.chartLocale, this.metaData)
        );
      } else {
        this.excludedJobsSeriesData.push(
          StructuresHighchartsService.getJobDataPoint(xCoordinate, matchingJobs[i], this.hasCurrentStructure, this.chartLocale, this.metaData)
        );
      }
    }
  }

  private addRegression(xCoordinate, currentRow, slope, intercept) {
    this.regressionSeriesData.push(StructuresHighchartsService.getRegressionDataPoint(xCoordinate, currentRow, slope, intercept, this.metaData.Rate));
  }


  private addTertilePoint(xCoordinate, currentRow) {
    this.dataPointSeriesDataModel.TertileFirst.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.TertileFirst, currentRow, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.TertileSecond.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.TertileSecond, currentRow, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );
  }

  private addQuartilePoint(xCoordinate, currentRow) {
    this.dataPointSeriesDataModel.QuartileFirst.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.QuartileFirst, currentRow, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuartileSecond.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.QuartileSecond, currentRow, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );
  }

  private addQuintilePoint(xCoordinate, currentRow) {
    this.dataPointSeriesDataModel.QuintileFirst.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.QuintileFirst, currentRow, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuintileSecond.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.QuintileSecond, currentRow, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuintileThird.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.QuintileThird, currentRow, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuintileFourth.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.QuintileFourth, currentRow, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );
  }

  private processAndAddOutliers(xCoordinate, currentRow) {
    // Min Outlier
    this.outlierSeriesData.push(
      {
        x: xCoordinate,
        y: currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMinOutlier,
        count: currentRow.CompanyStructures_RangeGroup_GradeBased_Range_CountEEMinOutlier,
        countString: this.formatOutlierCount(true, currentRow.CompanyStructures_RangeGroup_GradeBased_Range_CountEEMinOutlier),
        avgSalary: this.formatSalary(currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMinOutlier),
        delta: this.formatDelta(true, currentRow.CompanyStructures_RangeGroup_GradeBased_Range_DeltaBetweenMinOutliersAndMRP)
      });

    // Max Outlier
    this.outlierSeriesData.push(
      {
        x: xCoordinate,
        y: currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMaxOutlier,
        count: currentRow.CompanyStructures_RangeGroup_GradeBased_Range_CountEEMaxOutlier,
        countString: this.formatOutlierCount(false, currentRow.CompanyStructures_RangeGroup_GradeBased_Range_CountEEMaxOutlier),
        avgSalary: this.formatSalary(currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMaxOutlier),
        delta: this.formatDelta(false, currentRow.CompanyStructures_RangeGroup_GradeBased_Range_DeltaBetweenMaxOutliersAndMRP)
      });
  }

  private formatSalary(salary: number) {
    return `Average ${this.controlPointDisplay}: ${StructuresHighchartsService.formatCurrency(salary, this.chartLocale, this.currency, this.rate, true)}`;
  }

  private formatOutlierCount(min: boolean, count: number) {
    return `${count} ${count > 1 ? 'employees' : 'employee'} ${min ? 'below min' : 'above max'}`;
  }

  private formatDelta(min: boolean, delta: number) {
    return StructuresHighchartsService.formatCurrency(delta, this.chartLocale, this.currency, this.rate, true)
      + (min ? ' to bring all to minimum' : ' above the maximum');
  }

  private clearData(): void {
    if (this.gradeRangeData) {
      this.gradeRangeData = {...this.gradeRangeData, data: []};
    }
  }


  private processChartData() {

    this.salaryRangeSeriesDataModel = {
      MinMidMax: [],
      Quartile: {
        First: [],
        Second: [],
        Third: [],
        Fourth: []
      },
      Quintile: [],
      Tertile: []
    };

    this.dataPointSeriesDataModel = {
      Mid: [],
      Job: [],
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
    this.mrpSeriesData = [];
    this.exchangeSeriesData = [];
    this.gradeCategories = [];
    this.chartMin = undefined;
    this.chartMax = undefined;
    this.parsedJobsData = [];
    this.regressionSeriesData = [];
    this.excludedJobsSeriesData = [];

    // parse the raw jobs data
    this.parseJobsData(this.gradeRangeDetails.obj[0].JobValues);

    // set slope and intercept from the details
    const slope = this.gradeRangeDetails.obj[0]?.Slope;
    const intercept = this.gradeRangeDetails.obj[0]?.Intercept;
    const rSquared = this.gradeRangeDetails.obj[0]?.Rsquared === null ? '--' : this.gradeRangeDetails.obj[0]?.Rsquared;

    // set initial min/max based on jobs data, since this is outside the main grid data
    this.determineInitialChartMinAndMax();

    for (let i = 0; i < this.gradeRangeData.data.length; i++) {
      const currentRow = this.gradeRangeData.data[i];
      this.hasCurrentStructure = currentRow.CompanyStructures_RangeGroup_CurrentStructureMidPoint === null;

      this.addJobs(i, currentRow);

      if (!!intercept && !!slope) {
        this.addRegression(i, currentRow, slope, intercept);
      }

      // check for new min
      this.determineChartMin(currentRow, i);

      // check for new max
      this.determineChartMax(currentRow, i);

      // always add to salary range group
      this.addSalaryRangeMinMidMax(i, currentRow);

      // always add to midPoint
      this.addMidPoint(i, currentRow);

      this.processAndAddOutliers(i, currentRow);

      // Tertile - Quartile - Quintile: salary range + data points
      if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
        this.addSalaryRangeTertile(i, currentRow);
        this.addTertilePoint(i, currentRow);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
        this.addSalaryRangeQuartile(i, currentRow);
        this.addQuartilePoint(i, currentRow);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
        this.addSalaryRangeQuintile(i, currentRow);
        this.addQuintilePoint(i, currentRow);
      }

      // add to category list
      this.gradeCategories.push(currentRow.CompanyStructures_Ranges_Grade_Name);


    }


    // set the min/max
    this.chartInstance.yAxis[0].setExtremes(this.chartMin, this.chartMax, false);

    this.chartInstance.xAxis[0].setTitle({text: '<b>R<sup>2</sup>:</b> ' + rSquared, useHTML: true});
    // set the series data (0 - salaryRange, 1 - midPoint, 2 - avg salary, 3 - outliers)
    this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeMinMidMax].setData(this.salaryRangeSeriesDataModel.MinMidMax, false);

    // we need this hidden salary range => will prevent from messing up when we hide salary range from the legend
    this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeMinMidMaxHidden].setData(this.salaryRangeSeriesDataModel.MinMidMax, false);

    this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeMid].setData(this.dataPointSeriesDataModel.Mid, true);
    this.chartInstance.series[GradeRangeVerticalModelChartSeries.EmployeeOutliers].setData(this.outlierSeriesData, true);
    this.chartInstance.series[GradeRangeVerticalModelChartSeries.Jobs].setData(this.dataPointSeriesDataModel.Job, false);
    this.chartInstance.series[GradeRangeVerticalModelChartSeries.Regression].setData(this.regressionSeriesData, false);
    this.chartInstance.series[GradeRangeVerticalModelChartSeries.JobsExcludedFromRegression].setData(this.excludedJobsSeriesData, false);


    // Tertile - Quartile - Quintile: salary range + data points
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeTertile].setData(this.salaryRangeSeriesDataModel.Tertile, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeTertileFirst].setData(this.dataPointSeriesDataModel.TertileFirst, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeTertileSecond].setData(this.dataPointSeriesDataModel.TertileSecond, true);
    } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFirst].setData(this.salaryRangeSeriesDataModel.Quartile.First, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileSecond].setData(this.salaryRangeSeriesDataModel.Quartile.Second, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileThird].setData(this.salaryRangeSeriesDataModel.Quartile.Third, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFourth].setData(this.salaryRangeSeriesDataModel.Quartile.Fourth, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeQuartileFirst].setData(this.dataPointSeriesDataModel.QuartileFirst, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeQuartileSecond].setData(this.dataPointSeriesDataModel.QuartileSecond, true);
    } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeQuintile].setData(this.salaryRangeSeriesDataModel.Quintile, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeQuintileFirst].setData(this.dataPointSeriesDataModel.QuintileFirst, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeQuintileSecond].setData(this.dataPointSeriesDataModel.QuintileSecond, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeQuintileThird].setData(this.dataPointSeriesDataModel.QuintileThird, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeQuintileFourth].setData(this.dataPointSeriesDataModel.QuintileFourth, true);
    }

    this.chartInstance.xAxis[0].setCategories(this.gradeCategories, true);

    // set click events for jobs
    const jobsOptions = this.chartInstance.series[GradeRangeVerticalModelChartSeries.Jobs].options;
    const self = this;
    jobsOptions.point.events.click = function(event) {
      // Store the point object into a variable
      const point = this as any;
      self.handleJobPointClicked(point);
    };
    this.chartInstance.series[GradeRangeVerticalModelChartSeries.Jobs].update(jobsOptions);
    // set click event for excluded jobs
    const excludedJobsOptions = this.chartInstance.series[GradeRangeVerticalModelChartSeries.JobsExcludedFromRegression].options;
    excludedJobsOptions.point.events.click = function(event) {
      // Store the point object into a variable
      const point = this as any;
      self.handleJobPointClicked(point);
    };
    this.chartInstance.series[GradeRangeVerticalModelChartSeries.JobsExcludedFromRegression].update(excludedJobsOptions);

    this.chartInstance.setSize(null, 500);
  }

  private handleJobPointClicked(point) {
    let gradePoints: GradePoint[] = [];
    // first grab the point that they clicked on
    const selectedPoint = { CompanyJobsStructuresId: point.companyJobsStructuresId,
      IncludeInRegression: point.includeInRegression,
      JobTitle: point.jobTitle,
      Mrp: point.dataPoint,
      Selected: true};
    gradePoints.push(selectedPoint);
    // add in any other applicable points (same IncludeInRegression and X value)
    const additionalPoints = point.series.data.filter(p => p.x === point.x
      && p.includeInRegression === point.includeInRegression
      && p.companyJobsStructuresId !== point.companyJobsStructuresId);
    gradePoints = gradePoints.concat(additionalPoints.map((p: any): GradePoint => {
      return { CompanyJobsStructuresId: p.companyJobsStructuresId,
        IncludeInRegression: p.includeInRegression,
        JobTitle: p.jobTitle,
        Mrp: p.dataPoint,
        Selected: false};
    }));

    this.store.dispatch(new fromSwitchRegressionFlagsActions.SetGradePoints(gradePoints));
    this.store.dispatch(new fromSwitchRegressionFlagsActions.OpenModal());
  }

  private parseJobsData(jobs) {
    // information comes in like this: jobTitle-DispSeq-MRP-CompanyJobsStructures_ID-IncludeInRegression-GradesId
    this.parsedJobsData = [];
    const rawJobsData = jobs.split('||');
    // we're starting at index 1, because the old method for getting data always returns 0++0++0++0++0++0 as the first job
    for (let i = 1; i < rawJobsData.length; i++) {
      const rawJobData = rawJobsData[i].split('++');
      this.parsedJobsData.push({
        jobTitle: rawJobData[0],
        mrp: parseInt(rawJobData[2], 10),
        companyJobsStructuresId: rawJobData[3],
        includeInRegression: !!parseInt(rawJobData[4], 10) ? true : false,
        gradeId: parseInt(rawJobData[5], 10)
      });
    }
  }

  private determineInitialChartMinAndMax() {
    if (!!this.parsedJobsData && this.parsedJobsData.length >= 1) {
      // set both values to the first MRP
      const firstMrp = this.parsedJobsData[0].mrp;
      this.chartMin = firstMrp;
      this.chartMax = firstMrp;
      for (let i = 0; i < this.parsedJobsData.length; i++) {
        const currentMrp = this.parsedJobsData[i].mrp;
        if (currentMrp > this.chartMax) {
          this.chartMax = currentMrp;
        }
        if (currentMrp < this.chartMin) {
          this.chartMin = currentMrp;
        }
      }
    }
  }

  ngOnInit(): void {
    StructuresHighchartsService.initializeHighcharts();
    this.store.dispatch(new fromSharedStructuresActions.GetGradeRangeDetails(this.rangeGroupId));
    this.filterPanelSub = this.store.select(fromPfGridReducer.getFilterPanelOpen, this.pageViewId).subscribe(filterPanelOpen => {
      setTimeout(() => {
        this.chartInstance.reflow();
      }, 0);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && !!changes.isRangeChartCollapsed && changes.isRangeChartCollapsed.currentValue === false) {
      setTimeout(() => {
        this.chartInstance.reflow();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
    this.pageViewIdSubscription.unsubscribe();
    this.filterPanelSub.unsubscribe();
    this.gradeRangeDetailsSubscription.unsubscribe();
    this.openAddJobsSubscription.unsubscribe();
  }
}
