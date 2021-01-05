import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { RangeGroupMetadata } from 'libs/models/structures';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import { StructuresPagesService } from '../../../shared/services';
import { StructuresHighchartsService } from '../../../../shared/services';
import { EmployeeRangeChartService, EmployeeSalaryRangeChartSeries } from '../../data';
import { GraphHelper } from '../../../shared/helpers/graph.helper';
import { DataPointSeries } from '../../../shared/models/data-point-series.model';
import { RangeDistributionTypeIds } from '../../../../shared/constants/range-distribution-type-ids';
import { SalaryRangeSeries } from '../../../shared/models/salary-range-series.model';
import { RangeDistributionDataPointTypeIds } from '../../../../shared/constants/range-distribution-data-point-type-ids';
import { PagesHelper } from '../../../../shared/helpers/pages.helper';

@Component({
  selector: 'pf-employee-salary-range-chart',
  templateUrl: './employee-salary-range-chart.component.html',
  styleUrls: ['./employee-salary-range-chart.component.scss']
})
export class EmployeeSalaryRangeChartComponent implements OnInit, OnDestroy {
  @Input() rangeId: number;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  updateFlag: boolean;
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  chartMin: number;
  chartMax: number;
  salaryRangeSeriesDataModel: SalaryRangeSeries;
  dataPointSeriesDataModel: DataPointSeries;
  employeeSeriesData: any;
  employeeSeriesOutlierData: any;
  employeeAvgMrpSeriesData: any;
  mrpSeriesData: any;
  chartLocale: string; // en-US
  chartInstance: Highcharts.Chart;
  dataSubscription: Subscription;
  jobDataSubscription: Subscription;
  metadataSubscription: Subscription;
  pageViewId: string;
  jobRangeViewId: string;
  jobRangeViewIdSubscription: Subscription;
  currency: string;
  jobRangeGroupData: GridDataResult;
  employeeData: GridDataResult;
  jobRangeData: any;
  controlPointDisplay: string;
  prevControlPointDisplay: string;
  rate: string;
  isCurrent: boolean;
  hasCurrentStructure: boolean;
  metaData: RangeGroupMetadata;
  rangeDistributionTypeId: number;
  filterPanelSub: Subscription;

