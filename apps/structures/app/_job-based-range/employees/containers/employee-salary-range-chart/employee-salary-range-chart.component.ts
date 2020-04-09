import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';
import { GridDataResult } from '@progress/kendo-angular-grid';

import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import { StructuresHighchartsService } from '../../../shared/services';
import { PageViewIds } from '../../../shared/constants/page-view-ids';
import { EmployeeRangeChartService } from '../../data';

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
  jobRangeViewId = PageViewIds.Model;
  currency: string;
  jobRangeGroupData: GridDataResult;
  employeeData: GridDataResult;
  jobRangeData: any;
  controlPointDisplay: string;
  prevControlPointDisplay: string;
  plotLinesAndBands: any;
  rate: string;
  isCurrent: boolean;

  constructor(
    public store: Store<any>
  ) {
    this.metadataSubscription = this.store.select(fromSharedJobBasedRangeReducer.getMetadata).subscribe(md => {
      if (md) {
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

  private formatMidPoint(isCurrent, midPointType, value) {
    return isCurrent ? StructuresHighchartsService.formatMidPoint(midPointType, value, this.chartLocale, this.currency, this.rate) : null;
  }

  private formatMidPointDelta(currentRow) {
    return this.isCurrent === false ? StructuresHighchartsService.formatDeltaInMidPointForExistingStruct(
      currentRow.CompanyStructures_Ranges_Mid,
      currentRow.CompanyStructures_RangeGroup_CurrentStructureMidPoint,
      this.chartLocale, this.currency, this.rate) : null;
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

    const delta = this.formatMidPointDelta(jobRangeData);

    this.midPointSeries.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyStructures_Ranges_Mid,
      jobTitle: jobRangeData.CompanyJobs_Job_Title,
      midPoint: this.formatMidPoint(this.isCurrent, 'Midpoint', jobRangeData.CompanyStructures_Ranges_Mid),
      currentMidPoint: this.formatMidPoint(!this.isCurrent, 'Current Mid', jobRangeData.CompanyStructures_RangeGroup_CurrentStructureMidPoint),
      newMidPoint: this.formatMidPoint(!this.isCurrent, 'New Mid', jobRangeData.CompanyStructures_Ranges_Mid),
      delta: !!delta ? delta.message : delta,
      icon: !!delta ? delta.icon : delta,
      iconColor: !!delta ? delta.color : delta
    });
  }

  private addMidpointLine() {
    this.chartInstance.yAxis[0].addPlotLine(this.plotLinesAndBands.find(plb => plb.id === 'Range Mid'));
  }

  private addAverageLine() {
    this.chartInstance.yAxis[0].addPlotLine(this.plotLinesAndBands.find(plb => plb.id === 'Average ' + this.controlPointDisplay));
  }

  private addSalaryBand() {
    this.chartInstance.yAxis[0].addPlotBand(this.plotLinesAndBands.find(plb => plb.id === 'Salary range'));
  }

  private removeLinesAndBands() {
    if (this.plotLinesAndBands) {
      this.chartInstance.yAxis[0].removePlotBand('Salary range');
      this.chartInstance.yAxis[0].removePlotLine('Mid-point');
      this.chartInstance.yAxis[0].removePlotLine('Average ' + this.prevControlPointDisplay);
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
          id: 'Range Mid',
          width: 2,
          value: this.jobRangeData.CompanyStructures_Ranges_Mid,
          zIndex: 3
        },
        {
          color: '#6236FF',
          id: 'Average ' + this.controlPointDisplay,
          width: 2,
          value: this.jobRangeData.CompanyStructures_RangeGroup_AverageEEMRP,
          zIndex: 3
        },
        {
          id: 'Salary range',
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
      this.chartInstance.series[2].setData(this.midPointSeries, false);
      this.chartInstance.series[4].setData(this.employeeAvgMrpSeriesData, false);
      this.chartInstance.series[5].setData(this.employeeSeriesData, false);
      this.chartInstance.series[6].setData(this.employeeSeriesOutlierData, true);
      this.renameSeries();

      // store the plotLinesAndBands in one of the unused chart properties so we can access it
      this.chartInstance.collectionsWithUpdate = this.plotLinesAndBands;

      // this seemed like a pretty good way to get things to line up. 65 is a constant to account for gaps and headers, the rest is dynamic based on row
      // the one exception is when you have only one employee. We need a bit more padding in that scenario
      this.chartInstance.setSize(null, (40 * this.employeeData.data.length) + (this.employeeData.data.length === 1 ? 95 : 65));
    }
  }

  private renameSeries() {
    // 2 ==  'Average ' + controlPointDisplay
    this.chartInstance.series[2].name = 'Average ' + this.controlPointDisplay;
    // 3 ==  'Employee ' + controlPointDisplay
    this.chartInstance.series[3].name = 'Employee ' + this.controlPointDisplay;
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
  }
}
