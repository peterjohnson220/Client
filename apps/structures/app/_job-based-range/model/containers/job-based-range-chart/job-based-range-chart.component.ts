import { Component, OnDestroy, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';
import { ContentScrollEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { take } from 'rxjs/operators';

import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import { StructuresHighchartsService, StructuresPagesService } from '../../../shared/services';
import { JobRangeModelChartService, JobRangeModelChartSeries } from '../../data';
import { GraphHelper } from '../../../shared/helpers/graph.helper';
import { RangeGroupMetadata } from '../../../shared/models';
import { RangeDistributionTypeIds } from '../../../shared/constants/range-distribution-type-ids';
import { SalaryRangeSeries } from '../../../shared/models/salary-range-series.model';
import { DataPointSeries } from '../../../shared/models/data-point-series.model';
import { RangeDistributionDataPointTypeIds } from '../../../shared/constants/range-distribution-data-point-type-ids';

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
  mrpSeriesData: any;
  chartLocale: string; // en-US
  chartInstance: Highcharts.Chart;
  dataSubscription: Subscription;
  selectedFieldsSubscription: Subscription;
  metadataSubscription: Subscription;
  pageViewId: string;
  pageViewIdSubscription: Subscription;
  jobRangeData: GridDataResult;
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
  gridScrolledSub: Subscription;
  groupFieldSelected = false;

  constructor(
    public store: Store<any>,
    public pfGridStore: Store<fromPfGridReducer.State>,
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

        this.pfGridStore.select(fromPfGridReducer.getGridScrolledContent, this.pageViewId).pipe(take(1)).subscribe(scrolledContent => {
          this.refreshChartLegendPosition(scrolledContent);
        });
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
  }

  rangeChartCallback(chart: Highcharts.Chart = null) {
    // set the instance
    if (chart) {
      this.chartInstance = chart;
    }
  }

  private refreshChartLegendPosition(scrolledContent: ContentScrollEvent) {
    if (scrolledContent && this.chartInstance) {
      this.initialY = this.chartInstance.legend.options.y;
      this.chartInstance.legend.group.attr({
        translateY: this.initialY + scrolledContent.scrollTop
      });
    }
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

  private addAverage(currentRow) {
    const value = currentRow.CompanyStructures_RangeGroup_AverageEEMRP !== 0 ? currentRow.CompanyStructures_RangeGroup_AverageEEMRP : null;
    this.averageSeriesData.push({
      y: value,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      avgComparatio: currentRow.CompanyStructures_RangeGroup_AverageComparatio,
      avgPositioninRange: currentRow.CompanyStructures_RangeGroup_AveragePositionInRange,
      avgSalary: this.formatSalary(value)
    });
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

  private addMRPPoint(currentRow) {
    const value = currentRow.CompanyStructures_RangeGroup_MarketReferencePointValue !== 0
      ? currentRow.CompanyStructures_RangeGroup_MarketReferencePointValue
      : null;

    this.mrpSeriesData.push({
      y: value,
      jobTitle: currentRow.CompanyJobs_Job_Title,
      mrp: this.formatMRP(value, currentRow.CompanyStructures_RangeGroup_MrpPercentile)
    });
  }

  private formatOutlierCount(min: boolean, count: number) {
    return `${count} ${count > 1 ? 'employees' : 'employee'} ${min ? 'below min' : 'above max'}`;
  }

  private formatSalary(salary: number) {
    return `Average ${this.controlPointDisplay}: ${StructuresHighchartsService.formatCurrency(salary, this.chartLocale, this.currency, this.rate, true)}`;
  }

  private formatMRP(mrp: number, percentile: number) {
    return `MRP: ${StructuresHighchartsService.formatCurrency(mrp, this.chartLocale, this.currency, this.rate, true)} (Base ${percentile}th)`;
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

    this.averageSeriesData = [];
    this.outlierSeriesData = [];
    this.mrpSeriesData = [];
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
      this.addMidPoint(i, currentRow);

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

      // add to average
      this.addAverage(currentRow);

      // add any outliers
      this.processAndAddOutliers(i, currentRow);

      // add mrp point
      this.addMRPPoint(currentRow);
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
    this.chartInstance.series[JobRangeModelChartSeries.MRP].setData(this.mrpSeriesData, false);

    // Tertile - Quartile - Quintile: salary range + data points
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
      this.chartInstance.series[JobRangeModelChartSeries.SalaryRangeTertile].setData(this.salaryRangeSeriesDataModel.Tertile, false);
      this.chartInstance.series[JobRangeModelChartSeries.RangeTertileFirst].setData(this.dataPointSeriesDataModel.TertileFirst, false);
      this.chartInstance.series[JobRangeModelChartSeries.RangeTertileSecond].setData(this.dataPointSeriesDataModel.TertileSecond, false);
    } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
      this.chartInstance.series[JobRangeModelChartSeries.SalaryRangeQuartileFirst].setData(this.salaryRangeSeriesDataModel.Quartile.First, false);
      this.chartInstance.series[JobRangeModelChartSeries.SalaryRangeQuartileSecond].setData(this.salaryRangeSeriesDataModel.Quartile.Second, false);
      this.chartInstance.series[JobRangeModelChartSeries.SalaryRangeQuartileThird].setData(this.salaryRangeSeriesDataModel.Quartile.Third, false);
      this.chartInstance.series[JobRangeModelChartSeries.SalaryRangeQuartileFourth].setData(this.salaryRangeSeriesDataModel.Quartile.Fourth, false);
      this.chartInstance.series[JobRangeModelChartSeries.RangeQuartileFirst].setData(this.dataPointSeriesDataModel.QuartileFirst, false);
      this.chartInstance.series[JobRangeModelChartSeries.RangeQuartileSecond].setData(this.dataPointSeriesDataModel.QuartileSecond, false);
    } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
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
    this.filterPanelSub = this.store.select(fromPfGridReducer.getFilterPanelOpen, this.pageViewId).subscribe(filterPanelOpen => {
      if (filterPanelOpen === false) {
        setTimeout(() => {
          this.chartInstance.reflow();
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
    this.pageViewIdSubscription.unsubscribe();
    this.filterPanelSub.unsubscribe();
    this.gridScrolledSub.unsubscribe();
    this.selectedFieldsSubscription.unsubscribe();
  }
}
