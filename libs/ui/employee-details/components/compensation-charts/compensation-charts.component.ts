import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { EmployeeDetails } from '../../models/employee-details.model';
import { ChartDataModel } from '../../models/chart-data.model';
import { CompPipe } from '../../../../core/pipes';

@Component({
  selector: 'pf-compensation-charts',
  templateUrl: './compensation-charts.component.html',
  styleUrls: ['./compensation-charts.component.scss']
})
export class CompensationChartsComponent implements OnChanges {

  @Input() employeeDetails: EmployeeDetails;

  constructor(private decimalPipe: DecimalPipe) { }

  tccChart: ChartDataModel[] = [];
  tdcChart: ChartDataModel[] = [];
  currencyCode: string;

  compPipe = new CompPipe(this.decimalPipe);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeDetails']) {
      const newEmployeeDetails = changes['employeeDetails'].currentValue;

      // Total Cash Compensation
      this.populateChart(this.tccChart, newEmployeeDetails.BaseSalary, newEmployeeDetails.Bonus,
        newEmployeeDetails.STI, newEmployeeDetails.TCC_Override, newEmployeeDetails.LTI);

      // Total Direct Compensation
      this.populateChart(this.tdcChart, newEmployeeDetails.BaseSalary, newEmployeeDetails.Bonus, newEmployeeDetails.STI,
        newEmployeeDetails.TDC_Override, newEmployeeDetails.LTI, true);

      this.currencyCode = changes['employeeDetails'].currentValue.CurrencyCode;
    }
  }

  populateChart(chartData: ChartDataModel[], baseSalary: number, bonus: number, sti: number, compensationValue: number,
                lti: number, isTdcChart: boolean = false): void {
    
    chartData.push({ category: 'Base Salary',
      value: baseSalary,
      colorField: '#3c89c3'});

    if (compensationValue !== 0 && compensationValue !== null && compensationValue !== undefined) {
      // if tcc or tdc is available, do not show the other values as tcc/tdc encompasses bonus, sti, and ltip
      const calculatedValue = Math.round((compensationValue - baseSalary) * 100) / 100;

      if (calculatedValue <= 0) {
        return;
      }

      chartData.push({ category: 'Other',
        value: calculatedValue,
        colorField: '#a6a6a6'});

      return;
    }

    chartData.push({ category: 'Bonus',
      value: bonus === null ? 0 : bonus,
      colorField: '#bc4444'});

    chartData.push({ category: 'STI',
      value: sti === null ? 0 : sti,
      colorField: '#7151e4'});

    if (isTdcChart) {
      chartData.push({ category: 'LTIP',
        value: lti === null ? 0 : lti,
        colorField: '#6cb420'});
    }
  }
}