  constructor(
    public store: Store<any>,
    private structuresPagesService: StructuresPagesService
  ) {
    this.metadataSubscription = this.store.select(fromSharedJobBasedRangeReducer.getMetadata).subscribe(md => {
      if (md) {
        this.metaData = md;
        this.pageViewId = PagesHelper.getEmployeePageViewIdByRangeDistributionType(this.metaData.RangeDistributionTypeId);
        this.isCurrent = md.IsCurrent;
        this.rate = md.Rate;
        this.currency = md.Currency;
        this.prevControlPointDisplay = this.controlPointDisplay;
        this.controlPointDisplay = md.ControlPointDisplay;
        this.rate = md.Rate;
        this.chartLocale = getUserLocale();
        this.rangeDistributionTypeId = md.RangeDistributionTypeId;
        this.clearData();
        this.chartOptions =
          EmployeeRangeChartService.getEmployeeRangeOptions(this.chartLocale, this.currency, this.controlPointDisplay, this.rangeDistributionTypeId);
      }
    });

    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.pageViewId).subscribe(data => {
      if (data) {
        this.employeeData = data;
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

  private addEmployee(xCoordinate, currentRow) {
    // if this employee falls within the salary range, add to employee series. else, add to outlier employee series
    const min = this.jobRangeData.CompanyStructures_Ranges_Min;
    const max = this.jobRangeData.CompanyStructures_Ranges_Max;
    const salary = currentRow.CompanyEmployees_EEMRPForStructureRangeGroup;
    const fname = currentRow.CompanyEmployees_First_Name;
    const lname = currentRow.CompanyEmployees_Last_Name;
    const name = fname && fname.length > 0 && lname && lname.length > 0 ? currentRow.CompanyEmployees_First_Name + ' ' + currentRow.CompanyEmployees_Last_Name
      + ' (' + currentRow.CompanyEmployees_Employee_ID + ')' : currentRow.CompanyEmployees_Employee_ID;
    const salaryTooltipInfo = {
      x: xCoordinate,
      y: currentRow.CompanyEmployees_EEMRPForStructureRangeGroup,
      empDisplay: name,
      salaryDisplay: `${this.controlPointDisplay}: ${StructuresHighchartsService.formatCurrency(salary, this.chartLocale, this.currency, this.rate, true)}`
    };

    if (salary >= min && salary <= max) {
      this.employeeSeriesData.push(salaryTooltipInfo);
    } else {
      this.employeeSeriesOutlierData.push(salaryTooltipInfo);
    }

    this.employeeAvgMrpSeriesData.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyStructures_RangeGroup_AverageEEMRP,
      jobTitle: this.jobRangeData.CompanyJobs_Job_Title,
      avgComparatio: this.jobRangeData.CompanyStructures_RangeGroup_AverageComparatio,
      avgPositioninRange: this.jobRangeData.CompanyStructures_RangeGroup_AveragePositionInRange,
      avgSalary: `
        ${this.controlPointDisplay}:
        ${StructuresHighchartsService
        .formatCurrency(this.jobRangeData.CompanyStructures_RangeGroup_AverageEEMRP, this.chartLocale, this.currency, this.rate, true)}
      `
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
    if (this.jobRangeGroupData && this.jobRangeGroupData.data.length && this.employeeData && this.employeeData.data.length) {
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

      this.employeeSeriesData = [];
      this.employeeSeriesOutlierData = [];
      this.employeeAvgMrpSeriesData = [];
      this.mrpSeriesData = [];

      this.chartMin = StructuresHighchartsService.getChartMin(this.jobRangeData, this.rangeDistributionTypeId);
      this.chartMax = StructuresHighchartsService.getChartMax(this.jobRangeData, this.rangeDistributionTypeId);

      // then we need to loop through and plot employee data
      for (let i = 0; i < this.employeeData.data.length; i++) {
        const currentRow = this.employeeData.data[i];

        // if the current employees salary is below the min or above the max, set those values accordingly
        this.reassessMinMax(currentRow);

        // add employee plot points
        this.addEmployee(i, currentRow);

        // always add to salary range group
        this.addSalaryRangeMinMidMax(i);

        // always add to midPoint
        this.addMidPoint(i);

        // always add to MRP
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

      // set the series data
      this.chartInstance.series[EmployeeSalaryRangeChartSeries.RangeMid].setData(this.dataPointSeriesDataModel.Mid, false);
      this.chartInstance.series[EmployeeSalaryRangeChartSeries.SalaryRangeMinMidMax].setData(this.salaryRangeSeriesDataModel.MinMidMax, false);
      this.chartInstance.series[EmployeeSalaryRangeChartSeries.Average].setData(this.employeeAvgMrpSeriesData, true);
      this.chartInstance.series[EmployeeSalaryRangeChartSeries.Employee].setData(this.employeeSeriesData, false);
      this.chartInstance.series[EmployeeSalaryRangeChartSeries.EmployeeOutliers].setData(this.employeeSeriesOutlierData, true);
      this.chartInstance.series[EmployeeSalaryRangeChartSeries.MRP].setData(this.mrpSeriesData, false);
      this.renameSeries();

      // Tertile - Quartile - Quintile: salary range + data points
      if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.SalaryRangeTertile].setData(this.salaryRangeSeriesDataModel.Tertile, false);
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.RangeTertileFirst].setData(this.dataPointSeriesDataModel.TertileFirst, false);
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.RangeTertileSecond].setData(this.dataPointSeriesDataModel.TertileSecond, false);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst].setData(this.salaryRangeSeriesDataModel.Quartile.First, false);
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartileSecond].setData(this.salaryRangeSeriesDataModel.Quartile.Second, false);
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartileThird].setData(this.salaryRangeSeriesDataModel.Quartile.Third, false);
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartileFourth].setData(this.salaryRangeSeriesDataModel.Quartile.Fourth, false);
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.RangeQuartileFirst].setData(this.dataPointSeriesDataModel.QuartileFirst, false);
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.RangeQuartileSecond].setData(this.dataPointSeriesDataModel.QuartileSecond, false);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.SalaryRangeQuintile].setData(this.salaryRangeSeriesDataModel.Quintile, false);
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.RangeQuintileFirst].setData(this.dataPointSeriesDataModel.QuintileFirst, false);
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.RangeQuintileSecond].setData(this.dataPointSeriesDataModel.QuintileSecond, false);
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.RangeQuintileThird].setData(this.dataPointSeriesDataModel.QuintileThird, false);
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.RangeQuintileFourth].setData(this.dataPointSeriesDataModel.QuintileFourth, false);
      }

      this.chartInstance.setSize(null, GraphHelper.getChartHeight(this.employeeData.data));
    }
  }

  private renameSeries() {
    // 2 ==  'Average ' + controlPointDisplay
    this.chartInstance.series[EmployeeSalaryRangeChartSeries.Average].name =
      EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.Average, this.controlPointDisplay);
    // 3 ==  'Employee ' + controlPointDisplay
    this.chartInstance.series[EmployeeSalaryRangeChartSeries.Employee].name =
      EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.Employee, this.controlPointDisplay);
  }

  private clearData(): void {
    if (this.jobRangeGroupData) {
      this.jobRangeGroupData = {...this.jobRangeGroupData, data: []};
    }

    if (this.employeeData) {
      this.employeeData = {...this.employeeData, data: []};
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
    this.dataSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
    this.jobDataSubscription.unsubscribe();
    this.jobRangeViewIdSubscription.unsubscribe();
    this.filterPanelSub.unsubscribe();
  }
}

