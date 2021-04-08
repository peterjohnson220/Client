import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
Exporting(Highcharts);
OfflineExporting(Highcharts);

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
  categories: string[];
  data: any[];
  img: any;

  Highcharts: typeof Highcharts = Highcharts;
  chart: Highcharts.Chart;
  chartOptions: Highcharts.Options = this.getChartOptions();

  constructor(private datePipe: DatePipe, private currencyPipe: CurrencyPipe, private sanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.salaryTrendData?.currentValue) {
      this.absoluteValueOfPercentageChange = this.salaryTrendData.PercentageChange
        ? Math.abs(this.salaryTrendData.PercentageChange)
        : 0;
      this.localSalaryTrendData = cloneDeep(this.salaryTrendData);

      this.refreshChart();
    }

    if(changes?.isHourly?.currentValue != null && this.localSalaryTrendData != null){
      this.refreshChart();
    }
  }

  rangeChartCallback(chart: Highcharts.Chart = null) {
    // set the instance
    if (chart) {
      this.chart = chart;

      this.refreshChartImage();
    }
  }

  refreshChart(): void {
    this.categories = [];
    this.data = [];

    this.localSalaryTrendData.Data.forEach(item => {
      this.categories.push(item.EffectiveDate.toString());

      this.data.push([item.EffectiveDate.toString(), this.isHourly ? item.SalaryHourly : item.SalaryAnnual]);
    });

    this.chartOptions = this.getChartOptions();

    this.refreshChartImage();
  }

  refreshChartImage(): void {
    if(this.chart) {
      const svg = this.chart.getSVG(this.chartOptions);
      const blob = new Blob([svg], {type: 'image/svg+xml'});
      this.img = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    }
  }

  getChartOptions(): any {
    return {
      chart: {
        type: 'area',
        height: 125,
        width: 250,
        plotBorderWidth: 1
      },
      title: {
        text: undefined
      },
      colors: ['#009900'],
      tooltip: {
        backgroundColor: '#009900',
        animation: false,
        style:{
          color: '#FFFFFF'
        },
        formatter: (data) => {
          let point = data.chart.hoverPoint;
          let transformedDate = this.datePipe.transform(point.category, 'MM/yyyy')
          let transformedSalary = this.currencyPipe.transform(point.y, this.currencyCode, 'symbol-narrow', this.isHourly ? '1.2-2' : '1.0-0');
          return transformedDate + ': ' + transformedSalary;
        }
      },
      xAxis:{
        categories: this.categories,
        labels: {
          enabled: false
        }
      },
      yAxis:{
        tickPositioner: function () {
          var positions = [];
          var increment = Math.ceil((this.dataMax - this.dataMin) / 2);
          var tick = Math.floor(this.dataMin - (increment * 2));

          if (this.dataMax !== null && this.dataMin !== null) {
            for (tick; tick - increment <= this.dataMax; tick += increment) {
              positions.push(tick);
            }
          }
          return positions;
        },
        title: null,
        labels: {
          enabled: false
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
          name: 'National',
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
