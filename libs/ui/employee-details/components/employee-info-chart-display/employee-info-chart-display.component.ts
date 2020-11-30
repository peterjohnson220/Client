import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataModel } from '../../models/chart-data.model';

@Component({
  selector: 'pf-employee-info-chart-display',
  templateUrl: './employee-info-chart-display.component.html',
  styleUrls: ['./employee-info-chart-display.component.scss']
})
export class EmployeeInfoChartDisplayComponent implements OnInit, OnChanges {

  @Input() chartData: ChartDataModel[] = [];
  @Input() currencyCode = 'USD';
  @Input() chartTitle = '';
  @Input() rate = 'Annual';

  constructor() { }

  isEmptyChart = true;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartData']) {
      this.isEmptyChart = true;
      changes['chartData'].currentValue.forEach(item => {
        if (item.value !== 0) {
          this.isEmptyChart = false;
        }
      });
    }
  }

}
