import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import * as Highcharts from 'highcharts';
import { getUserLocale } from 'get-user-locale';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { GridDataResult, ContentScrollEvent } from '@progress/kendo-angular-grid';

import { RangeGroupMetadata } from 'libs/models/structures';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';

import { DataPointSeries, SalaryRangeSeries } from '../../../../shared/models';
import { RangeDistributionDataPointTypeIds } from '../../../../shared/constants/range-distribution-data-point-type-ids';
import { GraphHelper } from '../../../shared/helpers/graph.helper';
import { StructuresHighchartsService, StructuresPagesService } from '../../../../shared/services';
import * as fromSharedStructuresReducer from '../../../../shared/reducers';
import { PagesHelper } from '../../../../shared/helpers/pages.helper';
import { JobViewRangeChartSeries, JobViewRangeChartService } from '../../data';

@Component({
  selector: 'pf-job-view-range-chart',
  templateUrl: './job-view-range-chart.component.html',
  styleUrls: ['./job-view-range-chart.component.scss']
})
export class JobViewRangeChartComponent implements OnInit, OnDestroy {
  @Input() rangeId: number;

  metadataSubscription: Subscription;
  dataSubscription: Subscription;
  jobRangeGroupDataSubscription: Subscription;
  modelGridPageViewIdSubscription: Subscription;
  filterPanelSub: Subscription;
  defaultPagingOptionsSub: Subscription;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  updateFlag: boolean;
  chartInstance: Highcharts.Chart;
  metaData: RangeGroupMetadata;
  pageViewId: string;
  modelGridPageViewId: string;
  isCurrent: boolean;
  rate: string;
  currency: string;
  controlPointDisplay: string;
  prevControlPointDisplay: string;
  chartLocale: string; // en-US
  rangeDistributionTypeId: number;
  jobsViewData: GridDataResult;
  jobRangeGroupData: GridDataResult;
  employeeData: GridDataResult;
  salaryRangeSeriesDataModel: SalaryRangeSeries;
  dataPointSeriesDataModel: DataPointSeries;
  chartMin: number;
  chartMax: number;
  jobRangeData: any;
  hasCurrentStructure: boolean;
  mrpSeriesData: any;
  outlierSeriesData: any;
  averageSeriesData: any;
  initialY: number;
  gridScrolledSub: Subscription;
  defaultPagingCount: number;

