import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import Highcharts from 'highcharts';
import {
  format,
  getQuarter,
  setMonth,
  setDate,
  addMonths,
  startOfDay,
  differenceInMonths
} from 'date-fns';

import { PayMarketPricingHistory } from 'libs/models/payfactors-api';
import { AsyncStateObj } from 'libs/models';
import { annualDisplay, CompPipe, compRate } from 'libs/core';

import * as fromPricingHistoryChartReducer from '../../reducers';

@Component({
  selector: 'pf-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {

  readonly compPipe = new CompPipe(this.decimalPipe);

  Highcharts: typeof Highcharts = Highcharts;
  chartRef: Highcharts.Chart;
  chartOptions: Highcharts.Options = this.getChartOptions();
  updateFlag = false;

  getDataSubscription: Subscription;
  getFiltersSubscription: Subscription;

  chartData$: Observable<AsyncStateObj<PayMarketPricingHistory[]>>;

  rate: string = compRate.annual;

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  }

  constructor(private store: Store<fromPricingHistoryChartReducer.State>, private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {

    this.chartData$ = this.store.select(fromPricingHistoryChartReducer.getData);

    this.getDataSubscription = this.store.select(fromPricingHistoryChartReducer.getData)
      .subscribe(o => {
        this.updateChartData(o.obj);
      });

    this.getFiltersSubscription = this.store.select(fromPricingHistoryChartReducer.getFilters)
      .subscribe(o => {
        this.rate = o.Rate;
      });
  }

  updateChartData(data: PayMarketPricingHistory[]) {
    if (this.chartRef && data) {

      while (this.chartRef.series.length > 0) {
        this.chartRef.series[0].remove(true);
      }

      // Chart Date
      data.forEach(p => {
        const newSeries: any = {
          type: 'line',
          animation: false,
          name: p.PayMarketName,
          data: p.PricingData
        };
        this.chartRef.addSeries(newSeries, true);
      });

      // YAxis labels
      const compPipe = this.compPipe;
      const rate = this.rate;
      this.chartRef.yAxis[0].update(
        {
          labels: {
            formatter: function () {
              return compPipe.transform(this.value, rate, annualDisplay.truncatedRounded);
            }
          }
        }
      );

      this.chartRef.tooltip.update(
        {
          formatter: function () {
            return `<b>${this.series.name}</b>
            <br> <b>Pricing Date: </b>${format(new Date(this.x), 'MM/dd/yyyy')}
            <br> <b>Base MRP: </b>${compPipe.transform(this.y, rate)}`;
          }
        }
      );

      this.updateFlag = true;
    }
  }

  getChartOptions(): Highcharts.Options {

    const chartCmp = this;

    return {
      chart: {
        animation: false,
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          text: 'Base MRP'
        },
      },
      xAxis: {
        type: 'datetime',
        labels: {
          formatter: function () {
            let dateFormatter = '%Y';
            const startDate = setDate(startOfDay(new Date(this.axis.min)), 1);
            const endDate = setDate(startOfDay(new Date(this.axis.max)), 1);
            const differenceMonths = differenceInMonths(endDate, startDate);
            if (differenceMonths <= 4) {
              dateFormatter = `%b %Y`;
            } else if (differenceMonths <= 24) {
              dateFormatter = `Q${getQuarter(new Date(this.value))} %Y`;
            }
            return Highcharts.dateFormat(dateFormatter, this.value);
          },
        },
        tickPositioner: function () {
          let positions = this.tickPositions;

          if (this.max && this.min && this.max !== this.min) {
            const startDate = setDate(startOfDay(new Date(this.min)), 1);
            const endDate = setDate(startOfDay(new Date(this.max)), 1);
            const differenceMonths = differenceInMonths(endDate, startDate);

            if (differenceMonths > 24) {
              positions = chartCmp.updateTickPositions(setMonth(startDate, 1), endDate, 12);
            } else if (differenceMonths > 4) {
              positions = chartCmp.updateTickPositions(startDate, endDate, 3);
            } else {
              positions = chartCmp.updateTickPositions(startDate, endDate, 1);              
            }
          }

          return positions;
        }
      },
      legend: {
        useHTML: true,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        floating: false,
        borderWidth: 1
      }
    };
  }

  ngOnDestroy() {
    this.getDataSubscription.unsubscribe();
    this.getFiltersSubscription.unsubscribe();
  }

  updateTickPositions(start: Date, end: Date, increment: number) {
    const positions = [];
    let curDate = start

    while (curDate <= end) {
      positions.push(curDate.getTime());
      curDate = addMonths(curDate, increment);
    }
    return positions;
  }

}
