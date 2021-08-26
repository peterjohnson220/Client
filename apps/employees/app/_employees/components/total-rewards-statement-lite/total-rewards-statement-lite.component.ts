import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts';

import { EmployeeTotalRewardsLite } from 'libs/models/payfactors-api';

import { EmployeeTotalRewardsHelper } from '../../helpers';

@Component({
  selector: 'pf-total-rewards-statement-lite',
  templateUrl: './total-rewards-statement-lite.component.html',
  styleUrls: ['./total-rewards-statement-lite.component.scss']
})
export class TotalRewardsStatementLiteComponent implements OnChanges {
  @Input() employeeTotalRewardsLite: EmployeeTotalRewardsLite;

  Highcharts: typeof Highcharts = Highcharts;
  chart: Highcharts.Chart;
  chartOptions: Highcharts.Options;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.employeeTotalRewardsLite?.currentValue) {
      this.chartOptions = this.getChartOptions();
      setTimeout(() => {
        this.chart.reflow();
      }, 0);
    }
  }

  setChartInstance(chart: Highcharts.Chart = null) {
    if (chart) {
      this.chart = chart;
    }
  }

  private getChartOptions(): Highcharts.Options {
    const currencyCode = this.employeeTotalRewardsLite.CurrencyCode;
    return {
      chart: {
        height: 300,
        width: 350
      },
      credits: {
        enabled: false
      },
      title: { text: '' },
      colors: ['#00817D', '#004E4B'],
      tooltip: {
        formatter: (data) => `${data.chart.hoverPoint.name} ${EmployeeTotalRewardsHelper.formatYAxisLabel(
          data.chart.hoverPoint.y,
          currencyCode
        )}`
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          size: 150,
          dataLabels: {
            formatter: function() {
              return EmployeeTotalRewardsHelper.formatYAxisLabel(
                this.point.y,
                currencyCode
              );
            }
          }
        }
      },
      series: [{
        type: 'pie',
        data: [
          {
            name: 'Cash Compensation',
            y: this.employeeTotalRewardsLite.TotalCashCompensation
          },
          {
            name: 'Other',
            y: this.employeeTotalRewardsLite.TotalBenefits
          },
        ]
      }]
    };
  }
}
