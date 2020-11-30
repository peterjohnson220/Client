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
export class CompensationChartsComponent implements OnInit, OnChanges {

  @Input() employeeDetails: EmployeeDetails;

  constructor(private decimalPipe: DecimalPipe) { }

  tccChart: ChartDataModel[] = [];
  tdcChart: ChartDataModel[] = [];
  currencyCode: string;

  compPipe = new CompPipe(this.decimalPipe);

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeDetails']) {
      const newEmployeeDetails = changes['employeeDetails'].currentValue;

      // Total Cash Compensation
      this.populateChart(this.tccChart, newEmployeeDetails.Base_Salary, newEmployeeDetails.Bonus,
        newEmployeeDetails.STI, newEmployeeDetails.Total_Cash_Comp, newEmployeeDetails.LTI);

      // Total Direct Compensation
      this.populateChart(this.tdcChart, newEmployeeDetails.Base_Salary, newEmployeeDetails.Bonus, newEmployeeDetails.STI,
        newEmployeeDetails.Total_Direct_Comp, newEmployeeDetails.LTI, true);

      this.currencyCode = changes['employeeDetails'].currentValue.Currency_Code;
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

      chartData.push({ category: 'Other',
        value: calculatedValue,
        colorField: '#a6a6a6'});

      return;
    }

    chartData.push({ category: 'Bonus',
      value: bonus,
      colorField: '#bc4444'});

    chartData.push({ category: 'STI',
      value: sti,
      colorField: '#7151e4'});

    if (isTdcChart) {
      chartData.push({ category: 'LTIP',
        value: lti,
        colorField: '#6cb420'});
    }
  }
}
