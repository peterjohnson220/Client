import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { getUserLocale } from 'get-user-locale';
import { Subscription } from 'rxjs';
import { GridDataResult, ContentScrollEvent } from '@progress/kendo-angular-grid';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import { RangeGroupMetadata } from 'libs/models/structures';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import { StructuresHighchartsService, StructuresPagesService } from '../../../shared/services';
import {
  CompareJobRangeModelChartService,
  CompareMinMidMaxJobRangeModelChartSeries,
  CompareQuartileJobRangeModelChartSeries,
  CompareQuintileJobRangeModelChartSeries,
  CompareTertileJobRangeModelChartSeries,
} from '../../data';
import { GraphHelper } from '../../../shared/helpers/graph.helper';
import { RangeDistributionDataPointTypeIds } from '../../../shared/constants/range-distribution-data-point-type-ids';
import { RangeDistributionTypeIds } from '../../../shared/constants/range-distribution-type-ids';
import { SalaryRangeSeries } from '../../../shared/models/salary-range-series.model';
import { DataPointSeries } from '../../../shared/models/data-point-series.model';

@Component({
  selector: 'pf-compare-job-based-range-chart',
  templateUrl: './compare-job-based-range-chart.component.html',
  styleUrls: ['./compare-job-based-range-chart.component.scss']
})

export class CompareJobBasedRangeChartComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  updateFlag: boolean;
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  chartMin: number;
  chartMax: number;
  salaryRangeSeriesDataModel: SalaryRangeSeries;
  compareSalaryRangeSeriesDataModel: SalaryRangeSeries;
  dataPointSeriesDataModel: DataPointSeries;
  compareDataPointSeriesDataModel: DataPointSeries;
  averageSeriesData: any;
  compareAverageSeriesData: any;
  outlierSeriesData: any;
  compareOutlierSeriesData: any;
  mrpSeriesData: any;
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
  compareHasCurrentStructure: boolean;
  metaData: RangeGroupMetadata;
  rangeDistributionTypeId: number;
  filterPanelSub: Subscription;
  initialY: number;
  gridScrolledSub: Subscription;
  compareDataSub: Subscription;
  compareData: any;
  categories: any;
  seriesIndexList: any;
  currentRangeGroupSub: Subscription;
  currentRangeGroupName: string;
  xCoordinateOffest = .25;
  nullDataObject: any;
  singleDataRowFlag: boolean;
  groupFieldSelected = false;
  selectedFields: any[];
  selectedFieldsSubscription: Subscription;

  constructor(
    public store: Store<any>,
    public pfGridStore: Store<fromPfGridReducer.State>,
    public shareStore: Store<fromSharedJobBasedRangeReducer.State>,
    private structuresPagesService: StructuresPagesService
  ) {
    this.currentRangeGroupSub = this.store.select(fromSharedJobBasedRangeReducer.getCurrentRangeGroup).subscribe( rg => {
      this.currentRangeGroupName = rg.obj.RangeGroupName;
    });

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
        if (this.rangeDistributionTypeId === RangeDistributionTypeIds.MinMidMax) {
          this.seriesIndexList = CompareMinMidMaxJobRangeModelChartSeries;
          this.chartOptions = CompareJobRangeModelChartService.getMinMidMaxChartOptions(this.chartLocale, this.currency, this.controlPointDisplay,
            this.rate, this.rangeDistributionTypeId, this.currentRangeGroupName);
        } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile ) {
          this.seriesIndexList = CompareTertileJobRangeModelChartSeries;
          this.chartOptions = CompareJobRangeModelChartService.getTertileChartOptions(this.chartLocale, this.currency, this.controlPointDisplay,
            this.rate, this.rangeDistributionTypeId, this.currentRangeGroupName);
        } else if ( this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
          this.seriesIndexList = CompareQuartileJobRangeModelChartSeries;
          this.chartOptions = CompareJobRangeModelChartService.getQuartileChartOptions(this.chartLocale, this.currency, this.controlPointDisplay,
            this.rate, this.rangeDistributionTypeId, this.currentRangeGroupName);
        } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
          this.seriesIndexList = CompareQuintileJobRangeModelChartSeries;
          this.chartOptions = CompareJobRangeModelChartService.getQuintileChartOptions(this.chartLocale, this.currency, this.controlPointDisplay,
            this.rate, this.rangeDistributionTypeId, this.currentRangeGroupName);
        }
      }
    });

    this.pageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.pageViewId = pv);
    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.pageViewId).subscribe(data => {
      if (data && this.rate && this.currency) {
        this.jobRangeData = data;

        this.pfGridStore.select(fromPfGridReducer.getGridScrolledContent, this.pageViewId).pipe(take(1)).subscribe(scrolledContent => {
          this.refreshChartLegendPosition(scrolledContent);
        });
      }
    });

    this.compareDataSub = this.shareStore.select(fromSharedJobBasedRangeReducer.getData).subscribe( data => {
      if (data.obj && this.rate && this.currency) {
        this.compareData = data.obj;
        this.processChartData();
      }
    });

    this.selectedFieldsSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.selectedFields = fields;
        const anyGroupField = this.selectedFields.find(f => f.Group && f.IsSelected);
        this.groupFieldSelected = !!anyGroupField;
      }
    });

    this.gridScrolledSub = this.pfGridStore.select(fromPfGridReducer.getGridScrolledContent, this.pageViewId).subscribe(scrolledContent => {
      this.refreshChartLegendPosition(scrolledContent);
    });

    this.nullDataObject = {
      CompanyJobs_Job_Code: null,
      CompanyJobs_Job_Family: null,
      CompanyJobs_Job_Level: null,
      CompanyJobs_Job_Title: null,
      CompanyStructures_RangeGroup_AverageComparatio: null,
      CompanyStructures_RangeGroup_AverageEEMRP: null,
      CompanyStructures_RangeGroup_AverageEEMaxOutlier: null,
      CompanyStructures_RangeGroup_AverageEEMinOutlier: null,
      CompanyStructures_RangeGroup_AveragePositionInRange: null,
      CompanyStructures_RangeGroup_AvgBaseSalary: null,
      CompanyStructures_RangeGroup_AvgBonus: null,
      CompanyStructures_RangeGroup_CompanyStructuresRangeGroup_ID: null,
      CompanyStructures_RangeGroup_CountEEMaxOutlier: null,
      CompanyStructures_RangeGroup_CountEEMinOutlier: null,
      CompanyStructures_RangeGroup_CurrentRangeSpreadMax: null,
      CompanyStructures_RangeGroup_CurrentRangeSpreadMin: null,
      CompanyStructures_RangeGroup_CurrentStructureMidPoint: null,
      CompanyStructures_RangeGroup_MarketReferencePointValue: null,
      CompanyStructures_RangeGroup_MrpPercentile: null,
      CompanyStructures_RangeGroup_NumEmployees: null,
      CompanyStructures_RangeGroup_SumOfDeltaBetweenMaxOutliersAndMRP: null,
      CompanyStructures_RangeGroup_SumOfDeltaBetweenMinOutliersAndMRP: null,
      CompanyStructures_RangeGroup_TotalPayroll: null,
      CompanyStructures_RangeGroup_TotalPayrollUnderMin: null,
      CompanyStructures_Ranges_CompanyStructuresRanges_ID: null,
      CompanyStructures_Ranges_Max: null,
      CompanyStructures_Ranges_Mid: null,
      CompanyStructures_Ranges_Min: null
    };

  }

  rangeChartCallback(chart: Highcharts.Chart = null) {
    // set the instance
    if (chart) {
      this.chartInstance = chart;
    }
  }

  private clearData(): void {
    if (this.jobRangeData) {
      this.jobRangeData = {...this.jobRangeData, data: []};
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

    this.compareSalaryRangeSeriesDataModel = {
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
      TertileFirst: [],
      TertileSecond: [],
      QuartileFirst: [],
      QuartileSecond: [],
      QuintileFirst: [],
      QuintileSecond: [],
      QuintileThird: [],
      QuintileFourth: [],
    };

    this.compareDataPointSeriesDataModel = {
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

    this.categories = [];
    this.averageSeriesData = [];
    this.compareAverageSeriesData = [];
    this.outlierSeriesData = [];
    this.compareOutlierSeriesData = [];
    this.mrpSeriesData = [];
    this.chartMin = undefined;
    this.chartMax = undefined;
    let dataCount = this.jobRangeData.data.length;

    if (dataCount === 1) {
      this.singleDataRowFlag = true;
      dataCount = dataCount + 1;
    } else {
      this.singleDataRowFlag = false;
    }

    for (let i = 0; i < dataCount; i++) {
      let currentRow = this.nullDataObject;
      if (this.singleDataRowFlag && i === 0) {
        currentRow = this.jobRangeData.data[i];
      } else if (this.singleDataRowFlag && i === 1) {
        currentRow = this.nullDataObject;
      } else {
        currentRow = this.jobRangeData.data[i];
      }

      let compareRow = {};
      if (this.compareData) {
        compareRow = this.compareData.filter(x => x.CompanyJobs_Job_Code === currentRow.CompanyJobs_Job_Code)[0];
      }
      this.hasCurrentStructure = currentRow.CompanyStructures_RangeGroup_CurrentStructureMidPoint === null;
      this.compareHasCurrentStructure = false;

      // check for new min
      this.determineChartMin(currentRow);
      // check for new max
      this.determineChartMax(currentRow);
      // always add to salary range group
      this.addSalaryRangeMinMidMax(i, currentRow, compareRow);
      // always add to midPoint
      this.addMidPoint(i, currentRow, compareRow);

      if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
          this.addSalaryRangeTertile(i, currentRow, compareRow);
          this.addTertilePoint(i, currentRow, compareRow);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
          this.addSalaryRangeQuartile(i, currentRow, compareRow);
          this.addQuartilePoint(i, currentRow, compareRow);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
          this.addSalaryRangeQuintile(i, currentRow, compareRow);
          this.addQuintilePoint(i, currentRow, compareRow);
      }

      // add to average
      this.addAverage(i, currentRow, compareRow);

      // add any outliers
      this.processAndAddOutliers(i, currentRow, compareRow);
    }
    // set the min/max
    this.chartInstance.yAxis[0].setExtremes(this.chartMin, this.chartMax, false);

    // set the series data (0 - salaryRange, 1 - midPoint, 2 - avg salary, 3 - outliers)
    this.chartInstance.series[this.seriesIndexList.SalaryRangeMinMidMax].setData(this.salaryRangeSeriesDataModel.MinMidMax, false);
    this.chartInstance.series[this.seriesIndexList.CompareSalaryRangeMinMidMax].setData(this.compareSalaryRangeSeriesDataModel.MinMidMax, false);

    // if not showing mid min max salary range in legend
    if (this.rangeDistributionTypeId !== RangeDistributionTypeIds.MinMidMax) {
      this.chartInstance.series[this.seriesIndexList.SalaryRangeMinMidMaxHidden].setData(this.salaryRangeSeriesDataModel.MinMidMax, false);
      this.chartInstance.series[this.seriesIndexList.CompareSalaryRangeMinMidMaxHidden].setData(this.compareSalaryRangeSeriesDataModel.MinMidMax, false);
    }

    this.chartInstance.series[this.seriesIndexList.RangeMid].setData(this.dataPointSeriesDataModel.Mid, false);
    this.chartInstance.series[this.seriesIndexList.CompareRangeMid].setData(this.compareDataPointSeriesDataModel.Mid, false);

    this.chartInstance.series[this.seriesIndexList.Average].setData(this.averageSeriesData, false);
    this.chartInstance.series[this.seriesIndexList.CompareAverage].setData(this.compareAverageSeriesData, false);

    this.chartInstance.series[this.seriesIndexList.EmployeeOutliers].setData(this.outlierSeriesData, true);
    this.chartInstance.series[this.seriesIndexList.CompareEmployeeOutliers].setData(this.compareOutlierSeriesData, true);

    // Tertile - Quartile - Quintile: salary range + data points
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
      this.chartInstance.series[this.seriesIndexList.SalaryRangeTertile].setData(
          this.salaryRangeSeriesDataModel.Tertile, false);
        this.chartInstance.series[this.seriesIndexList.CompareSalaryRangeTertile].setData(
          this.compareSalaryRangeSeriesDataModel.Tertile, false);
        this.chartInstance.series[this.seriesIndexList.RangeTertileFirst].setData(
          this.dataPointSeriesDataModel.TertileFirst, false);
        this.chartInstance.series[this.seriesIndexList.CompareRangeTertileFirst].setData(
          this.compareDataPointSeriesDataModel.TertileFirst, false);
        this.chartInstance.series[this.seriesIndexList.RangeTertileSecond].setData(
          this.dataPointSeriesDataModel.TertileSecond, false);
        this.chartInstance.series[this.seriesIndexList.CompareRangeTertileSecond].setData(
          this.compareDataPointSeriesDataModel.TertileSecond, false);
    } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
        this.chartInstance.series[this.seriesIndexList.SalaryRangeQuartileFirst].setData(
          this.salaryRangeSeriesDataModel.Quartile.First, false);
        this.chartInstance.series[this.seriesIndexList.CompareSalaryRangeQuartileFirst].setData(
          this.compareSalaryRangeSeriesDataModel.Quartile.First, false);
        this.chartInstance.series[this.seriesIndexList.SalaryRangeQuartileSecond].setData(
          this.salaryRangeSeriesDataModel.Quartile.Second, false);
        this.chartInstance.series[this.seriesIndexList.CompareSalaryRangeQuartileSecond].setData(
          this.compareSalaryRangeSeriesDataModel.Quartile.Second, false);
        this.chartInstance.series[this.seriesIndexList.SalaryRangeQuartileThird].setData(
          this.salaryRangeSeriesDataModel.Quartile.Third, false);
        this.chartInstance.series[this.seriesIndexList.CompareSalaryRangeQuartileThird].setData(
          this.compareSalaryRangeSeriesDataModel.Quartile.Third, false);
        this.chartInstance.series[this.seriesIndexList.SalaryRangeQuartileFourth].setData(
          this.salaryRangeSeriesDataModel.Quartile.Fourth, false);
        this.chartInstance.series[this.seriesIndexList.CompareSalaryRangeQuartileFourth].setData(
          this.compareSalaryRangeSeriesDataModel.Quartile.Fourth, false);
        this.chartInstance.series[this.seriesIndexList.RangeQuartileFirst].setData(
          this.dataPointSeriesDataModel.QuartileFirst, false);
        this.chartInstance.series[this.seriesIndexList.CompareRangeQuartileFirst].setData(
          this.compareDataPointSeriesDataModel.QuartileFirst, false);
        this.chartInstance.series[this.seriesIndexList.RangeQuartileSecond].setData(
          this.dataPointSeriesDataModel.QuartileSecond, false);
        this.chartInstance.series[this.seriesIndexList.CompareRangeQuartileSecond].setData(
          this.compareDataPointSeriesDataModel.QuartileSecond, false);
    } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
        this.chartInstance.series[this.seriesIndexList.SalaryRangeQuintile].setData(
          this.salaryRangeSeriesDataModel.Quintile, false);
        this.chartInstance.series[this.seriesIndexList.CompareSalaryRangeQuintile].setData(
          this.compareSalaryRangeSeriesDataModel.Quintile, false);
        this.chartInstance.series[this.seriesIndexList.RangeQuintileFirst].setData(
          this.dataPointSeriesDataModel.QuintileFirst, false);
        this.chartInstance.series[this.seriesIndexList.CompareRangeQuintileFirst].setData(
          this.compareDataPointSeriesDataModel.QuintileFirst, false);
        this.chartInstance.series[this.seriesIndexList.RangeQuintileSecond].setData(
          this.dataPointSeriesDataModel.QuintileSecond, false);
        this.chartInstance.series[this.seriesIndexList.CompareRangeQuintileSecond].setData(
          this.compareDataPointSeriesDataModel.QuintileSecond, false);
        this.chartInstance.series[this.seriesIndexList.RangeQuintileThird].setData(
          this.dataPointSeriesDataModel.QuintileThird, false);
        this.chartInstance.series[this.seriesIndexList.CompareRangeQuintileThird].setData(
          this.compareDataPointSeriesDataModel.QuintileThird, false);
        this.chartInstance.series[this.seriesIndexList.RangeQuintileFourth].setData(
          this.dataPointSeriesDataModel.QuintileFourth, false);
        this.chartInstance.series[this.seriesIndexList.CompareRangeQuintileFourth].setData(
          this.compareDataPointSeriesDataModel.QuintileFourth, false);
    }

    // we need this hidden salary range => will prevent from messing up when we hide salary range from the legend
    this.chartInstance.setSize(null, GraphHelper.getCompareChartHeight(dataCount));
  }

  private determineChartMin(currentRow) {
    // if we find average or avg outlier data AND its lower than CompanyStructures_Ranges_Min, use that value to check for new min.
    // otherwise just use CompanyStructures_Ranges_Min
    // also make sure the comparison value is at least zero, aka not NULL. This is to prevent negative y-axis values
    let comparisonValue = StructuresHighchartsService.getChartMin(currentRow, this.rangeDistributionTypeId);

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
    // next check the MRP value
    if (!!currentRow.CompanyStructures_RangeGroup_MarketReferencePointValue &&
      currentRow.CompanyStructures_RangeGroup_MarketReferencePointValue < comparisonValue) {
      comparisonValue = currentRow.CompanyStructures_RangeGroup_MarketReferencePointValue;
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
    if (currentRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier &&
      currentRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier > comparisonValue) {
      comparisonValue = currentRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier;
    }
    // next check the averageEEMRP
    if (currentRow.CompanyStructures_RangeGroup_AverageEEMRP &&
      currentRow.CompanyStructures_RangeGroup_AverageEEMRP > comparisonValue) {
      comparisonValue = currentRow.CompanyStructures_RangeGroup_AverageEEMRP;
    }
    // next check the MRP value
    if (currentRow.CompanyStructures_RangeGroup_MarketReferencePointValue &&
      currentRow.CompanyStructures_RangeGroup_MarketReferencePointValue > comparisonValue) {
      comparisonValue = currentRow.CompanyStructures_RangeGroup_MarketReferencePointValue;
    }

    if (this.chartMax === undefined || comparisonValue > this.chartMax) {
      this.chartMax = comparisonValue;
    }
  }

  private addSalaryRangeMinMidMax(xCoordinate, currentRow, compareRow) {
    this.salaryRangeSeriesDataModel.MinMidMax.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Min, currentRow.CompanyStructures_Ranges_Max));
    if (compareRow) {
      this.compareSalaryRangeSeriesDataModel.MinMidMax.push(StructuresHighchartsService.formatColumnRange(
        xCoordinate, compareRow.CompanyStructures_Ranges_Min, compareRow.CompanyStructures_Ranges_Max));
    }
  }

  private addMidPoint(xCoordinate, currentRow, compareRow) {
    this.dataPointSeriesDataModel.Mid.push(
      StructuresHighchartsService.getDataPoint(xCoordinate - this.xCoordinateOffest, RangeDistributionDataPointTypeIds.Mid,
        currentRow, this.hasCurrentStructure, this.chartLocale, this.metaData)
    );
    if (compareRow) {
      this.compareDataPointSeriesDataModel.Mid.push(
        StructuresHighchartsService.getCompareDataPoint(xCoordinate + this.xCoordinateOffest, RangeDistributionDataPointTypeIds.Mid,
          compareRow, this.compareHasCurrentStructure, this.chartLocale, true, this.metaData.Currency, this.metaData.Rate)
      );

    }
  }

  private addAverage(xCoordinate, currentRow, compareRow) {
    const value = currentRow.CompanyStructures_RangeGroup_AverageEEMRP !== 0 ? currentRow.CompanyStructures_RangeGroup_AverageEEMRP : null;
    this.averageSeriesData.push({
      y: value,
      x: xCoordinate - this.xCoordinateOffest,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      avgComparatio: currentRow.CompanyStructures_RangeGroup_AverageComparatio,
      avgPositioninRange: currentRow.CompanyStructures_RangeGroup_AveragePositionInRange,
      avgSalary: this.formatSalary(value)
    });
    if (compareRow) {
      const compareValue = compareRow.CompanyStructures_RangeGroup_AverageEEMRP !== 0 ? compareRow.CompanyStructures_RangeGroup_AverageEEMRP : null;

      this.compareAverageSeriesData.push({
        y: compareValue,
        x: xCoordinate + this.xCoordinateOffest,
        jobTitle: compareRow.CompanyJobs_Job_Title,
        avgComparatio: compareRow.CompanyStructures_RangeGroup_AverageComparatio,
        avgPositioninRange: compareRow.CompanyStructures_RangeGroup_AveragePositionInRange,
        avgSalary: this.formatSalary(compareValue)
      });
    }

  }

  private processAndAddOutliers(xCoordinate, currentRow, compareRow) {
    // Min Outlier
    this.outlierSeriesData.push(
      {
        x: xCoordinate - this.xCoordinateOffest,
        y: currentRow.CompanyStructures_RangeGroup_AverageEEMinOutlier,
        count: currentRow.CompanyStructures_RangeGroup_CountEEMinOutlier,
        countString: this.formatOutlierCount(true, currentRow.CompanyStructures_RangeGroup_CountEEMinOutlier),
        avgSalary: this.formatSalary(currentRow.CompanyStructures_RangeGroup_AverageEEMinOutlier),
        delta: this.formatDelta(true, currentRow.CompanyStructures_RangeGroup_SumOfDeltaBetweenMinOutliersAndMRP)
      });

    // Max Outlier
    this.outlierSeriesData.push(
      {
        x: xCoordinate - this.xCoordinateOffest,
        y: currentRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier,
        count: currentRow.CompanyStructures_RangeGroup_CountEEMaxOutlier,
        countString: this.formatOutlierCount(false, currentRow.CompanyStructures_RangeGroup_CountEEMaxOutlier),
        avgSalary: this.formatSalary(currentRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier),
        delta: this.formatDelta(false, currentRow.CompanyStructures_RangeGroup_SumOfDeltaBetweenMaxOutliersAndMRP)
      });

    if (compareRow) {
      // Min Outlier
      this.compareOutlierSeriesData.push(
        {
          x: xCoordinate + this.xCoordinateOffest,
          y: compareRow.CompanyStructures_RangeGroup_AverageEEMinOutlier,
          count: compareRow.CompanyStructures_RangeGroup_CountEEMinOutlier,
          countString: this.formatOutlierCount(true, compareRow.CompanyStructures_RangeGroup_CountEEMinOutlier),
          avgSalary: this.formatSalary(compareRow.CompanyStructures_RangeGroup_AverageEEMinOutlier),
          delta: this.formatDelta(true, compareRow.CompanyStructures_RangeGroup_SumOfDeltaBetweenMinOutliersAndMRP)
        });


      // Max Outlier
      this.compareOutlierSeriesData.push(
        {
          x: xCoordinate + this.xCoordinateOffest,
          y: compareRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier,
          count: compareRow.CompanyStructures_RangeGroup_CountEEMaxOutlier,
          countString: this.formatOutlierCount(false, compareRow.CompanyStructures_RangeGroup_CountEEMaxOutlier),
          avgSalary: this.formatSalary(compareRow.CompanyStructures_RangeGroup_AverageEEMaxOutlier),
          delta: this.formatDelta(false, compareRow.CompanyStructures_RangeGroup_SumOfDeltaBetweenMaxOutliersAndMRP)
        });

    }

  }

  private addSalaryRangeTertile(xCoordinate, currentRow, compareRow) {
    this.salaryRangeSeriesDataModel.Tertile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Tertile_First, currentRow.CompanyStructures_Ranges_Tertile_Second));
    if (compareRow) {
      this.compareSalaryRangeSeriesDataModel.Tertile.push(StructuresHighchartsService.formatColumnRange(
        xCoordinate, compareRow.CompanyStructures_Ranges_Tertile_First, compareRow.CompanyStructures_Ranges_Tertile_Second));
    }
  }

  private addTertilePoint(xCoordinate, currentRow, compareRow) {
    this.dataPointSeriesDataModel.TertileFirst.push(
      StructuresHighchartsService.getDataPoint(xCoordinate - this.xCoordinateOffest, RangeDistributionDataPointTypeIds.TertileFirst,
        currentRow, this.hasCurrentStructure, this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.TertileSecond.push(
      StructuresHighchartsService.getDataPoint(xCoordinate - this.xCoordinateOffest, RangeDistributionDataPointTypeIds.TertileSecond,
        currentRow, this.hasCurrentStructure, this.chartLocale, this.metaData)
    );

    if (compareRow) {
      this.compareDataPointSeriesDataModel.TertileFirst.push(
        StructuresHighchartsService.getCompareDataPoint(xCoordinate + this.xCoordinateOffest, RangeDistributionDataPointTypeIds.TertileFirst, compareRow,
          this.compareHasCurrentStructure, this.chartLocale, true, this.metaData.Currency, this.metaData.Rate)
      );

      this.compareDataPointSeriesDataModel.TertileFirst.push(
        StructuresHighchartsService.getCompareDataPoint(xCoordinate + this.xCoordinateOffest, RangeDistributionDataPointTypeIds.TertileSecond, compareRow,
          this.compareHasCurrentStructure, this.chartLocale, true, this.metaData.Currency, this.metaData.Rate)
      );
    }

  }

  private addSalaryRangeQuartile(xCoordinate, currentRow, compareRow) {
    this.salaryRangeSeriesDataModel.Quartile.First.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Min, currentRow.CompanyStructures_Ranges_Quartile_First));

    this.salaryRangeSeriesDataModel.Quartile.Second.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Quartile_First, currentRow.CompanyStructures_Ranges_Mid));

    this.salaryRangeSeriesDataModel.Quartile.Third.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Mid, currentRow.CompanyStructures_Ranges_Quartile_Second));

    this.salaryRangeSeriesDataModel.Quartile.Fourth.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Quartile_Second, currentRow.CompanyStructures_Ranges_Max));

    if (compareRow) {
      // compared Row
      this.compareSalaryRangeSeriesDataModel.Quartile.First.push(StructuresHighchartsService.formatColumnRange(
        xCoordinate, compareRow.CompanyStructures_Ranges_Min, compareRow.CompanyStructures_Ranges_Quartile_First));

      this.compareSalaryRangeSeriesDataModel.Quartile.Second.push(StructuresHighchartsService.formatColumnRange(
        xCoordinate, compareRow.CompanyStructures_Ranges_Quartile_First, compareRow.CompanyStructures_Ranges_Mid));

      this.compareSalaryRangeSeriesDataModel.Quartile.Third.push(StructuresHighchartsService.formatColumnRange(
        xCoordinate, compareRow.CompanyStructures_Ranges_Mid, compareRow.CompanyStructures_Ranges_Quartile_Second));

      this.compareSalaryRangeSeriesDataModel.Quartile.Fourth.push(StructuresHighchartsService.formatColumnRange(
        xCoordinate, compareRow.CompanyStructures_Ranges_Quartile_Second, compareRow.CompanyStructures_Ranges_Max));
    }
  }

  private addQuartilePoint(xCoordinate, currentRow, compareRow) {
    this.dataPointSeriesDataModel.QuartileFirst.push(
      StructuresHighchartsService.getDataPoint(xCoordinate - this.xCoordinateOffest, RangeDistributionDataPointTypeIds.QuartileFirst,
        currentRow, this.hasCurrentStructure, this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuartileSecond.push(
      StructuresHighchartsService.getDataPoint(xCoordinate - this.xCoordinateOffest, RangeDistributionDataPointTypeIds.QuartileSecond,
        currentRow, this.hasCurrentStructure, this.chartLocale, this.metaData)
    );

    if (compareRow) {
      this.compareDataPointSeriesDataModel.QuartileFirst.push(
        StructuresHighchartsService.getCompareDataPoint(xCoordinate + this.xCoordinateOffest, RangeDistributionDataPointTypeIds.QuartileFirst,
          compareRow, this.compareHasCurrentStructure, this.chartLocale, true, this.metaData.Currency, this.metaData.Rate)
      );

      this.compareDataPointSeriesDataModel.QuartileSecond.push(
        StructuresHighchartsService.getCompareDataPoint(xCoordinate + this.xCoordinateOffest, RangeDistributionDataPointTypeIds.QuartileSecond,
          compareRow, this.compareHasCurrentStructure, this.chartLocale, true, this.metaData.Currency, this.metaData.Rate)
      );
    }
  }

  private addSalaryRangeQuintile(xCoordinate, currentRow, compareRow) {
    this.salaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Quintile_First, currentRow.CompanyStructures_Ranges_Quintile_Second));

    this.salaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, currentRow.CompanyStructures_Ranges_Quintile_Third, currentRow.CompanyStructures_Ranges_Quintile_Fourth));

    if (compareRow) {
      this.compareSalaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
        xCoordinate, compareRow.CompanyStructures_Ranges_Quintile_First, compareRow.CompanyStructures_Ranges_Quintile_Second));

      this.compareSalaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
        xCoordinate, compareRow.CompanyStructures_Ranges_Quintile_Third, compareRow.CompanyStructures_Ranges_Quintile_Fourth));
    }
  }

  private addQuintilePoint(xCoordinate, currentRow, compareRow) {
    this.dataPointSeriesDataModel.QuintileFirst.push(
      StructuresHighchartsService.getDataPoint(xCoordinate - this.xCoordinateOffest, RangeDistributionDataPointTypeIds.QuintileFirst,
        currentRow, this.hasCurrentStructure, this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuintileSecond.push(
      StructuresHighchartsService.getDataPoint(xCoordinate - this.xCoordinateOffest, RangeDistributionDataPointTypeIds.QuintileSecond,
        currentRow, this.hasCurrentStructure, this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuintileThird.push(
      StructuresHighchartsService.getDataPoint(xCoordinate - this.xCoordinateOffest, RangeDistributionDataPointTypeIds.QuintileThird,
        currentRow, this.hasCurrentStructure, this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuintileFourth.push(
      StructuresHighchartsService.getDataPoint(xCoordinate - this.xCoordinateOffest, RangeDistributionDataPointTypeIds.QuintileFourth,
        currentRow, this.hasCurrentStructure, this.chartLocale, this.metaData)
    );

    if (compareRow) {
      // Compared data
      this.compareDataPointSeriesDataModel.QuintileFirst.push(
        StructuresHighchartsService.getCompareDataPoint(xCoordinate + this.xCoordinateOffest, RangeDistributionDataPointTypeIds.QuintileFirst, compareRow,
          this.compareHasCurrentStructure, this.chartLocale, true, this.metaData.Currency, this.metaData.Rate)
      );

      this.compareDataPointSeriesDataModel.QuintileSecond.push(
        StructuresHighchartsService.getCompareDataPoint(xCoordinate + this.xCoordinateOffest, RangeDistributionDataPointTypeIds.QuintileSecond, compareRow,
          this.compareHasCurrentStructure, this.chartLocale, true, this.metaData.Currency, this.metaData.Rate)
      );

      this.compareDataPointSeriesDataModel.QuintileThird.push(
        StructuresHighchartsService.getCompareDataPoint(xCoordinate + this.xCoordinateOffest, RangeDistributionDataPointTypeIds.QuintileThird, compareRow,
          this.compareHasCurrentStructure, this.chartLocale, true, this.metaData.Currency, this.metaData.Rate)
      );

      this.compareDataPointSeriesDataModel.QuintileFourth.push(
        StructuresHighchartsService.getCompareDataPoint(xCoordinate + this.xCoordinateOffest, RangeDistributionDataPointTypeIds.QuintileFourth, compareRow,
          this.compareHasCurrentStructure, this.chartLocale, true, this.metaData.Currency, this.metaData.Rate)
      );

    }

  }

  private formatOutlierCount(min: boolean, count: number) {
    return `${count} ${count > 1 ? 'employees' : 'employee'} ${min ? 'below min' : 'above max'}`;
  }

  private formatDelta(min: boolean, delta: number) {
    return StructuresHighchartsService.formatCurrency(delta, this.chartLocale, this.currency, this.rate, true)
      + (min ? ' to bring all to minimum' : ' above the maximum');
  }

  private formatSalary(salary: number) {
    return `Average ${this.controlPointDisplay}: ${StructuresHighchartsService.formatCurrency(salary, this.chartLocale, this.currency, this.rate, true)}`;
  }

  private refreshChartLegendPosition(scrolledContent: ContentScrollEvent) {
    if (scrolledContent && this.chartInstance) {
      this.initialY = this.chartInstance.legend.options.y + 10;
      this.chartInstance.legend.group.attr({
        translateY: this.initialY + scrolledContent.scrollTop
      });
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
  }

  ngOnDestroy(): void {
    this.metadataSubscription.unsubscribe();
    this.pageViewIdSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
    this.compareDataSub.unsubscribe();
    this.filterPanelSub.unsubscribe();
    this.currentRangeGroupSub.unsubscribe();
    this.gridScrolledSub.unsubscribe();
    this.selectedFieldsSubscription.unsubscribe();
  }

}




