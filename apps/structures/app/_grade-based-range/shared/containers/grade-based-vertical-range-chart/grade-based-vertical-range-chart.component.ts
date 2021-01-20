import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ActivatedRoute } from '@angular/router';

import { RangeGroupMetadata } from 'libs/models/structures';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { SettingsService } from 'libs/state/app-context/services';

import * as fromSharedStructuresReducer from '../../../../shared/reducers';
import * as fromGradeBasedSharedReducer from '../../../shared/reducers';
import * as fromGradeBasedSharedActions from '../../../shared/actions/shared.actions';
import { StructuresHighchartsService, StructuresPagesService } from '../../../../shared/services';
import { GradeRangeModelChartService, GradeRangeVerticalModelChartSeries } from '../../data';
import { RangeDistributionTypeIds } from '../../../../shared/constants/range-distribution-type-ids';
import { SalaryRangeSeries, DataPointSeries } from '../../../../shared/models';
import { RangeDistributionDataPointTypeIds } from '../../../../shared/constants/range-distribution-data-point-type-ids';

@Component({
  selector: 'pf-grade-based-vertical-range-chart',
  templateUrl: './grade-based-vertical-range-chart.component.html',
  styleUrls: ['./grade-based-vertical-range-chart.component.scss']
})
export class GradeBasedVerticalRangeChartComponent implements OnInit, OnDestroy {
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
  initialY: number;
  gradeRangeDetails: any;
  rangeGroupId: number;

