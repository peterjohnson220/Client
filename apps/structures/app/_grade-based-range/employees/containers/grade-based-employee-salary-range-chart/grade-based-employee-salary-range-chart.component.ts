import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';
import { GridDataResult, ContentScrollEvent } from '@progress/kendo-angular-grid';

import { RangeGroupMetadata } from 'libs/models/structures';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';

import * as fromSharedStructuresReducer from '../../../../shared/reducers';
import { StructuresHighchartsService, StructuresPagesService } from '../../../../shared/services';
import { GradeBasedEmployeeRangeChartService, GradeBasedEmployeeSalaryRangeChartSeries } from '../../data';
import { GraphHelper } from '../../../shared/helpers/graph.helper';
import { DataPointSeries } from '../../../../shared/models/data-point-series.model';
import { SalaryRangeSeries } from '../../../../shared/models/salary-range-series.model';
import { RangeDistributionDataPointTypeIds } from '../../../../shared/constants/range-distribution-data-point-type-ids';
import { PagesHelper } from '../../../../shared/helpers/pages.helper';

@Component({
  selector: 'pf-grade-based-employee-salary-range-chart',
  templateUrl: './grade-based-employee-salary-range-chart.component.html',
  styleUrls: ['./grade-based-employee-salary-range-chart.component.scss']
})
export class GradeBasedEmployeeSalaryRangeChartComponent implements OnInit, OnDestroy {
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
  initialY: number;
  gridScrolledSub: Subscription;

  constructor(
    public store: Store<any>,
    public pfGridStore: Store<fromPfGridReducer.State>,
    private structuresPagesService: StructuresPagesService
  ) {
    this.metadataSubscription = this.store.select(fromSharedStructuresReducer.getMetadata).subscribe(md => {
      if (md) {
        this.metaData = md;
        this.pageViewId =
          PagesHelper.getEmployeePageViewIdByRangeTypeAndRangeDistributionType(this.metaData.RangeTypeId, this.metaData.RangeDistributionTypeId);
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
          GradeBasedEmployeeRangeChartService.getGradeBasedEmployeeRangeOptions(
            this.chartLocale, this.currency, this.controlPointDisplay, this.rangeDistributionTypeId);
      }
    });

    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.pageViewId).subscribe(data => {
      if (data) {
        this.employeeData = data;
        if (this.jobRangeGroupData) {
          this.processChartData();
        }
      }
    });

