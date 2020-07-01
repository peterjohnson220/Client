import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';
import { GridDataResult } from '@progress/kendo-angular-grid';

import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import { StructuresHighchartsService, StructuresPagesService } from '../../../shared/services';
import { PageViewIds } from '../../../shared/constants/page-view-ids';
import { EmployeeRangeChartService, EmployeeSalaryRangeChartSeries } from '../../data';
import { GraphHelper } from '../../../shared/helpers/graph.helper';
import { RangeGroupMetadata } from '../../../shared/models';

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
  employeeSeriesData: any;
  employeeSeriesOutlierData: any;
  employeeAvgMrpSeriesData: any;
  midPointSeries: any;
  chartLocale: string; // en-US
  chartInstance: Highcharts.Chart;
  dataSubscription: Subscription;
  jobDataSubscription: Subscription;
  metadataSubscription: Subscription;
  pageViewId = PageViewIds.Employees;
  jobRangeViewId: string;
  jobRangeViewIdSubscription: Subscription;
  currency: string;
  jobRangeGroupData: GridDataResult;
  employeeData: GridDataResult;
  jobRangeData: any;
  controlPointDisplay: string;
  prevControlPointDisplay: string;
  plotLinesAndBands: any;
  rate: string;
  isCurrent: boolean;
  hasCurrentStructure: boolean;
  metaData: RangeGroupMetadata;

  constructor(
    public store: Store<any>,
    private structuresPagesService: StructuresPagesService
  ) {
    this.metadataSubscription = this.store.select(fromSharedJobBasedRangeReducer.getMetadata).subscribe(md => {
      if (md) {
        this.metaData = md;
        this.isCurrent = md.IsCurrent;
        this.rate = md.Rate;
        this.currency = md.Currency;
        this.prevControlPointDisplay = this.controlPointDisplay;
        this.controlPointDisplay = md.ControlPointDisplay;
        this.rate = md.Rate;
        this.chartLocale = getUserLocale();
        this.clearData();
        this.chartOptions = EmployeeRangeChartService.getEmployeeRangeOptions(this.chartLocale, this.currency, this.controlPointDisplay, this.rate);
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

  private setInitialMinMax(currentRange) {
    this.chartMin = currentRange.CompanyStructures_Ranges_Min;
    this.chartMax = currentRange.CompanyStructures_Ranges_Max;
  }

  private reassessMinMax(currentRow) {
    // only do this if currentRow.CompanyEmployees_EEMRPForStructureRangeGroup has a value
    if (currentRow.CompanyEmployees_EEMRPForStructureRangeGroup) {
      // if we somehow don't have a chart max OR this employees salary is higher than the current max, set it
      if (!this.chartMax || (currentRow.CompanyEmployees_EEMRPForStructureRangeGroup > this.chartMax)) {
        this.chartMax = currentRow.CompanyEmployees_EEMRPForStructureRangeGroup;
      }
      // same logic for min but reversed, obviously
      if (!this.chartMin || (currentRow.CompanyEmployees_EEMRPForStructureRangeGroup < this.chartMin)) {
        this.chartMin = currentRow.CompanyEmployees_EEMRPForStructureRangeGroup;
      }
    }
  }

  private addEmployee(xCoordinate, currentRow, jobRangeData) {
    // if this employee falls within the salary range, add to employee series. else, add to outlier employee series
    const min = jobRangeData.CompanyStructures_Ranges_Min;
    const max = jobRangeData.CompanyStructures_Ranges_Max;
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
      y: jobRangeData.CompanyStructures_RangeGroup_AverageEEMRP,
      jobTitle: jobRangeData.CompanyJobs_Job_Title,
      avgComparatio: jobRangeData.CompanyStructures_RangeGroup_AverageComparatio,
      avgPositioninRange: jobRangeData.CompanyStructures_RangeGroup_AveragePositionInRange,
      avgSalary: `
        ${this.controlPointDisplay}:
        ${StructuresHighchartsService.formatCurrency(jobRangeData.CompanyStructures_RangeGroup_AverageEEMRP, this.chartLocale, this.currency, this.rate, true)}
      `
    });

    this.hasCurrentStructure = jobRangeData.CompanyStructures_RangeGroup_CurrentStructureMidPoint === null;
    const delta = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      jobRangeData.CompanyStructures_Ranges_Mid, jobRangeData.CompanyStructures_RangeGroup_CurrentStructureMidPoint);

    this.midPointSeries.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyStructures_Ranges_Mid,
      jobTitle: jobRangeData.CompanyJobs_Job_Title,
      midPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Midpoint',
        jobRangeData.CompanyStructures_Ranges_Mid, this.chartLocale, this.metaData),
      currentMidPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Mid',
        jobRangeData.CompanyStructures_RangeGroup_CurrentStructureMidPoint, this.chartLocale, this.metaData),
      newMidPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Mid',
        jobRangeData.CompanyStructures_Ranges_Mid, this.chartLocale, this.metaData),
      delta: !!delta ? delta.message : delta,
      icon: !!delta ? delta.icon : delta,
      iconColor: !!delta ? delta.color : delta
    });
  }

  private addMidpointLine() {
    this.chartInstance.yAxis[0].addPlotLine(this.plotLinesAndBands
      .find(plb => plb.id === EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeMid)));
  }

  private addAverageLine() {
    this.chartInstance.yAxis[0].addPlotLine(this.plotLinesAndBands
      .find(plb => plb.id === EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.Average, this.controlPointDisplay)));
  }

  private addSalaryBand() {
    this.chartInstance.yAxis[0]
      .addPlotBand(this.plotLinesAndBands.find(plb => plb.id === EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.SalaryRange)));
  }

  private removeLinesAndBands() {
    if (this.plotLinesAndBands) {
      this.chartInstance.yAxis[0]
        .removePlotBand(EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.SalaryRange));
      this.chartInstance.yAxis[0]
        .removePlotLine(EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeMid));
      this.chartInstance.yAxis[0]
        .removePlotLine(EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.Average, this.controlPointDisplay));
    }
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
    if (this.jobRangeGroupData && this.jobRangeGroupData.data.length &&  this.employeeData && this.employeeData.data.length) {
      // first we need to plot anything that applies to the chart as a whole, including salary range, midpoint and avg
      this.jobRangeData = this.jobRangeGroupData.data.find(jr => jr.CompanyStructures_Ranges_CompanyStructuresRanges_ID === this.rangeId);

      this.plotLinesAndBands = [
        {
          color: '#CD8C01',
          id: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.RangeMid),
          width: 2,
          value: this.jobRangeData.CompanyStructures_Ranges_Mid,
          zIndex: 3
        },
        {
          color: '#6236FF',
          id: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.Average, this.controlPointDisplay),
          width: 2,
          value: this.jobRangeData.CompanyStructures_RangeGroup_AverageEEMRP,
          zIndex: 3
        },
        {
          id: EmployeeRangeChartService.getFormattedSeriesName(EmployeeSalaryRangeChartSeries.SalaryRange),
          from: this.jobRangeData.CompanyStructures_Ranges_Min,
          to: this.jobRangeData.CompanyStructures_Ranges_Max,
          color: 'rgba(36,134,210,0.45)',
          zIndex: 0
        }
      ];

      this.employeeSeriesData = [];
      this.employeeSeriesOutlierData = [];
      this.employeeAvgMrpSeriesData = [];
      this.midPointSeries = [];

      this.setInitialMinMax(this.jobRangeData);

      this.addMidpointLine();

      this.addAverageLine();

      this.addSalaryBand();

      // then we need to loop through and plot employee data
      for (let i = 0; i < this.employeeData.data.length; i++) {
        const currentRow = this.employeeData.data[i];

        // if the current employees salary is below the min or above the max, set those values accordingly
        this.reassessMinMax(currentRow);

        // add employee plot points
        this.addEmployee(i, currentRow, this.jobRangeData);
      }

      // set the min/max
      this.chartInstance.yAxis[0].setExtremes(this.chartMin, this.chartMax, false);

      this.updateChartLabels();

      // set the series data
      this.chartInstance.series[EmployeeSalaryRangeChartSeries.RangeMidHidden].setData(this.midPointSeries, false);
      this.chartInstance.series[EmployeeSalaryRangeChartSeries.AverageHidden].setData(this.employeeAvgMrpSeriesData, false);
      this.chartInstance.series[EmployeeSalaryRangeChartSeries.Employee].setData(this.employeeSeriesData, false);
      this.chartInstance.series[EmployeeSalaryRangeChartSeries.EmployeeOutliers].setData(this.employeeSeriesOutlierData, true);
      this.renameSeries();

      // store the plotLinesAndBands in one of the unused chart properties so we can access it
      this.chartInstance.collectionsWithUpdate = this.plotLinesAndBands;

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
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
    this.jobDataSubscription.unsubscribe();
    this.jobRangeViewIdSubscription.unsubscribe();
  }
}
