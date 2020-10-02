import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';

import { JobSalaryTrend } from '../../models';

@Component({
  selector: 'pf-salary-trend-chart',
  templateUrl: './salary-trend-chart.component.html',
  styleUrls: ['./salary-trend-chart.component.scss']
})
export class SalaryTrendChartComponent implements OnChanges {
  @Input() salaryTrendData: JobSalaryTrend;
  @Input() isHourly: boolean;
  @Input() currencyCode: string;

  absoluteValueOfPercentageChange: number;
  localSalaryTrendData: JobSalaryTrend;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.salaryTrendData?.currentValue) {
      this.absoluteValueOfPercentageChange = this.salaryTrendData.PercentageChange
        ? Math.abs(this.salaryTrendData.PercentageChange)
        : 0;
      this.localSalaryTrendData = cloneDeep(this.salaryTrendData);
    }
  }

}
