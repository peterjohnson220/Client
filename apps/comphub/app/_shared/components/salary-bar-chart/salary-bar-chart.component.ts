import { Component, Input } from '@angular/core';

import { DataCardHelper } from '../../helpers';

@Component({
  selector: 'pf-salary-bar-chart',
  templateUrl: './salary-bar-chart.component.html',
  styleUrls: ['./salary-bar-chart.component.scss']
})
export class SalaryBarChartComponent {
  @Input() isHourly: boolean;
  @Input() salary25?: number;
  @Input() salary50?: number;
  @Input() salary75?: number;
  @Input() currencyCode: string;

  constructor() { }

  calculateDataByRate(value: number): number {
    return this.isHourly
      ? DataCardHelper.calculateDataByHourlyRate(value)
      : value / 1000;
  }
}
