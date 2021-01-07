import { Component, OnDestroy, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { RangeGroupMetadata } from 'libs/models/structures';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import { StructuresHighchartsService } from '../../../../shared/services';
import { GradeRangeModelChartService } from '../../data/grade-range-model-chart.service';
import { PagesHelper } from '../../../../shared/helpers/pages.helper';
import { RangeDistributionTypeIds } from '../../../../shared/constants/range-distribution-type-ids';
import { GradeRangeModelChartSeries } from '../../data/grade-range-model-chart-series-constants';
import * as fromSharedStructuresReducer from '../../../../shared/reducers';

@Component({
  selector: 'pf-grade-based-summary-chart',
  templateUrl: './grade-based-summary-chart.component.html',
  styleUrls: ['./grade-based-summary-chart.component.scss']
})
export class GradeBasedSummaryChartComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  updateFlag: boolean;
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  chartInstance: Highcharts.Chart;
  dataSubscription: Subscription;
  metadataSubscription: Subscription;
  pageViewIdSubscription: Subscription;
  summaryData: any;
  metaData: RangeGroupMetadata;
  rangeDistributionTypeId: number;
  modelSummaryPageViewId: string;
  summaryDataModel: any[];

  constructor(
    public store: Store<any>,
    public pfGridStore: Store<fromPfGridReducer.State>
  ) {
    this.metadataSubscription = this.store.select(fromSharedStructuresReducer.getMetadata).subscribe(md => {
      if (md) {
        this.metaData = md;
        this.rangeDistributionTypeId = md.RangeDistributionTypeId;
        this.chartOptions =
          GradeRangeModelChartService.getHeatmapOptions(this.rangeDistributionTypeId);
      }
    });
  }

  rangeChartCallback(chart: Highcharts.Chart = null) {
    // set the instance
    if (chart) {
      this.chartInstance = chart;
    }
  }

  private processChartData() {
    this.summaryDataModel = [];

    this.calculateAndFormatData();

    // set the series data
    this.chartInstance.series[GradeRangeModelChartSeries.SummaryData].setData(this.summaryDataModel, true);
  }

  private handleZeroTotalEmployees() {
    this.summaryDataModel.push({x: 0, y: 0, value: 0});

    switch (this.rangeDistributionTypeId) {
      case RangeDistributionTypeIds.MinMidMax:
      case RangeDistributionTypeIds.Quartile:
        this.summaryDataModel.push({x: 1, y: 0, value: 0});
        this.summaryDataModel.push({x: 2, y: 0, value: 0});
        this.summaryDataModel.push({x: 3, y: 0, value: 0});
        this.summaryDataModel.push({x: 4, y: 0, value: 0});
        this.summaryDataModel.push({x: 5, y: 0, value: 0});
        break;
      case RangeDistributionTypeIds.Tertile:
        this.summaryDataModel.push({x: 1, y: 0, value: 0});
        this.summaryDataModel.push({x: 2, y: 0, value: 0});
        this.summaryDataModel.push({x: 3, y: 0, value: 0});
        this.summaryDataModel.push({x: 4, y: 0, value: 0});
        break;
      case RangeDistributionTypeIds.Quintile:
        this.summaryDataModel.push({x: 1, y: 0, value: 0});
        this.summaryDataModel.push({x: 2, y: 0, value: 0});
        this.summaryDataModel.push({x: 3, y: 0, value: 0});
        this.summaryDataModel.push({x: 4, y: 0, value: 0});
        this.summaryDataModel.push({x: 5, y: 0, value: 0});
        this.summaryDataModel.push({x: 6, y: 0, value: 0});
        break;
    }
  }

  private calculatePercentage (partial) {
    return (partial / this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_NumEmployees) * 100;
  }

  private calculateAndFormatData() {
    if (this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_NumEmployees === 0) {
      this.handleZeroTotalEmployees();
      return;
    }

    // always push the 0th data point as count ee min outlier on x = 0
    this.summaryDataModel.push({
      x: 0,
      y: 0,
      value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_CountEEMinOutlier)
    });


    // the other data points depend on the distro type
    switch (this.rangeDistributionTypeId) {
      case RangeDistributionTypeIds.MinMidMax:
      case RangeDistributionTypeIds.Quartile:
        this.summaryDataModel.push({
          x: 1,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_CountEEQ1)
        });
        this.summaryDataModel.push({
          x: 2,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_CountEEQ2)
        });
        this.summaryDataModel.push({
          x: 3,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_CountEEQ3)
        });
        this.summaryDataModel.push({
          x: 4,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_CountEEQ4)
        });
        this.summaryDataModel.push({
          x: 5,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_CountEEMaxOutlier)
        });
        break;
      case RangeDistributionTypeIds.Tertile:
        this.summaryDataModel.push({
          x: 1,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_Count1st3rd)
        });
        this.summaryDataModel.push({
          x: 2,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_Count2nd3rd)
        });
        this.summaryDataModel.push({
          x: 3,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_CountTop3rd)
        });
        this.summaryDataModel.push({
          x: 4,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_CountEEMaxOutlier)
        });
        break;
      case RangeDistributionTypeIds.Quintile:
        this.summaryDataModel.push({
          x: 1,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_Count1st5th)
        });
        this.summaryDataModel.push({
          x: 2,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_Count2nd5th)
        });
        this.summaryDataModel.push({
          x: 3,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_Count3rd5th)
        });
        this.summaryDataModel.push({
          x: 4,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_Count4th5th)
        });
        this.summaryDataModel.push({
          x: 5,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_CountTop5th)
        });
        this.summaryDataModel.push({
          x: 6,
          y: 0,
          value: this.calculatePercentage(this.summaryData.CompanyStructures_RangeGroup_GradeBased_Summary_CountEEMaxOutlier)
        });
        break;
    }
  }



  ngOnInit(): void {
    this.modelSummaryPageViewId =
      PagesHelper.getModelSummaryPageViewIdByRangeDistributionType(this.metaData?.RangeDistributionTypeId);
    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.modelSummaryPageViewId).subscribe(data => {
      if (data) {
        this.summaryData = data.data[0];
        this.processChartData();
      }
    });
    StructuresHighchartsService.initializeHighcharts(true);
    setTimeout(() => {
      this.chartInstance.reflow();
    }, 0);
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
    this.pageViewIdSubscription.unsubscribe();
  }
}
