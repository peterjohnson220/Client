import { Component } from '@angular/core';

import { SalaryTrendChartComponent } from '../salary-trend-chart.component';

@Component({
  selector: 'pf-historical-trend-chart',
  templateUrl: '../salary-trend-chart.component.html',
  styleUrls: ['../salary-trend-chart.component.scss']
})

export class HistoricalTrendChartComponent extends SalaryTrendChartComponent {

  refreshChart(): void {
    this.categories = [];
    this.data = [];

    this.localSalaryTrendData.Data.forEach(item => {
      this.categories.push(this.datePipe.transform(item.EffectiveDate, 'MM/yyyy').toString());

      this.data.push([item.EffectiveDate.toString(), this.isHourly ? item.SalaryHourly : item.SalaryAnnual]);
    });

    this.chartOptions = this.getChartOptions();

    this.refreshChartImage();
  }

  getChartOptions(): any {

    let colors = ['#000000'];
    if (!!this.salaryTrendData && this.salaryTrendData.PercentageChange > 0) {
      colors = ['#009900'];
    } else if (!!this.salaryTrendData && this.salaryTrendData.PercentageChange < 0) {
      colors = ['#a80004'];
    }

    return {
      chart: {
        type: 'area',
        height: 500,
        width: 1000,
        plotBorderWidth: 1
      },
      title: {
        text: 'Salary Trend'
      },
      colors: colors,
      tooltip: {
        backgroundColor: colors[0],
        animation: false,
        style: {
          color: '#FFFFFF'
        },
        formatter: (data) => {
          const point = data.chart.hoverPoint;
          const transformedDate = point.category;
          const transformedSalary = this.currencyPipe.transform(point.y, this.currencyCode, 'symbol-narrow', this.isHourly ? '1.2-2' : '1.0-0');
          return transformedDate + ': ' + transformedSalary;
        }
      },
      xAxis: {
        categories: this.categories,
        labels: {
          enabled: true
        }
      },
      yAxis: {
        tickPositioner: function () {
          const positions = [];
          const increment = (this.dataMax === this.dataMin) ? this.dataMax / 2 : Math.ceil((this.dataMax - this.dataMin) / 2);
          let tick = Math.floor(this.dataMin - (increment * 2));

          if (this.dataMax !== null && this.dataMin !== null) {
            for (tick; tick - increment <= this.dataMax; tick += increment) {
              positions.push(tick);
            }
          }
          return positions;
        },
        title: null,
        labels: {
          enabled: true
        }
      },
      plotOptions: {
        area: {
          marker: {
            enabled: false,
          }
        },
        series: {
          pointPlacement: 'on'
        }
      },
      series: [
        {
          name: 'Peer Trends',
          lineWidth: 0,
          data: this.data
        }
      ],
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      }
    };
  }
}