  constructor(
    public store: Store<any>,
    public pfGridStore: Store<fromPfGridReducer.State>,
    private structuresPagesService: StructuresPagesService
  ) {
    this.metadataSubscription = this.store.select(fromSharedStructuresReducer.getMetadata).subscribe(md => {
      if (md) {
        this.metaData = md;
        this.pageViewId =
          PagesHelper.getJobsPageViewIdByRangeDistributionType(this.metaData.RangeDistributionTypeId);
        this.isCurrent = md.IsCurrent;
        this.rate = md.Rate;
        this.currency = md.Currency;
        this.prevControlPointDisplay = this.controlPointDisplay;
        this.controlPointDisplay = md.ControlPointDisplay;
        this.chartLocale = getUserLocale();
        this.rangeDistributionTypeId = md.RangeDistributionTypeId;
        this.clearData();
        this.chartOptions =
          JobViewRangeChartService.getJobViewRangeOptions(this.chartLocale, this.currency, this.controlPointDisplay, this.rangeDistributionTypeId);
      }
    });

    this.modelGridPageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.modelGridPageViewId = pv);
    this.jobRangeGroupDataSubscription = this.store.select(fromPfGridReducer.getData, this.modelGridPageViewId).subscribe(data => {
      if (data) {
        this.jobRangeGroupData = data;
        this.processChartData();
      }
    });

    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.pageViewId).subscribe(data => {
      if (data) {
        this.jobsViewData = data;
        this.processChartData();
      }
    });

    this.gridScrolledSub = this.pfGridStore.select(fromPfGridReducer.getGridScrolledContent, this.pageViewId).subscribe( scrolledContent => {
      if (scrolledContent && this.chartInstance) {
        this.initialY = this.chartInstance.legend.options.y;
        this.chartInstance.legend.group.attr({
          translateY: this.initialY + scrolledContent.scrollTop
        });
      }
    });

    this.defaultPagingOptionsSub = this.pfGridStore.select(fromPfGridReducer.getPagingOptions, this.pageViewId).subscribe( pagingOptions => {
      if (pagingOptions) {
        this.defaultPagingCount = pagingOptions.Count;
      }
    });
  }

  private reassessMinMax(currentRow) {
    // only do this if currentRow.CompanyEmployees_EEMRPForStructureRangeGroup has a value
    if (currentRow.CompanyEmployees_EEMRPForStructureRangeGroup !== null) {
      // if this employees salary is higher than the current max, set it
      if (currentRow.CompanyEmployees_EEMRPForStructureRangeGroup > this.chartMax) {
        this.chartMax = currentRow.CompanyEmployees_EEMRPForStructureRangeGroup;
      }
      // same logic for min but reversed, obviously
      if (currentRow.CompanyEmployees_EEMRPForStructureRangeGroup < this.chartMin) {
        this.chartMin = currentRow.CompanyEmployees_EEMRPForStructureRangeGroup;
      }
    }

    if (this.jobRangeData.CompanyStructures_RangeGroup_MarketReferencePointValue !== null) {
      if (this.jobRangeData.CompanyStructures_RangeGroup_MarketReferencePointValue > this.chartMax) {
        this.chartMax = this.jobRangeData.CompanyStructures_RangeGroup_MarketReferencePointValue;
      }
      // same logic for min but reversed, obviously
      if (this.jobRangeData.CompanyStructures_RangeGroup_MarketReferencePointValue < this.chartMin) {
        this.chartMin = this.jobRangeData.CompanyStructures_RangeGroup_MarketReferencePointValue;
      }
    }
  }

  private getScatterXCoordinate(index): number {
    return index - (0.02 * index);
  }

  private addSalaryRangeMinMidMax(xCoordinate) {
    this.salaryRangeSeriesDataModel.MinMidMax.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyStructures_Ranges_Min, this.jobRangeData.CompanyStructures_Ranges_Max));
  }

  private addSalaryRangeTertile(xCoordinate) {
    this.salaryRangeSeriesDataModel.Tertile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyStructures_Ranges_Tertile_First, this.jobRangeData.CompanyStructures_Ranges_Tertile_Second));
  }

  private addSalaryRangeQuartile(xCoordinate) {
    this.salaryRangeSeriesDataModel.Quartile.First.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyStructures_Ranges_Min, this.jobRangeData.CompanyStructures_Ranges_Quartile_First));

    this.salaryRangeSeriesDataModel.Quartile.Second.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyStructures_Ranges_Quartile_First, this.jobRangeData.CompanyStructures_Ranges_Mid));

    this.salaryRangeSeriesDataModel.Quartile.Third.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyStructures_Ranges_Mid, this.jobRangeData.CompanyStructures_Ranges_Quartile_Second));

    this.salaryRangeSeriesDataModel.Quartile.Fourth.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyStructures_Ranges_Quartile_Second, this.jobRangeData.CompanyStructures_Ranges_Max));
  }

  private addSalaryRangeQuintile(xCoordinate) {
    this.salaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyStructures_Ranges_Quintile_First, this.jobRangeData.CompanyStructures_Ranges_Quintile_Second));

    this.salaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyStructures_Ranges_Quintile_Third, this.jobRangeData.CompanyStructures_Ranges_Quintile_Fourth));
  }

  private addMidPoint(xCoordinate) {
    this.dataPointSeriesDataModel.Mid.push(
      StructuresHighchartsService.getDataPointForGBRJobs(xCoordinate, RangeDistributionDataPointTypeIds.Mid, this.jobRangeData, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );
  }

  private addTertilePoint(xCoordinate) {
    this.dataPointSeriesDataModel.TertileFirst.push(
      StructuresHighchartsService.getDataPointForGBRJobs(xCoordinate, RangeDistributionDataPointTypeIds.TertileFirst, this.jobRangeData,
        this.hasCurrentStructure, this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.TertileSecond.push(
      StructuresHighchartsService.getDataPointForGBRJobs(xCoordinate, RangeDistributionDataPointTypeIds.TertileSecond, this.jobRangeData,
        this.hasCurrentStructure, this.chartLocale, this.metaData)
    );
  }

  private addQuartilePoint(xCoordinate) {
    this.dataPointSeriesDataModel.QuartileFirst.push(
      StructuresHighchartsService.getDataPointForGBRJobs(xCoordinate, RangeDistributionDataPointTypeIds.QuartileFirst, this.jobRangeData,
        this.hasCurrentStructure, this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuartileSecond.push(
      StructuresHighchartsService.getDataPointForGBRJobs(xCoordinate, RangeDistributionDataPointTypeIds.QuartileSecond, this.jobRangeData,
        this.hasCurrentStructure, this.chartLocale, this.metaData)
    );
  }

  private addQuintilePoint(xCoordinate) {
    this.dataPointSeriesDataModel.QuintileFirst.push(
      StructuresHighchartsService.getDataPointForGBRJobs(xCoordinate, RangeDistributionDataPointTypeIds.QuintileFirst, this.jobRangeData,
        this.hasCurrentStructure, this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuintileSecond.push(
      StructuresHighchartsService.getDataPointForGBRJobs(xCoordinate, RangeDistributionDataPointTypeIds.QuintileSecond, this.jobRangeData,
        this.hasCurrentStructure, this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuintileThird.push(
      StructuresHighchartsService.getDataPointForGBRJobs(xCoordinate, RangeDistributionDataPointTypeIds.QuintileThird, this.jobRangeData,
        this.hasCurrentStructure, this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuintileFourth.push(
      StructuresHighchartsService.getDataPointForGBRJobs(xCoordinate, RangeDistributionDataPointTypeIds.QuintileFourth, this.jobRangeData,
        this.hasCurrentStructure, this.chartLocale, this.metaData)
    );
  }

  private addMRPPoint(currentRow, xCoordinate) {
    const isMidFormula = !!this.metaData.RangeDistributionSetting?.Mid_Formula?.FormulaId;

    this.mrpSeriesData.push({
      x: this.getScatterXCoordinate(xCoordinate),
      y: currentRow.CompanyJobs_Structures_GradeBased_Job_MarketReferencePointValue,
      jobTitle: currentRow.CompanyJobs_Structures_JobTitle,
      mrp: StructuresHighchartsService.formatMrpTooltip(currentRow.CompanyJobs_Structures_GradeBased_Job_MarketReferencePointValue,
        currentRow.CompanyJobs_Structures_GradeBased_Job_MrpPercentile, isMidFormula, !!this.metaData?.PayType ? this.metaData.PayType : 'Base',
        this.chartLocale, this.currency, this.rate)
    });
  }

  private updateChartLabels() {
    const locale = this.chartLocale;
    const currencyCode = this.currency;
    const rate = this.rate;
    this.chartInstance.yAxis[0].update({
      labels: {
        formatter: function () {
          return StructuresHighchartsService.formatYAxisLabel(this.value, locale, currencyCode, rate);
        }
      }
    }, false);
  }

  private processAndAddOutliers(xCoordinate, currentRow) {
    // Min Outlier
    this.outlierSeriesData.push(
      {
        x: this.getScatterXCoordinate(xCoordinate),
        y: currentRow.CompanyJobs_Structures_GradeBased_Job_AverageEEMinOutlier,
        countString: this.formatOutlierCount(true, currentRow.CompanyJobs_Structures_GradeBased_Job_CountEEMinOutlier),
        avgSalary: this.formatSalary(currentRow.CompanyJobs_Structures_GradeBased_Job_AverageEEMinOutlier),
        delta: this.formatDelta(true, currentRow.CompanyJobs_Structures_GradeBased_Job_DeltaBetweenMinOutliersAndMin)
      });

    // Max Outlier
    this.outlierSeriesData.push(
      {
        x: this.getScatterXCoordinate(xCoordinate),
        y: currentRow.CompanyJobs_Structures_GradeBased_Job_AverageEEMaxOutlier,
        countString: this.formatOutlierCount(false, currentRow.CompanyJobs_Structures_GradeBased_Job_CountEEMaxOutlier),
        avgSalary: this.formatSalary(currentRow.CompanyJobs_Structures_GradeBased_Job_AverageEEMaxOutlier),
        delta: this.formatDelta(false, currentRow.CompanyJobs_Structures_GradeBased_Job_DeltaBetweenMaxOutliersAndMax)
      });
  }

  private addAverageEEPay(xCoordinate, currentRow) {
    const value = currentRow.CompanyJobs_Structures_GradeBased_Job_AverageEEPay !== 0 ? currentRow.CompanyJobs_Structures_GradeBased_Job_AverageEEPay : null;

    this.averageSeriesData.push({
      x: this.getScatterXCoordinate(xCoordinate),
      y: value,
      jobTitle: currentRow.CompanyJobs_Structures_JobTitle,
      avgComparatio: currentRow.CompanyJobs_Structures_GradeBased_Job_AvgComparatio,
      avgPositionInRange: currentRow.CompanyJobs_Structures_GradeBased_Job_AveragePositionInRange,
      avgPay: `
        ${this.controlPointDisplay}:
        ${StructuresHighchartsService
        .formatCurrency(value, this.chartLocale, this.currency, this.rate, true)}
      `
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

  private processChartData() {
    if (this.jobsViewData && this.jobRangeGroupData) {

      this.jobRangeData = this.jobRangeGroupData.data.find(jr => jr.CompanyStructures_Ranges_CompanyStructuresRanges_ID === this.rangeId);
      this.hasCurrentStructure = this.jobRangeData.CompanyStructures_RangeGroup_CurrentStructureMidPoint === null;

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

      this.mrpSeriesData = [];
      this.outlierSeriesData = [];
      this.averageSeriesData = [];

      this.chartMin = StructuresHighchartsService.getChartMin(this.jobRangeGroupData, this.rangeDistributionTypeId);
      this.chartMax = StructuresHighchartsService.getChartMax(this.jobRangeGroupData, this.rangeDistributionTypeId);


      for (let i = 0; i < this.jobsViewData.data.length; i++ ) {
        const currentRow = this.jobsViewData.data[i];

        this.reassessMinMax(currentRow);

        // always add to salary range group
        this.addSalaryRangeMinMidMax(i);

        // always add to midPoint
        this.addMidPoint(i);

        // always add to MRP
        this.addMRPPoint(currentRow, i);

        // Tertile - Quartile - Quintile: salary range + data points
        if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
          this.addSalaryRangeTertile(i);
          this.addTertilePoint(i);
        } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
          this.addSalaryRangeQuartile(i);
          this.addQuartilePoint(i);
        } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
          this.addSalaryRangeQuintile(i);
          this.addQuintilePoint(i);
        }

        // add any outliers
        this.processAndAddOutliers(i, currentRow);

        // add EE average pay
        this.addAverageEEPay(i, currentRow);

      }

      this.chartInstance.yAxis[0].setExtremes(this.chartMin, this.chartMax, false);

      this.updateChartLabels();

      this.chartInstance.series[JobViewRangeChartSeries.SalaryRangeMinMidMax].setData(this.salaryRangeSeriesDataModel.MinMidMax, false);

      this.chartInstance.series[JobViewRangeChartSeries.RangeMid].setData(this.dataPointSeriesDataModel.Mid, false);
      this.chartInstance.series[JobViewRangeChartSeries.MRP].setData(this.mrpSeriesData, false);
      this.chartInstance.series[JobViewRangeChartSeries.EmployeeOutliers].setData(this.outlierSeriesData, false);
      this.chartInstance.series[JobViewRangeChartSeries.AverageEEPay].setData(this.averageSeriesData, false);

      // Tertile - Quartile - Quintile: salary range + data points
      if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
        this.chartInstance.series[JobViewRangeChartSeries.SalaryRangeTertile].setData(this.salaryRangeSeriesDataModel.Tertile, false);
        this.chartInstance.series[JobViewRangeChartSeries.RangeTertileFirst].setData(this.dataPointSeriesDataModel.TertileFirst, false);
        this.chartInstance.series[JobViewRangeChartSeries.RangeTertileSecond].setData(this.dataPointSeriesDataModel.TertileSecond, false);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
        this.chartInstance.series[JobViewRangeChartSeries.SalaryRangeQuartileFirst].setData(this.salaryRangeSeriesDataModel.Quartile.First, false);
        this.chartInstance.series[JobViewRangeChartSeries.SalaryRangeQuartileSecond].setData(this.salaryRangeSeriesDataModel.Quartile.Second, false);
        this.chartInstance.series[JobViewRangeChartSeries.SalaryRangeQuartileThird].setData(this.salaryRangeSeriesDataModel.Quartile.Third, false);
        this.chartInstance.series[JobViewRangeChartSeries.SalaryRangeQuartileFourth].setData(this.salaryRangeSeriesDataModel.Quartile.Fourth, false);
        this.chartInstance.series[JobViewRangeChartSeries.RangeQuartileFirst].setData(this.dataPointSeriesDataModel.QuartileFirst, false);
        this.chartInstance.series[JobViewRangeChartSeries.RangeQuartileSecond].setData(this.dataPointSeriesDataModel.QuartileSecond, false);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
        this.chartInstance.series[JobViewRangeChartSeries.SalaryRangeQuintile].setData(this.salaryRangeSeriesDataModel.Quintile, false);
        this.chartInstance.series[JobViewRangeChartSeries.RangeQuintileFirst].setData(this.dataPointSeriesDataModel.QuintileFirst, false);
        this.chartInstance.series[JobViewRangeChartSeries.RangeQuintileSecond].setData(this.dataPointSeriesDataModel.QuintileSecond, false);
        this.chartInstance.series[JobViewRangeChartSeries.RangeQuintileThird].setData(this.dataPointSeriesDataModel.QuintileThird, false);
        this.chartInstance.series[JobViewRangeChartSeries.RangeQuintileFourth].setData(this.dataPointSeriesDataModel.QuintileFourth, false);
      }

      this.chartInstance.setSize(null, GraphHelper.getChartHeight(this.jobsViewData.data, this.defaultPagingCount));

      // adjust the radius of the range mid when there is only one record
      // only do this if there is indeed one record only
      if (this.jobsViewData.data.length === 1) {
        const rangeMidOptions = this.chartInstance.series[JobViewRangeChartSeries.RangeMid].options as any;
        rangeMidOptions.marker.radius = GraphHelper.getJobsRangeMidRadius(this.jobsViewData.data.length);
        this.chartInstance.series[JobViewRangeChartSeries.RangeMid].update(rangeMidOptions);
      }

      GraphHelper.forceRedraw(this.chartInstance, this.chartOptions);
    }
  }

  private clearData(): void {
    if (this.jobRangeGroupData) {
      this.jobRangeGroupData = { ...this.jobRangeGroupData, data: [] };
    }

    if (this.jobsViewData) {
      this.jobsViewData = { ...this.jobsViewData, data: [] };
    }
  }

  rangeChartCallback(chart: Highcharts.Chart = null) {
    // set the instance
    if (chart) {
      this.chartInstance = chart;
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
    this.dataSubscription.unsubscribe();
    this.jobRangeGroupDataSubscription.unsubscribe();
    this.modelGridPageViewIdSubscription.unsubscribe();
    this.filterPanelSub.unsubscribe();
    this.gridScrolledSub.unsubscribe();
    this.defaultPagingOptionsSub.unsubscribe();
  }
}
