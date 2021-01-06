import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';

import { JobBasedPageViewIds, RangeGroupMetadata } from 'libs/models/structures';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { appendOrdinalSuffix } from 'libs/core/functions';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import { StructuresHighchartsService } from '../../../../shared/services/structures-highcharts-service';
import { PricingsSalaryRangeChartSeries, PricingsSalaryRangeChartService } from '../../data';
import { PricingMatchHelper } from '../../helpers';
import { GraphHelper } from '../../../shared/helpers/graph.helper';
import { SalaryRangeSeries } from '../../../shared/models/salary-range-series.model';
import { DataPointSeries } from '../../../shared/models/data-point-series.model';
import { RangeDistributionTypeIds } from '../../../../shared/constants/range-distribution-type-ids';
import { RangeDistributionDataPointTypeIds } from '../../../../shared/constants/range-distribution-data-point-type-ids';
import { StructuresPagesService } from '../../../../shared/services';

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
  salaryRangeSeriesDataModel: SalaryRangeSeries;
  dataPointSeriesDataModel: DataPointSeries;
  pricingsSeriesData: any;
  chartLocale: string; // en-US
  chartInstance: Highcharts.Chart;
  dataSubscription: Subscription;
  jobDataSubscription: Subscription;
  metadataSubscription: Subscription;
  pageViewId = JobBasedPageViewIds.Pricings;
  jobRangeViewId: string;
  jobRangeViewIdSubscription: Subscription;
  currency: string;
  jobRangeGroupData: any;
  pricingsData: any;
  jobRangeData: any;
  mrpSeriesData: any;
  controlPointDisplay: string;
  rate: string;
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
        this.currency = md.Currency;
        this.controlPointDisplay = md.ControlPointDisplay;
        this.rate = md.Rate;
        this.chartLocale = getUserLocale();
        this.rangeDistributionTypeId = md.RangeDistributionTypeId;
        this.clearData();
        this.chartOptions =
          PricingsSalaryRangeChartService.getPricingsRangeOptions(this.chartLocale, this.currency, this.controlPointDisplay, this.rangeDistributionTypeId);
      }
    });

    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.pageViewId).subscribe(data => {
      if (data) {
        this.pricingsData = data;
        this.processChartData();
      }
    });

    this.jobRangeViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.jobRangeViewId = pv);
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

  private reassessMinMax(currentRow) {
    // if this jobs pricings match MRP is higher than the current max, set it
    if (currentRow.CompanyJobs_PricingsMatches_CompanyJobPricingsMatchMRPStructureRangeGroup > this.chartMax) {
      this.chartMax = currentRow.CompanyJobs_PricingsMatches_CompanyJobPricingsMatchMRPStructureRangeGroup;
    }
    // same logic for min but reversed, obviously
    if (currentRow.CompanyJobs_PricingsMatches_CompanyJobPricingsMatchMRPStructureRangeGroup < this.chartMin) {
      this.chartMin = currentRow.CompanyJobs_PricingsMatches_CompanyJobPricingsMatchMRPStructureRangeGroup;
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
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.Mid, this.jobRangeData, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );
  }

  private addTertilePoint(xCoordinate) {
    this.dataPointSeriesDataModel.TertileFirst.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.TertileFirst, this.jobRangeData, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.TertileSecond.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.TertileSecond, this.jobRangeData, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );
  }

  private addQuartilePoint(xCoordinate) {
    this.dataPointSeriesDataModel.QuartileFirst.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.QuartileFirst, this.jobRangeData, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuartileSecond.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.QuartileSecond, this.jobRangeData, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );
  }

  private addQuintilePoint(xCoordinate) {
    this.dataPointSeriesDataModel.QuintileFirst.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.QuintileFirst, this.jobRangeData, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuintileSecond.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.QuintileSecond, this.jobRangeData, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuintileThird.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.QuintileThird, this.jobRangeData, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );

    this.dataPointSeriesDataModel.QuintileFourth.push(
      StructuresHighchartsService.getDataPoint(xCoordinate, RangeDistributionDataPointTypeIds.QuintileFourth, this.jobRangeData, this.hasCurrentStructure,
        this.chartLocale, this.metaData)
    );
  }

  private addMRPPoint(xCoordinate) {
    const isMidFormula = !!this.metaData.RangeDistributionSetting?.Mid_Formula?.FormulaId;

    this.mrpSeriesData.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyStructures_RangeGroup_MarketReferencePointValue,
      jobTitle: this.jobRangeData.CompanyJobs_Job_Title,
      mrp: StructuresHighchartsService.formatMrpTooltip(this.jobRangeData.CompanyStructures_RangeGroup_MarketReferencePointValue,
        this.jobRangeData.CompanyStructures_RangeGroup_MrpPercentile, isMidFormula, !!this.metaData?.PayType ? this.metaData.PayType : 'Base',
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

  private processChartData() {
    // make sure all the proper data is present. If not present, don't do anything yet. this is because we can't control the order in which both datasets appear
    if (this.jobRangeGroupData && this.jobRangeGroupData.data.length && this.pricingsData && this.pricingsData.data.length) {
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
        TertileFirst: [],
        TertileSecond: [],
        QuartileFirst: [],
        QuartileSecond: [],
        QuintileFirst: [],
        QuintileSecond: [],
        QuintileThird: [],
        QuintileFourth: [],
      };

      this.pricingsSeriesData = [];
      this.mrpSeriesData = [];

      this.chartMin = StructuresHighchartsService.getChartMin(this.jobRangeData, this.rangeDistributionTypeId);
      this.chartMax = StructuresHighchartsService.getChartMax(this.jobRangeData, this.rangeDistributionTypeId);

      // then we need to loop through and plot pricings data
      for (let i = 0; i < this.pricingsData.data.length; i++) {
        const currentRow = this.pricingsData.data[i];

        // if the current employees salary is below the min or above the max, set those values accordingly
        this.reassessMinMax(currentRow);

        // add pricing plot points
        this.addPricingsMRP(i, currentRow, this.jobRangeData);

        // always add to salary range group
        this.addSalaryRangeMinMidMax(i);

        // always add to midPoint
        this.addMidPoint(i);

        this.addMRPPoint(i);

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
      }

      // set the min/max
      this.chartInstance.yAxis[0].setExtremes(this.chartMin, this.chartMax, false);

      this.updateChartLabels();
      this.chartInstance.series[PricingsSalaryRangeChartSeries.RangeMid].setData(this.dataPointSeriesDataModel.Mid, false);
      this.chartInstance.series[PricingsSalaryRangeChartSeries.SalaryRangeMinMidMax].setData(this.salaryRangeSeriesDataModel.MinMidMax, false);
      this.chartInstance.series[PricingsSalaryRangeChartSeries.Pricings].setData(this.pricingsSeriesData, true);
      this.chartInstance.series[PricingsSalaryRangeChartSeries.MRP].setData(this.mrpSeriesData, false);
      this.renameSeries();

      // Tertile - Quartile - Quintile: salary range + data points
      if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
        this.chartInstance.series[PricingsSalaryRangeChartSeries.SalaryRangeTertile].setData(this.salaryRangeSeriesDataModel.Tertile, false);
        this.chartInstance.series[PricingsSalaryRangeChartSeries.RangeTertileFirst].setData(this.dataPointSeriesDataModel.TertileFirst, false);
        this.chartInstance.series[PricingsSalaryRangeChartSeries.RangeTertileSecond].setData(this.dataPointSeriesDataModel.TertileSecond, false);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
        this.chartInstance.series[PricingsSalaryRangeChartSeries.SalaryRangeQuartileFirst].setData(this.salaryRangeSeriesDataModel.Quartile.First, false);
        this.chartInstance.series[PricingsSalaryRangeChartSeries.SalaryRangeQuartileSecond].setData(this.salaryRangeSeriesDataModel.Quartile.Second, false);
        this.chartInstance.series[PricingsSalaryRangeChartSeries.SalaryRangeQuartileThird].setData(this.salaryRangeSeriesDataModel.Quartile.Third, false);
        this.chartInstance.series[PricingsSalaryRangeChartSeries.SalaryRangeQuartileFourth].setData(this.salaryRangeSeriesDataModel.Quartile.Fourth, false);
        this.chartInstance.series[PricingsSalaryRangeChartSeries.RangeQuartileFirst].setData(this.dataPointSeriesDataModel.QuartileFirst, false);
        this.chartInstance.series[PricingsSalaryRangeChartSeries.RangeQuartileSecond].setData(this.dataPointSeriesDataModel.QuartileSecond, false);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
        this.chartInstance.series[PricingsSalaryRangeChartSeries.SalaryRangeQuintile].setData(this.salaryRangeSeriesDataModel.Quintile, false);
        this.chartInstance.series[PricingsSalaryRangeChartSeries.RangeQuintileFirst].setData(this.dataPointSeriesDataModel.QuintileFirst, false);
        this.chartInstance.series[PricingsSalaryRangeChartSeries.RangeQuintileSecond].setData(this.dataPointSeriesDataModel.QuintileSecond, false);
        this.chartInstance.series[PricingsSalaryRangeChartSeries.RangeQuintileThird].setData(this.dataPointSeriesDataModel.QuintileThird, false);
        this.chartInstance.series[PricingsSalaryRangeChartSeries.RangeQuintileFourth].setData(this.dataPointSeriesDataModel.QuintileFourth, false);
      }

      this.chartInstance.setSize(null, GraphHelper.getChartHeight(this.pricingsData.data, true));
    }
  }

  private renameSeries() {
    // 1 ==  'Pricings ' + controlPointDisplay
    this.chartInstance.series[PricingsSalaryRangeChartSeries.Pricings].name =
      PricingsSalaryRangeChartService.getFormattedSeriesName(PricingsSalaryRangeChartSeries.Pricings, this.controlPointDisplay);
  }

  private clearData(): void {
    if (this.jobRangeGroupData) {
      this.jobRangeGroupData = {...this.jobRangeGroupData, data: []};
    }

    if (this.pricingsData) {
      this.pricingsData = {...this.pricingsData, data: []};
    }
  }

  ngOnInit(): void {
    StructuresHighchartsService.initializeHighcharts();
    Highcharts.SVGRenderer.prototype.symbols.vline =
      function (x, y, width, height) {
        return ['M', x, y + width / 2, 'L', x + height, y + width / 2];
      };
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
    this.jobDataSubscription.unsubscribe();
    this.jobRangeViewIdSubscription.unsubscribe();
  }
}
