import { Component, OnDestroy, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';
import * as Highcharts from 'highcharts';
import { getUserLocale } from 'get-user-locale';

import { GradeBasedPageViewIds, RangeGroupMetadata } from 'libs/models/structures';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';

import { SingleJobViewDataCutsChartSeries, SingleJobViewDataCutsChartService, SingleJobViewHighchartsService } from '../../data';
import * as fromSharedStructuresReducer from '../../../../shared/reducers';
import { PagesHelper } from '../../../../shared/helpers/pages.helper';
import { StructuresHighchartsService } from '../../../../shared/services';
import { RangeDistributionDataPointTypeIds } from '../../../../shared/constants/range-distribution-data-point-type-ids';
import { GraphHelper } from '../../../shared/helpers/graph.helper';
import { DataPointSeries, SalaryRangeSeries } from '../../../../shared/models';

@Component({
  selector: 'pf-single-job-view-data-cuts-range-chart',
  templateUrl: './single-job-view-data-cuts-range-chart.component.html',
  styleUrls: ['./single-job-view-data-cuts-range-chart.component.scss']
})
export class SingleJobViewDataCutsRangeChartComponent implements OnInit, OnDestroy {
  dataSubscription: Subscription;
  jobDataSubscription: Subscription;
  metadataSubscription: Subscription;
  gridScrolledSub: Subscription;
  filterPanelSub: Subscription;
  selectedFieldsSubscription: Subscription;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  updateFlag: boolean;
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  chartMin: number;
  chartMax: number;
  salaryRangeSeriesDataModel: SalaryRangeSeries;
  dataPointSeriesDataModel: DataPointSeries;
  mrpSeriesData: any;
  dataCutMRPSeriesData: any;
  chartLocale: string; // en-US
  chartInstance: Highcharts.Chart;
  pageViewId: string;
  jobRangeViewId: string;
  jobRangeGroupData: GridDataResult;
  dataCutData: GridDataResult;
  jobRangeData: any;
  controlPointDisplay: string;
  prevControlPointDisplay: string;
  rate: string;
  selectedFields: any[];
  groupFieldSelected: boolean;

  isCurrent: boolean;
  hasCurrentStructure: boolean;
  metaData: RangeGroupMetadata;
  rangeDistributionTypeId: number;
  currency: string;
  initialY: number;

  constructor(
    public store: Store<any>,
  ) {
    this.metadataSubscription = this.store.select(fromSharedStructuresReducer.getMetadata).subscribe(md => {
      if (md) {
        this.metaData = md;
        this.pageViewId = GradeBasedPageViewIds.SingleJobDataCuts;
        this.jobRangeViewId = PagesHelper.getJobsPageViewIdByRangeDistributionType(md.RangeDistributionTypeId);
        this.isCurrent = md.IsCurrent;
        this.rate = md.Rate;
        this.currency = md.Currency;
        this.prevControlPointDisplay = this.controlPointDisplay;
        this.controlPointDisplay = md.ControlPointDisplay;
        this.chartLocale = getUserLocale();
        this.rangeDistributionTypeId = md.RangeDistributionTypeId;
        this.clearData();
        if (!!this.groupFieldSelected) {
          this.chartOptions =
            SingleJobViewDataCutsChartService.getSingleJobViewDataCutChartOptions(
              this.chartLocale, this.currency, this.controlPointDisplay, this.rangeDistributionTypeId, this.groupFieldSelected);
        }
      }
    });

    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.pageViewId).subscribe(data => {
      if (data) {
        this.dataCutData = data;
        if (this.jobRangeGroupData) {
          this.processChartData();
        }
      }
    });

    this.jobDataSubscription = this.store.select(fromPfGridReducer.getData, this.jobRangeViewId).subscribe(data => {
      if (data) {
        this.jobRangeGroupData = data;
        if (this.dataCutData) {
          this.processChartData();
        }
      }
    });

    this.gridScrolledSub = this.store.select(fromPfGridReducer.getGridScrolledContent, this.pageViewId).subscribe( scrolledContent => {
      if (scrolledContent && this.chartInstance) {
        this.initialY = this.chartInstance.legend.options.y;
        this.chartInstance.legend.group.attr({
          translateY: this.initialY + scrolledContent.scrollTop
        });
      }
    });

    this.selectedFieldsSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.selectedFields = fields;
        const anyGroupField = this.selectedFields.find(f => f.Group && f.IsSelected);
        this.groupFieldSelected = !!anyGroupField;
        if (!!this.chartLocale &&  !!this.currency && !!this.controlPointDisplay && !!this.rangeDistributionTypeId) {
          this.chartOptions =
            SingleJobViewDataCutsChartService.getSingleJobViewDataCutChartOptions(
              this.chartLocale, this.currency, this.controlPointDisplay, this.rangeDistributionTypeId, this.groupFieldSelected);
        }
      }
    });

  }

  rangeChartCallback(chart: Highcharts.Chart = null) {
    // set the instance
    if (chart) {
      this.chartInstance = chart;
    }
  }
  private reassessMinMax(currentRow) {
    // only do this if currentRow.CompanyJobs_PricingsMatches_GradeBased_SingleJob_DataCut_MRP has a value
    if (currentRow.CompanyJobs_PricingsMatches_GradeBased_SingleJob_DataCut_MRP !== null) {
      // if this employees salary is higher than the current max, set it
      if (currentRow.CompanyJobs_PricingsMatches_GradeBased_SingleJob_DataCut_MRP > this.chartMax) {
        this.chartMax = currentRow.CompanyJobs_PricingsMatches_GradeBased_SingleJob_DataCut_MRP;
      }
      // same logic for min but reversed, obviously
      if (currentRow.CompanyJobs_PricingsMatches_GradeBased_SingleJob_DataCut_MRP < this.chartMin) {
        this.chartMin = currentRow.CompanyJobs_PricingsMatches_GradeBased_SingleJob_DataCut_MRP;
      }
    }
  }

  private addSalaryRangeMinMidMax(xCoordinate) {
    this.salaryRangeSeriesDataModel.MinMidMax.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyJobs_Structures_Min, this.jobRangeData.CompanyJobs_Structures_Max));
  }

  private addSalaryRangeTertile(xCoordinate) {
    this.salaryRangeSeriesDataModel.Tertile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyJobs_Structures_Tertile_First, this.jobRangeData.CompanyJobs_Structures_Tertile_Second));
  }

  private addSalaryRangeQuartile(xCoordinate) {
    this.salaryRangeSeriesDataModel.Quartile.First.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyJobs_Structures_Min, this.jobRangeData.CompanyJobs_Structures_Quartile_First));

    this.salaryRangeSeriesDataModel.Quartile.Second.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyJobs_Structures_Quartile_First, this.jobRangeData.CompanyJobs_Structures_Mid));

    this.salaryRangeSeriesDataModel.Quartile.Third.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyJobs_Structures_Mid, this.jobRangeData.CompanyJobs_Structures_Quartile_Second));

    this.salaryRangeSeriesDataModel.Quartile.Fourth.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyJobs_Structures_Quartile_Second, this.jobRangeData.CompanyJobs_Structures_Max));
  }

  private addSalaryRangeQuintile(xCoordinate) {
    this.salaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyJobs_Structures_Quintile_First, this.jobRangeData.CompanyJobs_Structures_Quintile_Second));

    this.salaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyJobs_Structures_Quintile_Third, this.jobRangeData.CompanyJobs_Structures_Quintile_Fourth));
  }

  private addMidPoint(xCoordinate) {
    this.dataPointSeriesDataModel.Mid.push(
      SingleJobViewHighchartsService.getDataPointForGBRJobs(xCoordinate, RangeDistributionDataPointTypeIds.Mid, this.jobRangeData, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );
  }

  private addMRPPoint(xCoordinate) {
    const isMidFormula = !!this.metaData.RangeDistributionSetting?.Mid_Formula?.FormulaId;
    this.mrpSeriesData.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyJobs_Structures_GradeBased_Job_MarketReferencePointValue,
      jobTitle: this.jobRangeData.CompanyJobs_Structures_JobTitle,
      mrp: StructuresHighchartsService.formatMrpTooltip(this.jobRangeData.CompanyJobs_Structures_GradeBased_Job_MarketReferencePointValue,
        this.jobRangeData.CompanyJobs_Structures_GradeBased_Job_MrpPercentile, isMidFormula, !!this.metaData?.PayType ? this.metaData.PayType : 'Base',
        this.chartLocale, this.currency, this.rate)
    });
  }

  private addDataCutMRPPoint(xCoordinate, currentRow) {
    const isMidFormula = !!this.metaData.RangeDistributionSetting?.Mid_Formula?.FormulaId;
    const formattedDate = formatDate(currentRow.vw_PricingMatchesJobTitlesMerged_Effective_Date, 'MM/dd/yyyy', this.chartLocale);
    this.dataCutMRPSeriesData.push({
      x: xCoordinate,
      y: currentRow.CompanyJobs_PricingsMatches_GradeBased_SingleJob_DataCut_MRP,
      source: currentRow.vw_PricingMatchesJobTitlesMerged_Source,
      sourceTitle: currentRow.vw_PricingMatchesJobTitlesMerged_Job_Title,
      effectiveDate: formattedDate,
      mrp: StructuresHighchartsService.formatMrpTooltip(currentRow.CompanyJobs_PricingsMatches_GradeBased_SingleJob_DataCut_MRP,
        this.jobRangeData.CompanyJobs_Structures_GradeBased_Job_MrpPercentile, isMidFormula, !!this.metaData?.PayType ? this.metaData.PayType : 'Base',
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

  private clearData(): void {
    if (this.jobRangeGroupData) {
      this.jobRangeGroupData = { ...this.jobRangeGroupData, data: [] };
    }

    if (this.dataCutData) {
      this.dataCutData = { ...this.dataCutData, data: [] };
    }
  }

  private processChartData() {
    // make sure all the proper data is present. If not present, don't do anything yet. this is because we can't control the order in which both datasets appear
    if (this.jobRangeGroupData && this.jobRangeGroupData.data.length && this.dataCutData && this.dataCutData.data.length) {
      this.jobRangeData = this.jobRangeGroupData.data[0];
      this.hasCurrentStructure = null;

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
      this.dataCutMRPSeriesData = [];

      this.chartMin = SingleJobViewHighchartsService.getChartMin(this.jobRangeData, this.rangeDistributionTypeId);
      this.chartMax = SingleJobViewHighchartsService.getChartMax(this.jobRangeData, this.rangeDistributionTypeId);

      // then we need to loop through and plot employee data
      for (let i = 0; i < this.dataCutData.data.length; i++) {
        const currentRow = this.dataCutData.data[i];

        // if the current employees salary is below the min or above the max, set those values accordingly
        this.reassessMinMax(currentRow);

        // add employee plot points

        // always add to salary range group
        this.addSalaryRangeMinMidMax(i);

        // always add to midPoint
        this.addMidPoint(i);

        // always add to MRP
        this.addMRPPoint(i);

        this.addDataCutMRPPoint(i, currentRow);

        // Tertile - Quartile - Quintile: salary range
        if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
          this.addSalaryRangeTertile(i);
        } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
          this.addSalaryRangeQuartile(i);
        } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
          this.addSalaryRangeQuintile(i);
        }
      }
      // set the min/max
      this.chartInstance.yAxis[0].setExtremes(this.chartMin, this.chartMax, false);

      this.updateChartLabels();

      // set the series data
      this.chartInstance.series[SingleJobViewDataCutsChartSeries.RangeMid].setData(this.dataPointSeriesDataModel.Mid, false);
      this.chartInstance.series[SingleJobViewDataCutsChartSeries.SalaryRangeMinMidMax].setData(this.salaryRangeSeriesDataModel.MinMidMax, false);
      this.chartInstance.series[SingleJobViewDataCutsChartSeries.JobMRP].setData(this.mrpSeriesData, false);
      this.chartInstance.series[SingleJobViewDataCutsChartSeries.DataCutMRP].setData(this.dataCutMRPSeriesData, false);

      // Tertile - Quartile - Quintile: salary range + data points
      if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
        this.chartInstance.series[SingleJobViewDataCutsChartSeries.SalaryRangeTertile].setData(this.salaryRangeSeriesDataModel.Tertile, false);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
        this.chartInstance.series[SingleJobViewDataCutsChartSeries.SalaryRangeQuartileFirst]
          .setData(this.salaryRangeSeriesDataModel.Quartile.First, false);
        this.chartInstance.series[SingleJobViewDataCutsChartSeries.SalaryRangeQuartileSecond]
          .setData(this.salaryRangeSeriesDataModel.Quartile.Second, false);
        this.chartInstance.series[SingleJobViewDataCutsChartSeries.SalaryRangeQuartileThird]
          .setData(this.salaryRangeSeriesDataModel.Quartile.Third, false);
        this.chartInstance.series[SingleJobViewDataCutsChartSeries.SalaryRangeQuartileFourth]
          .setData(this.salaryRangeSeriesDataModel.Quartile.Fourth, false);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
        this.chartInstance.series[SingleJobViewDataCutsChartSeries.SalaryRangeQuintile].setData(this.salaryRangeSeriesDataModel.Quintile, false);
      }

      this.chartInstance.setSize(null, GraphHelper.getDataCutChartHeight(this.dataCutData.data, this.groupFieldSelected));
    }
  }

  ngOnInit(): void {
    StructuresHighchartsService.initializeHighcharts();
    this.filterPanelSub = this.store.select(fromPfGridReducer.getFilterPanelOpen, this.pageViewId).subscribe(filterPanelOpen => {
      if (filterPanelOpen === false) {
        setTimeout(() => {
          if (!!this.chartInstance.options) {
            this.chartInstance.reflow();
          }
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
    this.jobDataSubscription.unsubscribe();
    this.filterPanelSub.unsubscribe();
    this.gridScrolledSub.unsubscribe();
    this.selectedFieldsSubscription.unsubscribe();
  }

}