    this.jobRangeViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.jobRangeViewId = pv);
    this.jobDataSubscription = this.store.select(fromPfGridReducer.getData, this.jobRangeViewId).subscribe(data => {
      if (data) {
        this.jobRangeGroupData = data;
        if (this.employeeData) {
          this.processChartData();
        }

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
  }

  rangeChartCallback(chart: Highcharts.Chart = null) {
    // set the instance
    if (chart) {
      this.chartInstance = chart;
    }
  }

  private reassessMinMax(currentRow) {
    // only do this if currentRow.vw_EmployeesGradeBasedStructureInfo_GradeBased_EmployeePay has a value
    if (currentRow.vw_EmployeesGradeBasedStructureInfo_GradeBased_EmployeePay !== null) {
      // if this employees salary is higher than the current max, set it
      if (currentRow.vw_EmployeesGradeBasedStructureInfo_GradeBased_EmployeePay > this.chartMax) {
        this.chartMax = currentRow.vw_EmployeesGradeBasedStructureInfo_GradeBased_EmployeePay;
      }
      // same logic for min but reversed, obviously
      if (currentRow.vw_EmployeesGradeBasedStructureInfo_GradeBased_EmployeePay < this.chartMin) {
        this.chartMin = currentRow.vw_EmployeesGradeBasedStructureInfo_GradeBased_EmployeePay;
      }
    }

    if (currentRow.CompanyJobs_Structures_GradeBased_Job_MarketReferencePointValue !== null) {
      if (currentRow.CompanyJobs_Structures_GradeBased_Job_MarketReferencePointValue > this.chartMax) {
        this.chartMax = currentRow.CompanyJobs_Structures_GradeBased_Job_MarketReferencePointValue;
      }
      // same logic for min but reversed, obviously
      if (currentRow.CompanyJobs_Structures_GradeBased_Job_MarketReferencePointValue < this.chartMin) {
        this.chartMin = currentRow.CompanyJobs_Structures_GradeBased_Job_MarketReferencePointValue;
      }
    }
  }

  private getScatterXCoordinate(index): number {

    return index - (.018 * index);
  }

  private addEmployee(xCoordinate, currentRow) {
    // if this employee falls within the salary range, add to employee series. else, add to outlier employee series
    const min = this.jobRangeData.CompanyStructures_Ranges_Min;
    const max = this.jobRangeData.CompanyStructures_Ranges_Max;
    const salary = currentRow.vw_EmployeesGradeBasedStructureInfo_GradeBased_EmployeePay;
    const fname = currentRow.vw_EmployeesGradeBasedStructureInfo_First_Name;
    const lname = currentRow.vw_EmployeesGradeBasedStructureInfo_Last_Name;
    const name = fname && fname.length > 0 && lname && lname.length > 0 ?
      currentRow.vw_EmployeesGradeBasedStructureInfo_First_Name + ' ' + currentRow.vw_EmployeesGradeBasedStructureInfo_Last_Name
      + ' (' + currentRow.vw_EmployeesGradeBasedStructureInfo_Employee_ID + ')' : currentRow.vw_EmployeesGradeBasedStructureInfo_Employee_ID;
    const salaryTooltipInfo = {
      x: this.getScatterXCoordinate(xCoordinate),
      y: currentRow.vw_EmployeesGradeBasedStructureInfo_GradeBased_EmployeePay,
      empDisplay: name,
      salaryDisplay: `${this.controlPointDisplay}: ${StructuresHighchartsService.formatCurrency(salary, this.chartLocale, this.currency, this.rate, true)}`
    };

    if (salary >= min && salary <= max) {
      this.employeeSeriesData.push(salaryTooltipInfo);
    } else {
      this.employeeSeriesOutlierData.push(salaryTooltipInfo);
    }
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

  private addMRPPoint(xCoordinate, currentRow) {
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
        this.addMRPPoint(i, currentRow);

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
      this.chartInstance.series[GradeBasedEmployeeSalaryRangeChartSeries.RangeMid].setData(this.dataPointSeriesDataModel.Mid, false);
      this.chartInstance.series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeMinMidMax].setData(this.salaryRangeSeriesDataModel.MinMidMax, false);
      this.chartInstance.series[GradeBasedEmployeeSalaryRangeChartSeries.EmployeePay].setData(this.employeeSeriesData, false);
      this.chartInstance.series[GradeBasedEmployeeSalaryRangeChartSeries.EmployeeOutlierPay].setData(this.employeeSeriesOutlierData, true);
      this.chartInstance.series[GradeBasedEmployeeSalaryRangeChartSeries.JobMRP].setData(this.mrpSeriesData, false);
      this.renameSeries();

      // Tertile - Quartile - Quintile: salary range + data points
      if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
        this.chartInstance.series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeTertile].setData(this.salaryRangeSeriesDataModel.Tertile, false);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
        this.chartInstance.series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileFirst]
          .setData(this.salaryRangeSeriesDataModel.Quartile.First, false);
        this.chartInstance.series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileSecond]
          .setData(this.salaryRangeSeriesDataModel.Quartile.Second, false);
        this.chartInstance.series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileThird]
          .setData(this.salaryRangeSeriesDataModel.Quartile.Third, false);
        this.chartInstance.series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuartileFourth]
          .setData(this.salaryRangeSeriesDataModel.Quartile.Fourth, false);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
        this.chartInstance.series[GradeBasedEmployeeSalaryRangeChartSeries.SalaryRangeQuintile].setData(this.salaryRangeSeriesDataModel.Quintile, false);
      }

      this.chartInstance.setSize(null, GraphHelper.getEmployeeChartHeight(this.employeeData.data));
    }
  }

  private renameSeries() {
    // 3 ==  'Employee ' + controlPointDisplay
    this.chartInstance.series[GradeBasedEmployeeSalaryRangeChartSeries.EmployeePay].name =
      GradeBasedEmployeeRangeChartService.getFormattedSeriesName(GradeBasedEmployeeSalaryRangeChartSeries.EmployeePay, this.controlPointDisplay);
  }

  private clearData(): void {
    if (this.jobRangeGroupData) {
      this.jobRangeGroupData = { ...this.jobRangeGroupData, data: [] };
    }

    if (this.employeeData) {
      this.employeeData = { ...this.employeeData, data: [] };
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
    this.gridScrolledSub.unsubscribe();
  }
}