  constructor(
    public store: Store<any>,
    public pfGridStore: Store<fromPfGridReducer.State>,
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

    this.gradeRangeDetailsSubscription = this.store.select(fromGradeBasedSharedReducer.getGradeRangeDetails).subscribe(details => {
      this.gradeRangeDetails = details;
    });

    this.pageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.pageViewId = pv);
    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.pageViewId).subscribe(data => {
      if (data && this.rate && this.currency && this.gradeRangeDetails.obj) {
        this.gradeRangeData = data;
        this.processChartData();
      }
    });
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
    let comparisonValue = StructuresHighchartsService.getChartMin(currentRow, this.rangeDistributionTypeId);

    // first check the averageminoutlier
    if (!!currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMinOutlier &&
      currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMinOutlier < comparisonValue) {
      comparisonValue = currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMinOutlier;
    }


    if (this.chartMin === undefined || comparisonValue < this.chartMin) {
      this.chartMin = comparisonValue;
    }
  }

  private determineChartMax(currentRow) {
    // if we find average or avg outlier data AND its higher than CompanyStructures_Ranges_Max, use that value to check for new max.
    // otherwise just use CompanyStructures_Ranges_Max
    let comparisonValue = StructuresHighchartsService.getChartMax(currentRow, this.rangeDistributionTypeId);

    // first check the averagemaxoutlier
    if (currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMaxOutlier &&
      currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMaxOutlier > comparisonValue) {
      comparisonValue = currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMaxOutlier;
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
      this.dataPointSeriesDataModel.Job.push(
        StructuresHighchartsService.getJobDataPoint(xCoordinate, matchingJobs[i])
      );
    }
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
        count: currentRow.CompanyStructures_RangeGroup_GradeBased_Range_CountEEMinOutlier
        // this part relates to tooltips
        // countString: this.formatOutlierCount(true, currentRow.CompanyStructures_RangeGroup_CountEEMinOutlier),
        // avgSalary: this.formatSalary(currentRow.CompanyStructures_RangeGroup_AverageEEMinOutlier),
        // delta: this.formatDelta(true, currentRow.CompanyStructures_RangeGroup_SumOfDeltaBetweenMinOutliersAndMRP)
      });

    // Max Outlier
    this.outlierSeriesData.push(
      {
        x: xCoordinate,
        y: currentRow.CompanyStructures_RangeGroup_GradeBased_Range_AverageEEMaxOutlier,
        count: currentRow.CompanyStructures_RangeGroup_GradeBased_Range_CountEEMaxOutlier
        // this part relates to tooltips
        // countString: this.formatOutlierCount(false, currentRow.CompanyStructures_RangeGroup_CountEEMaxOutlier),
        // avgSalary: this.formatSalary(currentRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier),
        // delta: this.formatDelta(false, currentRow.CompanyStructures_RangeGroup_SumOfDeltaBetweenMaxOutliersAndMRP)
      });
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

    // parse the raw jobs data
    this.parseJobsData(this.gradeRangeDetails.obj[0].JobValues);

    // set initial min/max based on jobs data, since this is outside the main grid data
    this.determineInitialChartMinAndMax();

    for (let i = 0; i < this.gradeRangeData.data.length; i++) {
      const currentRow = this.gradeRangeData.data[i];
      this.hasCurrentStructure = currentRow.CompanyStructures_RangeGroup_CurrentStructureMidPoint === null;

      this.addJobs(i, currentRow);

      // check for new min
      this.determineChartMin(currentRow);

      // check for new max
      this.determineChartMax(currentRow);

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

    // set the series data (0 - salaryRange, 1 - midPoint, 2 - avg salary, 3 - outliers)
    this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeMinMidMax].setData(this.salaryRangeSeriesDataModel.MinMidMax, false);

    // we need this hidden salary range => will prevent from messing up when we hide salary range from the legend
    this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeMinMidMaxHidden].setData(this.salaryRangeSeriesDataModel.MinMidMax, false);

    this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeMid].setData(this.dataPointSeriesDataModel.Mid, false);
    this.chartInstance.series[GradeRangeVerticalModelChartSeries.EmployeeOutliers].setData(this.outlierSeriesData, true);
    this.chartInstance.series[GradeRangeVerticalModelChartSeries.Jobs].setData(this.dataPointSeriesDataModel.Job, false);


    // Tertile - Quartile - Quintile: salary range + data points
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeTertile].setData(this.salaryRangeSeriesDataModel.Tertile, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeTertileFirst].setData(this.dataPointSeriesDataModel.TertileFirst, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeTertileSecond].setData(this.dataPointSeriesDataModel.TertileSecond, false);
    } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFirst].setData(this.salaryRangeSeriesDataModel.Quartile.First, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileSecond].setData(this.salaryRangeSeriesDataModel.Quartile.Second, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileThird].setData(this.salaryRangeSeriesDataModel.Quartile.Third, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeQuartileFourth].setData(this.salaryRangeSeriesDataModel.Quartile.Fourth, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeQuartileFirst].setData(this.dataPointSeriesDataModel.QuartileFirst, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeQuartileSecond].setData(this.dataPointSeriesDataModel.QuartileSecond, false);
    } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.SalaryRangeQuintile].setData(this.salaryRangeSeriesDataModel.Quintile, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeQuintileFirst].setData(this.dataPointSeriesDataModel.QuintileFirst, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeQuintileSecond].setData(this.dataPointSeriesDataModel.QuintileSecond, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeQuintileThird].setData(this.dataPointSeriesDataModel.QuintileThird, false);
      this.chartInstance.series[GradeRangeVerticalModelChartSeries.RangeQuintileFourth].setData(this.dataPointSeriesDataModel.QuintileFourth, false);
    }

    this.chartInstance.xAxis[0].setCategories(this.gradeCategories, true);


    this.chartInstance.setSize(null, 500);
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
    this.filterPanelSub = this.store.select(fromPfGridReducer.getFilterPanelOpen, this.pageViewId).subscribe(filterPanelOpen => {
      if (filterPanelOpen === false) {
        setTimeout(() => {
          this.chartInstance.reflow();
        }, 0);
      }
    });
    this.store.dispatch(new fromGradeBasedSharedActions.GetGradeRangeDetails(this.rangeGroupId));
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
    this.pageViewIdSubscription.unsubscribe();
    this.filterPanelSub.unsubscribe();
    this.gradeRangeDetailsSubscription.unsubscribe();
  }
}