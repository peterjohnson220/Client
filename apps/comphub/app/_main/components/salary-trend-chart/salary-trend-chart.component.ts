import { Component, Input } from '@angular/core';

import { JobSalaryTrend } from '../../models';

@Component({
  selector: 'pf-salary-trend-chart',
  templateUrl: './salary-trend-chart.component.html',
  styleUrls: ['./salary-trend-chart.component.scss']
})
export class SalaryTrendChartComponent {
  @Input() salaryTrendData: JobSalaryTrend;
  @Input() isHourly: boolean;

  constructor() { }

  get absoluteValueOfPercentageChange(): number {
    return !!this.salaryTrendData && !!this.salaryTrendData.PercentageChange
      ? Math.abs(this.salaryTrendData.PercentageChange)
      : 0;
  }

}
