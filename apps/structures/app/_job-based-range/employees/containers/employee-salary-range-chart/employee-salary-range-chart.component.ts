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
import { DataPointSeries } from '../../../shared/models/data-point-series.model';
import { RangeDistributionTypeIds } from '../../../shared/constants/range-distribution-type-ids';
import { SalaryRangeSeries } from '../../../shared/models/salary-range-series.model';

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
  rate: string;
  isCurrent: boolean;
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

  private determineChartMin() {
    let comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Min == null ? 0 : this.jobRangeData.CompanyStructures_Ranges_Min;

    // Tertile - Quartile - Quintile
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
      if (!!this.jobRangeData.CompanyStructures_Ranges_Tertile_First && this.jobRangeData.CompanyStructures_Ranges_Tertile_First < comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Tertile_First;
      }

      if (!!this.jobRangeData.CompanyStructures_Ranges_Tertile_Second && this.jobRangeData.CompanyStructures_Ranges_Tertile_Second < comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Tertile_Second;
      }
    } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
      if (!!this.jobRangeData.CompanyStructures_Ranges_Quartile_First
        && this.jobRangeData.CompanyStructures_Ranges_Quartile_First < comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Quartile_First;
      }

      if (!!this.jobRangeData.CompanyStructures_Ranges_Quartile_Second
        && this.jobRangeData.CompanyStructures_Ranges_Quartile_Second < comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Quartile_Second;
      }
    } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
      if (!!this.jobRangeData.CompanyStructures_Ranges_Quintile_First
        && this.jobRangeData.CompanyStructures_Ranges_Quintile_First < comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Quintile_First;
      }

      if (!!this.jobRangeData.CompanyStructures_Ranges_Quintile_Second
        && this.jobRangeData.CompanyStructures_Ranges_Quintile_Second < comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Quintile_Second;
      }

      if (!!this.jobRangeData.CompanyStructures_Ranges_Quintile_Third
        && this.jobRangeData.CompanyStructures_Ranges_Quintile_Third < comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Quintile_Third;
      }

      if (!!this.jobRangeData.CompanyStructures_Ranges_Quintile_Fourth
        && this.jobRangeData.CompanyStructures_Ranges_Quintile_Fourth < comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Quintile_Fourth;
      }
    }

    if (this.chartMin === undefined || comparisonValue < this.chartMin) {
      this.chartMin = comparisonValue;
    }
  }

  private determineChartMax() {
    let comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Max;

    // Tertile - Quartile - Quintile
    if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
      if (!!this.jobRangeData.CompanyStructures_Ranges_Tertile_First && this.jobRangeData.CompanyStructures_Ranges_Tertile_First > comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Tertile_First;
      }

      if (!!this.jobRangeData.CompanyStructures_Ranges_Tertile_Second && this.jobRangeData.CompanyStructures_Ranges_Tertile_Second > comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Tertile_Second;
      }
    } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
      if (!!this.jobRangeData.CompanyStructures_Ranges_Quartile_First
        && this.jobRangeData.CompanyStructures_Ranges_Quartile_First > comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Quartile_First;
      }

      if (!!this.jobRangeData.CompanyStructures_Ranges_Quartile_Second
        && this.jobRangeData.CompanyStructures_Ranges_Quartile_Second > comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Quartile_Second;
      }
    } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quintile) {
      if (!!this.jobRangeData.CompanyStructures_Ranges_Quintile_First
        && this.jobRangeData.CompanyStructures_Ranges_Quintile_First > comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Quintile_First;
      }

      if (!!this.jobRangeData.CompanyStructures_Ranges_Quintile_Second
        && this.jobRangeData.CompanyStructures_Ranges_Quintile_Second > comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Quintile_Second;
      }

      if (!!this.jobRangeData.CompanyStructures_Ranges_Quintile_Third
        && this.jobRangeData.CompanyStructures_Ranges_Quintile_Third > comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Quintile_Third;
      }

      if (!!this.jobRangeData.CompanyStructures_Ranges_Quintile_Fourth
        && this.jobRangeData.CompanyStructures_Ranges_Quintile_Fourth > comparisonValue) {
        comparisonValue = this.jobRangeData.CompanyStructures_Ranges_Quintile_Fourth;
      }
    }

    if (this.chartMax === undefined || comparisonValue > this.chartMax) {
      this.chartMax = comparisonValue;
    }
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
    this.salaryRangeSeriesDataModel.Quartile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyStructures_Ranges_Quartile_First, this.jobRangeData.CompanyStructures_Ranges_Quartile_Second));
  }

  private addSalaryRangeQuintile(xCoordinate) {
    this.salaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyStructures_Ranges_Quintile_First, this.jobRangeData.CompanyStructures_Ranges_Quintile_Second));

    this.salaryRangeSeriesDataModel.Quintile.push(StructuresHighchartsService.formatColumnRange(
      xCoordinate, this.jobRangeData.CompanyStructures_Ranges_Quintile_Third, this.jobRangeData.CompanyStructures_Ranges_Quintile_Fourth));
  }

  private addMidPoint(xCoordinate) {
    const delta = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      this.jobRangeData.CompanyStructures_Ranges_Mid, this.jobRangeData.CompanyStructures_RangeGroup_CurrentStructureMidPoint);

    this.dataPointSeriesDataModel.Mid.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyStructures_Ranges_Mid,
      jobTitle: this.jobRangeData.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Midpoint',
        this.jobRangeData.CompanyStructures_Ranges_Mid, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Mid',
        this.jobRangeData.CompanyStructures_RangeGroup_CurrentStructureMidPoint, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Mid',
        this.jobRangeData.CompanyStructures_Ranges_Mid, this.chartLocale, this.metaData),
      delta: !!delta ? delta.message : delta,
      icon: !!delta ? delta.icon : delta,
      iconColor: !!delta ? delta.color : delta
    });
  }

  private addTertilePoint(xCoordinate) {
    // Tertile First
    const deltaTertileFirst = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      this.jobRangeData.CompanyStructures_Ranges_Tertile_First, this.jobRangeData.CompanyStructures_Ranges_Tertile_CurrentFirst);

    this.dataPointSeriesDataModel.TertileFirst.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyStructures_Ranges_Tertile_First,
      jobTitle: this.jobRangeData.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 1st 3rd',
        this.jobRangeData.CompanyStructures_Ranges_Tertile_First, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 1st 3rd',
        this.jobRangeData.CompanyStructures_Ranges_Tertile_CurrentFirst, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 1st 3rd',
        this.jobRangeData.CompanyStructures_Ranges_Tertile_First, this.chartLocale, this.metaData),
      delta: !!deltaTertileFirst ? deltaTertileFirst.message : deltaTertileFirst,
      icon: !!deltaTertileFirst ? deltaTertileFirst.icon : deltaTertileFirst,
      iconColor: !!deltaTertileFirst ? deltaTertileFirst.color : deltaTertileFirst
    });

    // Tertile Second
    const deltaTertileSecond = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      this.jobRangeData.CompanyStructures_Ranges_Tertile_Second, this.jobRangeData.CompanyStructures_Ranges_Tertile_CurrentSecond);

    this.dataPointSeriesDataModel.TertileSecond.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyStructures_Ranges_Tertile_Second,
      jobTitle: this.jobRangeData.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 2nd 3rd',
        this.jobRangeData.CompanyStructures_Ranges_Tertile_Second, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 2nd 3rd',
        this.jobRangeData.CompanyStructures_Ranges_Tertile_CurrentSecond, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 2nd 3rd',
        this.jobRangeData.CompanyStructures_Ranges_Tertile_Second, this.chartLocale, this.metaData),
      delta: !!deltaTertileSecond ? deltaTertileSecond.message : deltaTertileSecond,
      icon: !!deltaTertileSecond ? deltaTertileSecond.icon : deltaTertileSecond,
      iconColor: !!deltaTertileSecond ? deltaTertileSecond.color : deltaTertileSecond
    });
  }

  private addQuartilePoint(xCoordinate) {
    // Quartile First
    const deltaQuartileFirst = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      this.jobRangeData.CompanyStructures_Ranges_Quartile_First, this.jobRangeData.CompanyStructures_Ranges_Quartile_CurrentFirst);

    this.dataPointSeriesDataModel.QuartileFirst.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyStructures_Ranges_Quartile_First,
      jobTitle: this.jobRangeData.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 1st 4th',
        this.jobRangeData.CompanyStructures_Ranges_Quartile_First, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 1st 4th',
        this.jobRangeData.CompanyStructures_Ranges_Quartile_CurrentFirst, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 1st 4th',
        this.jobRangeData.CompanyStructures_Ranges_Quartile_First, this.chartLocale, this.metaData),
      delta: !!deltaQuartileFirst ? deltaQuartileFirst.message : deltaQuartileFirst,
      icon: !!deltaQuartileFirst ? deltaQuartileFirst.icon : deltaQuartileFirst,
      iconColor: !!deltaQuartileFirst ? deltaQuartileFirst.color : deltaQuartileFirst
    });

    // Quartile Second
    const deltaQuartileSecond = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      this.jobRangeData.CompanyStructures_Ranges_Quartile_Second, this.jobRangeData.CompanyStructures_Ranges_Quartile_CurrentSecond);

    this.dataPointSeriesDataModel.QuartileSecond.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyStructures_Ranges_Quartile_Second,
      jobTitle: this.jobRangeData.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 3rd 4th',
        this.jobRangeData.CompanyStructures_Ranges_Quartile_Second, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 3rd 4th',
        this.jobRangeData.CompanyStructures_Ranges_Quartile_CurrentSecond, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 3rd 4th',
        this.jobRangeData.CompanyStructures_Ranges_Quartile_Second, this.chartLocale, this.metaData),
      delta: !!deltaQuartileSecond ? deltaQuartileSecond.message : deltaQuartileSecond,
      icon: !!deltaQuartileSecond ? deltaQuartileSecond.icon : deltaQuartileSecond,
      iconColor: !!deltaQuartileSecond ? deltaQuartileSecond.color : deltaQuartileSecond
    });
  }

  private addQuintilePoint(xCoordinate) {
    // Quintile First
    const deltaQuintileFirst = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      this.jobRangeData.CompanyStructures_Ranges_Quintile_First, this.jobRangeData.CompanyStructures_Ranges_Quintile_CurrentFirst);

    this.dataPointSeriesDataModel.QuintileFirst.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyStructures_Ranges_Quintile_First,
      jobTitle: this.jobRangeData.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 1st 5th',
        this.jobRangeData.CompanyStructures_Ranges_Quintile_First, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 1st 5th',
        this.jobRangeData.CompanyStructures_Ranges_Quintile_CurrentFirst, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 1st 5th',
        this.jobRangeData.CompanyStructures_Ranges_Quintile_First, this.chartLocale, this.metaData),
      delta: !!deltaQuintileFirst ? deltaQuintileFirst.message : deltaQuintileFirst,
      icon: !!deltaQuintileFirst ? deltaQuintileFirst.icon : deltaQuintileFirst,
      iconColor: !!deltaQuintileFirst ? deltaQuintileFirst.color : deltaQuintileFirst
    });

    // Quintile Second
    const deltaQuintileSecond = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      this.jobRangeData.CompanyStructures_Ranges_Quintile_Second, this.jobRangeData.CompanyStructures_Ranges_Quintile_CurrentSecond);

    this.dataPointSeriesDataModel.QuintileSecond.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyStructures_Ranges_Quintile_Second,
      jobTitle: this.jobRangeData.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 2nd 5th',
        this.jobRangeData.CompanyStructures_Ranges_Quintile_Second, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 2nd 5th',
        this.jobRangeData.CompanyStructures_Ranges_Quintile_CurrentSecond, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 2nd 5th',
        this.jobRangeData.CompanyStructures_Ranges_Quintile_Second, this.chartLocale, this.metaData),
      delta: !!deltaQuintileSecond ? deltaQuintileSecond.message : deltaQuintileSecond,
      icon: !!deltaQuintileSecond ? deltaQuintileSecond.icon : deltaQuintileSecond,
      iconColor: !!deltaQuintileSecond ? deltaQuintileSecond.color : deltaQuintileSecond
    });

    // Quintile Third
    const deltaQuintileThird = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      this.jobRangeData.CompanyStructures_Ranges_Quintile_Third, this.jobRangeData.CompanyStructures_Ranges_Quintile_CurrentThird);

    this.dataPointSeriesDataModel.QuintileThird.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyStructures_Ranges_Quintile_Third,
      jobTitle: this.jobRangeData.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 3rd 5th',
        this.jobRangeData.CompanyStructures_Ranges_Quintile_Third, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 3rd 5th',
        this.jobRangeData.CompanyStructures_Ranges_Quintile_CurrentThird, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 3rd 5th',
        this.jobRangeData.CompanyStructures_Ranges_Quintile_Third, this.chartLocale, this.metaData),
      delta: !!deltaQuintileThird ? deltaQuintileThird.message : deltaQuintileThird,
      icon: !!deltaQuintileThird ? deltaQuintileThird.icon : deltaQuintileThird,
      iconColor: !!deltaQuintileThird ? deltaQuintileThird.color : deltaQuintileThird
    });

    // Quintile Fourth
    const deltaQuintileFourth = StructuresHighchartsService.formatDataPointDelta(this.hasCurrentStructure, this.chartLocale, this.metaData,
      this.jobRangeData.CompanyStructures_Ranges_Quintile_Fourth, this.jobRangeData.CompanyStructures_Ranges_Quintile_CurrentFourth);

    this.dataPointSeriesDataModel.QuintileFourth.push({
      x: xCoordinate,
      y: this.jobRangeData.CompanyStructures_Ranges_Quintile_Fourth,
      jobTitle: this.jobRangeData.CompanyJobs_Job_Title,
      dataPoint: StructuresHighchartsService.formatCurrentDataPoint(this.hasCurrentStructure, 'Top 4th 5th',
        this.jobRangeData.CompanyStructures_Ranges_Quintile_Fourth, this.chartLocale, this.metaData),
      currentDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'Current Top 4th 5th',
        this.jobRangeData.CompanyStructures_Ranges_Quintile_CurrentFourth, this.chartLocale, this.metaData),
      newDataPoint: StructuresHighchartsService.formatNewDataPoint(this.hasCurrentStructure, 'New Top 4th 5th',
        this.jobRangeData.CompanyStructures_Ranges_Quintile_Fourth, this.chartLocale, this.metaData),
      delta: !!deltaQuintileFourth ? deltaQuintileFourth.message : deltaQuintileFourth,
      icon: !!deltaQuintileFourth ? deltaQuintileFourth.icon : deltaQuintileFourth,
      iconColor: !!deltaQuintileFourth ? deltaQuintileFourth.color : deltaQuintileFourth
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
      // first we need to plot anything that applies to the chart as a whole, including salary range, midpoint and avg
      this.jobRangeData = this.jobRangeGroupData.data.find(jr => jr.CompanyStructures_Ranges_CompanyStructuresRanges_ID === this.rangeId);
      this.hasCurrentStructure = this.jobRangeData.CompanyStructures_RangeGroup_CurrentStructureMidPoint === null;

      this.salaryRangeSeriesDataModel = {
        MinMidMax: [],
        Quartile: [],
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

      this.determineChartMin();
      this.determineChartMax();

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
      this.renameSeries();

      // Tertile - Quartile - Quintile: salary range + data points
      if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Tertile) {
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.SalaryRangeTertile].setData(this.salaryRangeSeriesDataModel.Tertile, false);
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.RangeTertileFirst].setData(this.dataPointSeriesDataModel.TertileFirst, false);
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.RangeTertileSecond].setData(this.dataPointSeriesDataModel.TertileSecond, false);
      } else if (this.rangeDistributionTypeId === RangeDistributionTypeIds.Quartile) {
        this.chartInstance.series[EmployeeSalaryRangeChartSeries.SalaryRangeQuartile].setData(this.salaryRangeSeriesDataModel.Quartile, false);
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
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
    this.jobDataSubscription.unsubscribe();
    this.jobRangeViewIdSubscription.unsubscribe();
  }
}
