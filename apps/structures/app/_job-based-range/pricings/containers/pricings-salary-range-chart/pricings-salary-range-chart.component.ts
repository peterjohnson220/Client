import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';

import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import { StructuresHighchartsService } from '../../../shared/services';
import { PageViewIds } from '../../../shared/constants/page-view-ids';
import { PricingsSalaryRangeChartOptionsService } from '../../data';


@Component({
  selector: 'pf-pricings-salary-range-chart',
  templateUrl: './pricings-salary-range-chart.component.html',
  styleUrls: ['./pricings-salary-range-chart.component.scss']
})
export class PricingsSalaryRangeChartComponent implements OnInit, OnDestroy {
  @Input() rangeId: number;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  updateFlag: boolean;
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  chartMin: number;
  chartMax: number;
  salaryRangeSeriesData: any;
  pricingsSeriesData: any;
  chartLocale: string; // en-US
  chartInstance: Highcharts.Chart;
  dataSubscription: Subscription;
  jobDataSubscription: Subscription;
  metadataSubscription: Subscription;
  pageViewId = PageViewIds.Pricings;
  jobRangeViewId = PageViewIds.Model;
  currency: string;
  jobRangeGroupData: any;
  pricingsData: any;
  jobRangeData: any;
  controlPointDisplay: string;
  plotLinesAndBands: any;

  constructor(
    public store: Store<any>,
    private route: ActivatedRoute
  ) {
    this.metadataSubscription = this.store.select(fromSharedJobBasedRangeReducer.getMetadata).subscribe(md => {
      if (md) {
        this.currency = md.Currency;
        this.controlPointDisplay = md.ControlPointDisplay;
        this.chartLocale = getUserLocale();
        this.clearData();
        this.chartOptions = PricingsSalaryRangeChartOptionsService.getPricingsRangeOptions(this.chartLocale, this.currency, this.controlPointDisplay);
      }
    });
    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.pageViewId).subscribe(data => {
      if (data) {
        this.pricingsData = data;
        this.processChartData();
      }
    });
    this.jobDataSubscription = this.store.select(fromPfGridReducer.getData, this.jobRangeViewId).subscribe(data => {
      if (data) {
        this.jobRangeGroupData = data;
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

  private setInitialMinMax(currentRange) {
    this.chartMin = currentRange.CompanyStructures_Ranges_Min;
    this.chartMax = currentRange.CompanyStructures_Ranges_Max;
  }

  private reassessMinMax(currentRow) {
    // if we somehow don't have a chart max OR this jobs pricings match MRP is higher than the current max, set it
    if (!this.chartMax || (currentRow.CompanyJobs_PricingsMatches_CompanyJobPricingsMatchMRPStructureRangeGroup > this.chartMax)) {
      this.chartMax = currentRow.CompanyJobs_PricingsMatches_CompanyJobPricingsMatchMRPStructureRangeGroup;
    }
    // same logic for min but reversed, obviously
    if (!this.chartMin || (currentRow.CompanyJobs_PricingsMatches_CompanyJobPricingsMatchMRPStructureRangeGroup < this.chartMin)) {
      this.chartMin = currentRow.CompanyJobs_PricingsMatches_CompanyJobPricingsMatchMRPStructureRangeGroup;
    }
  }

  private clearData(): void {
    if (this.jobRangeGroupData) {
      this.jobRangeGroupData = {...this.jobRangeGroupData, data: []};
    }

    if (this.pricingsData) {
      this.pricingsData = {...this.pricingsData, data: []};
    }
  }

  private renameSeries() {
    // 1 ==  'Pricings ' + controlPointDisplay
    this.chartInstance.series[1].name = 'Pricings ' + this.controlPointDisplay;
  }

  private addPricingsMRP(xCoordinate, currentRow, jobRangeData) {
    this.pricingsSeriesData.push({ x: xCoordinate, y: currentRow.CompanyJobs_PricingsMatches_CompanyJobPricingsMatchMRPStructureRangeGroup});

  }

  private addSalaryBand() {
    this.chartInstance.yAxis[0].addPlotBand(this.plotLinesAndBands.find(plb => plb.id === 'Salary range'));
  }

  private processChartData() {
    this.removeLinesAndBands();
    // make sure all the proper data is present. If not present, don't do anything yet. this is because we can't control the order in which both datasets appear
    if (this.jobRangeGroupData && this.jobRangeGroupData.data.length && this.pricingsData && this.pricingsData.data.length) {
      // first we need to plot anything that applies to the chart as a whole, including salary range, midpoint and avg

      this.jobRangeData = this.jobRangeGroupData.data.find(jr => jr.CompanyStructures_Ranges_CompanyStructuresRanges_ID === this.rangeId);

      this.plotLinesAndBands = [
        {
          id: 'Salary range',
          from: this.jobRangeData.CompanyStructures_Ranges_Min,
          to: this.jobRangeData.CompanyStructures_Ranges_Max,
          color: 'rgba(36,134,210,0.45)',
          zIndex: 0
        }
      ];

      this.pricingsSeriesData = [];

      this.setInitialMinMax(this.jobRangeData);

      this.addSalaryBand();

      // then we need to loop through and plot pricings data
      for (let i = 0; i < this.pricingsData.data.length; i++) {
        const currentRow = this.pricingsData.data[i];

        // if the current employees salary is below the min or above the max, set those values accordingly
        this.reassessMinMax(currentRow);

        // add pricing plot points
        this.addPricingsMRP(i, currentRow, this.jobRangeData);

      }

      // set the min/max
      this.chartInstance.yAxis[0].setExtremes(this.chartMin, this.chartMax, false);
      this.chartInstance.series[0].setData(this.salaryRangeSeriesData, false);
      this.chartInstance.series[1].setData(this.pricingsSeriesData, true);

      this.renameSeries();

      // store the plotLinesAndBands in one of the unused chart properties so we can access it
      this.chartInstance.collectionsWithUpdate = this.plotLinesAndBands;

      // this seemed like a pretty good way to get things to line up. 65 is a constant to account for gaps and headers, the rest is dynamic based on rows
      this.chartInstance.setSize(null, (50 * this.pricingsData.data.length));
    }
  }

  private removeLinesAndBands() {
    if (this.plotLinesAndBands) {
      this.chartInstance.yAxis[0].removePlotBand('Salary range');
    }
  }

  ngOnInit(): void {
    StructuresHighchartsService.initializeHighcharts();
    Highcharts.SVGRenderer.prototype.symbols.vline =
      function(x, y, width, height) {
        return ['M', x, y + width / 2, 'L', x + height, y + width / 2];
      };
  }



  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
    this.jobDataSubscription.unsubscribe();
  }

}
