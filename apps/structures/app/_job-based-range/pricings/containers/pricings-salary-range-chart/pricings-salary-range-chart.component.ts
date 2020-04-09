import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';

import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import { appendOrdinalSuffix } from 'libs/core/functions';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import { StructuresHighchartsService } from '../../../shared/services';
import { PageViewIds } from '../../../shared/constants/page-view-ids';
import { PricingsSalaryRangeChartSeries, PricingsSalaryRangeChartService } from '../../data';
import { PricingMatchHelper } from '../../helpers';


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
  rate: string;

  constructor(
    public store: Store<any>,
    private route: ActivatedRoute
  ) {
    this.metadataSubscription = this.store.select(fromSharedJobBasedRangeReducer.getMetadata).subscribe(md => {
      if (md) {
        this.currency = md.Currency;
        this.controlPointDisplay = md.ControlPointDisplay;
        this.rate = md.Rate;
        this.chartLocale = getUserLocale();
        this.clearData();
        this.chartOptions = PricingsSalaryRangeChartService.getPricingsRangeOptions(this.chartLocale, this.currency, this.controlPointDisplay, this.rate);
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
    this.chartInstance.series[PricingsSalaryRangeChartSeries.Pricings].name =
      PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.Pricings, this.controlPointDisplay);
  }

  private addPricingsMRP(xCoordinate, currentRow, jobRangeData) {
    const {vendor, title} = PricingMatchHelper.splitPricingMatchSource(currentRow.vw_PricingMatchesJobTitlesMerged_Source);
    const formattedDate = formatDate(currentRow.vw_PricingMatchesJobTitlesMerged_Effective_Date, 'MM/dd/yyyy', this.chartLocale);
    const mrpLabel = `${this.controlPointDisplay} ${appendOrdinalSuffix(currentRow.CompanyStructures_RangeGroup_MRPRefPtStructureRangeGroup)}`;
    this.pricingsSeriesData.push({
      x: xCoordinate,
      y: currentRow.CompanyJobs_PricingsMatches_CompanyJobPricingsMatchMRPStructureRangeGroup,
      salary: StructuresHighchartsService.formatCurrency(currentRow.CompanyJobs_PricingsMatches_CompanyJobPricingsMatchMRPStructureRangeGroup,
        this.chartLocale, this.currency, this.rate, true),
      vendor: vendor,
      titleAndEffectiveDate: (title ? title + ' - ' : '') + formattedDate,
      mrpLabel: mrpLabel
    });

  }

  private addSalaryBand() {
    this.chartInstance.yAxis[0].addPlotBand(this.plotLinesAndBands.find(plb => plb.id === 'Salary range'));
  }

  private updateChartLabels() {
    const locale = this.chartLocale;
    const currencyCode = this.currency;
    const rate = this.rate;
    this.chartInstance.yAxis[0].update({
      labels: {
        formatter: function() {
          return StructuresHighchartsService.formatYAxisLabel(this.value, locale, currencyCode, rate);
        }
      }
    }, false);
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

      this.updateChartLabels();

      this.chartInstance.series[PricingsSalaryRangeChartSeries.SalaryRange].setData(this.salaryRangeSeriesData, false);
      this.chartInstance.series[PricingsSalaryRangeChartSeries.Pricings].setData(this.pricingsSeriesData, true);

      this.renameSeries();

      // store the plotLinesAndBands in one of the unused chart properties so we can access it
      this.chartInstance.collectionsWithUpdate = this.plotLinesAndBands;

      // TODO: We need to find a better way to come up with the correct height of the graph
      this.chartInstance.setSize(null, this.pricingsData.data.length > 1 ? (90 * this.pricingsData.data.length) : 114);
    }
  }

  private removeLinesAndBands() {
    if (this.plotLinesAndBands) {
      this.chartInstance.yAxis[0].removePlotBand(PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.SalaryRange));
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
