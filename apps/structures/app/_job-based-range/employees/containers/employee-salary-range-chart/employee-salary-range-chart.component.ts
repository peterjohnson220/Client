import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getUserLocale } from 'get-user-locale';

import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromJobBasedRangeReducer from '../../../model/reducers';
import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import { StructuresHighchartsService } from '../../../shared/services';
import { PageViewIds } from '../../../shared/constants/page-view-ids';


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
  salaryRangeSeriesData: any;
  averageSeriesData: any;
  employeeSeriesData: any;
  employeeSeriesOutlierData: any;
  chartLocale: string; // en-US
  chartInstance: Highcharts.Chart;
  dataSubscription: Subscription;
  jobDataSubscription: Subscription;
  metadataSubscription: Subscription;
  pageViewId = PageViewIds.Employees;
  jobRangeViewId = PageViewIds.Model;
  currency: string;
  jobRangeGroupData: any;
  employeeData: any;
  jobRangeData: any;
  controlPointDisplay: string;

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>,
    private route: ActivatedRoute
  ) {
    this.metadataSubscription = this.store.select(fromSharedJobBasedRangeReducer.getMetadata).subscribe(md => {
      if (md) {
        this.currency = md.Currency;
        this.controlPointDisplay = md.ControlPointDisplay;
        this.chartLocale = getUserLocale();
        this.chartOptions = StructuresHighchartsService.getEmployeeRangeOptions(this.chartLocale, this.currency, this.controlPointDisplay);
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
    // if we somehow don't have a chart max OR this employees salary is higher than the current max, set it
    if (!this.chartMax || (currentRow.CompanyEmployees_BaseSalaryCalculatedStructureRangeGroup > this.chartMax)) {
      this.chartMax = currentRow.CompanyEmployees_BaseSalaryCalculatedStructureRangeGroup;
    }
    // same logic for min but reversed, obviously
    if (!this.chartMin || (currentRow.CompanyEmployees_BaseSalaryCalculatedStructureRangeGroup < this.chartMin)) {
      this.chartMin = currentRow.CompanyEmployees_BaseSalaryCalculatedStructureRangeGroup;
    }
  }

  private addEmployee(xCoordinate, currentRow, jobRangeData) {
    // if this employee falls within the salary range, add to employee series. else, add to outlier employee series
    const min = jobRangeData.CompanyStructures_Ranges_Min;
    const max = jobRangeData.CompanyStructures_Ranges_Max;
    const salary = currentRow.CompanyEmployees_BaseSalaryCalculatedStructureRangeGroup;
    if (salary >= min && salary <= max) {
      this.employeeSeriesData.push({ x: xCoordinate, y: currentRow.CompanyEmployees_BaseSalaryCalculatedStructureRangeGroup});
    } else {
      this.employeeSeriesOutlierData.push({ x: xCoordinate, y: currentRow.CompanyEmployees_BaseSalaryCalculatedStructureRangeGroup});
    }

  }

  private addMidpointLine(jobRangeData) {
    this.chartInstance.yAxis[0].addPlotLine({
      color: '#CD8C01',
      width: 2,
      value: StructuresHighchartsService.calculateMidpoint(
        jobRangeData.CompanyStructures_Ranges_Min, jobRangeData.CompanyStructures_Ranges_Max),
      zIndex: 10
    });

  }

  private addAverageLine() {
    this.chartInstance.yAxis[0].addPlotLine({
      color: '#6236FF',
      width: 2,
      value: this.jobRangeData.CompanyStructures_RangeGroup_AverageEEMRP,
      zIndex: 10
    });

  }

  private addSalaryBand() {
    this.chartInstance.yAxis[0].addPlotBand(
      {from: this.chartMin, to: this.chartMax, color: 'rgba(36,134,210,0.45)', zIndex: 0 }
    );
  }

  private processChartData() {
    // make sure all the proper data is present. If not present, don't do anything yet. this is because we can't control the order in which both datasets appear
    if (this.jobRangeGroupData && this.employeeData) {
      // first we need to plot anything that applies to the chart as a whole, including salary range, midpoint and avg

      this.jobRangeData = this.jobRangeGroupData.data.find(jr => jr.CompanyStructures_Ranges_CompanyStructuresRanges_ID === this.rangeId);

      this.averageSeriesData = [];
      this.employeeSeriesData = [];
      this.employeeSeriesOutlierData = [];

      this.setInitialMinMax(this.jobRangeData);

      this.addMidpointLine(this.jobRangeData);

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
      // set the series data (0 - salaryRange, 1 - midpoint, 2 - avg salary, 3 - outliers)
      this.chartInstance.series[0].setData(this.salaryRangeSeriesData, false);
      this.chartInstance.series[3].setData(this.employeeSeriesData, false);
      this.chartInstance.series[4].setData(this.employeeSeriesOutlierData, true);

      // this seemed like a pretty good way to get things to line up. 65 is a constant to account for gaps and headers, the rest is dynamic based on rows
      this.chartInstance.setSize(null, (40 * this.employeeData.data.length) + 65);
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
